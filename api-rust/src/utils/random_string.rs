//! src/utils/random_string.rs

use advanced_random_string::{charset, random_string};

pub fn generate_base62_string(length: usize) -> String {
    random_string::generate_unsecure(length, charset::BASE62)
}
