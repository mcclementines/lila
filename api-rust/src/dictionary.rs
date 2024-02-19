//! src/dictionary.rs

use std::{fs::File, io::BufReader};

#[derive(serde::Serialize, serde::Deserialize)]
pub struct WordDef {
    pub word: String,
    pub pos: String,
    pub definition: String,
}

pub fn load_dictionary() -> Result<Vec<WordDef>, std::io::Error> {
    let file = File::open("./static/gre_vocab_list.json")?;
    let reader = BufReader::new(file);

    let dictionary: Vec<WordDef> =
        serde_json::from_reader(reader).expect("Could not load dictionary");

    Ok(dictionary)
}
