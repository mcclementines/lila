//! src/routes/completion.rs

use actix_web::{body::BoxBody, http::header::ContentType, web::Data, HttpResponse, Responder};
use base64::Engine;
use openai_api_rust::{
    chat::{ChatApi, ChatBody},
    Auth, Message, OpenAI, Role,
};
use rand::seq::SliceRandom;

use crate::dictionary::WordDef;

pub async fn completion(dictionary: Data<Vec<WordDef>>) -> impl Responder {
    let word = dictionary
        .choose(&mut rand::thread_rng())
        .unwrap()
        .word
        .to_owned();

    let mut response = get_completion(word).await.unwrap();

    response.choices.push(response.word.clone());
    response.choices.shuffle(&mut rand::thread_rng());

    response
}

pub async fn get_completion(word: String) -> Result<SentenceCompletion, std::io::Error> {
    let auth = Auth::from_env().expect("Could not load OpenAI key");
    let openai = OpenAI::new(auth, "https://api.openai.com/v1/");
    let body = ChatBody {
        model: String::from("ft:gpt-3.5-turbo-0613:personal::7qy7H9zA"),
        max_tokens: Some(128),
        temperature: None,    //Some(0.5_f32),
        top_p: Some(0.5_f32), //None,
        n: Some(1),
        stream: Some(false),
        stop: Some(vec![String::from("###")]),
        presence_penalty: None,
        frequency_penalty: Some(0.4_f32),
        logit_bias: None,
        user: None,
        messages: vec![
            Message {
                role: Role::System,
                content: String::from("Respond in JSON"),
            },
            Message {
                role: Role::User,
                content: format!("WORD: {}\n\n###\n\n", word),
            },
        ],
    };
    let rs = openai.chat_completion_create(&body);
    let choice = rs.unwrap().choices;
    let content = &choice[0].message.as_ref().unwrap().content.trim();

    let encoded_completion = base64::engine::general_purpose::URL_SAFE.encode(content);
    tracing::info!("{}", encoded_completion);

    Ok(serde_json::from_str(content).unwrap())
}

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct SentenceCompletion {
    sentence: String,
    word: String,
    choices: Vec<String>,
}

impl Responder for SentenceCompletion {
    type Body = BoxBody;

    fn respond_to(self, _req: &actix_web::HttpRequest) -> HttpResponse<Self::Body> {
        let body = serde_json::to_string(&self).unwrap();

        HttpResponse::Ok()
            .content_type(ContentType::json())
            .body(body)
    }
}

pub enum Model {
    SentenceCompletion,
}
