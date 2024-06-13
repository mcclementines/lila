//! src/routes/completion.rs

use actix_web::{
    body::BoxBody,
    http::header::ContentType,
    web::{self, Data},
    HttpResponse, Responder,
};
use chrono::{DateTime, Utc};
use mongodb::{bson::doc, Client, Collection};
use openai_api_rust::{
    chat::{ChatApi, ChatBody},
    Auth, Message, OpenAI, Role,
};
use rand::seq::SliceRandom;

use crate::utils::{dictionary::WordDef, random_string::generate_base62_string};

#[tracing::instrument(skip_all)]
pub async fn completion(
    mongodb_client: Data<Client>,
    dictionary: Data<Vec<WordDef>>,
) -> impl Responder {
    let word = dictionary
        .choose(&mut rand::thread_rng())
        .unwrap()
        .word
        .to_owned();

    let mut generated_completion = generate_completion(word).await.unwrap();

    generated_completion
        .choices
        .push(generated_completion.word.clone());
    generated_completion
        .choices
        .shuffle(&mut rand::thread_rng());

    let collection: Collection<SentenceCompletionWithMeta> =
        mongodb_client.database("gre").collection("completions");

    let mut key = generate_base62_string(6);
    let mut filter = doc! { "key": key.clone() };

    while match collection.find_one(filter, None).await {
        Ok(doc) => doc.is_some(),
        Err(_) => panic!("oh no!"),
    } {
        tracing::warn!("Key {} already exists; regenerating.", &key);
        key = generate_base62_string(6);
        filter = doc! { "key": key.clone() };
    }

    let completion_record = SentenceCompletionWithMeta {
        key: key.clone(),
        views: 0,
        created_date: Utc::now(),
        stats: Statistics::new(),
        sentence_completion: generated_completion,
    };
    let record_completion = collection.insert_one(completion_record.clone(), None).await;

    match record_completion {
        Ok(_) => tracing::info!("Recorded GRE Completion (key: {}) Successfully!", key),
        Err(_) => tracing::error!("Could not record GRE Completion!"),
    }

    Key {
        key: completion_record.key,
    }
}

#[tracing::instrument(skip_all)]
pub async fn completion_by_key(
    mongodb_client: Data<Client>,
    key: web::Path<String>,
) -> impl Responder {
    let key = key.into_inner();

    let collection: Collection<SentenceCompletionWithMeta> =
        mongodb_client.database("gre").collection("completions");
    let filter = doc! { "key": key.clone() };

    let mut completion: SentenceCompletionWithMeta =
        match collection.find_one(filter.clone(), None).await {
            Ok(doc) => match doc {
                Some(completion) => completion,
                None => panic!("oh no!"),
            },
            Err(_) => {
                tracing::error!("Could not find Completion by key ({})!", &key);
                panic!(
                "{{\"msg\": \"Could not find specified completion.\",\"received_key\": \"{}\"}}",
                key
            );
            }
        };

    let update_views = doc! { "$set": { "views": completion.views + 1 } };
    match collection.update_one(filter, update_views, None).await {
        Ok(_) => {
            tracing::info!("Updated view count for completion {} successfully!", &key);
            completion.views += 1;
        }
        Err(_) => tracing::warn!("Could not update view count for completion {}", &key),
    }

    completion
        .sentence_completion
        .choices
        .shuffle(&mut rand::thread_rng());

    completion
}

pub async fn generate_completion(word: String) -> Result<SentenceCompletion, std::io::Error> {
    let auth = Auth::from_env().expect("Could not load OpenAI key");
    let openai = OpenAI::new(auth, "https://api.openai.com/v1/");
    let body = ChatBody {
        model: String::from("ft:gpt-3.5-turbo-0613:personal::7qy7H9zA"),
        max_tokens: Some(128),
        temperature: None,    //Some(0.5_f32),
        top_p: Some(0.4_f32), //None,
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

    Ok(serde_json::from_str(content).unwrap())
}

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct Key {
    key: String,
}

impl Responder for Key {
    type Body = BoxBody;

    fn respond_to(self, _req: &actix_web::HttpRequest) -> HttpResponse<Self::Body> {
        let body = serde_json::to_string(&self).unwrap();

        HttpResponse::Ok()
            .content_type(ContentType::json())
            .body(body)
    }
}

#[derive(serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "PascalCase")]
pub struct SentenceCompletion {
    sentence: String,
    word: String,
    choices: Vec<String>,
}

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct Statistics {
    correct: u32,
    incorrect: u32,
    avg_completion_time: f64,
}

impl Statistics {
    pub fn new() -> Statistics {
        Statistics {
            correct: 0,
            incorrect: 0,
            avg_completion_time: 0_f64,
        }
    }

    pub fn add_correct(&mut self) {
        self.correct += 1;
    }

    pub fn add_incorrect(&mut self) {
        self.incorrect += 1;
    }

    pub fn add_completion_time(&mut self, completion_time: f64) {
        if self.correct + self.incorrect <= 0 {
            return
        }

        self.avg_completion_time = (self.avg_completion_time + completion_time) / (self.correct + self.incorrect) as f64;
    }
}

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct SentenceCompletionWithMeta {
    key: String,
    views: u32,
    created_date: DateTime<Utc>,
    stats: Statistics,
    sentence_completion: SentenceCompletion,
}

impl Responder for SentenceCompletionWithMeta {
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
