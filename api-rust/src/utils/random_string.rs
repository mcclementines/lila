//! src/utils/random_string.rs

use rand::{distributions::Uniform, thread_rng, Rng};

const BASE62_CHARSET: &[u8] = b"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRZTUVWXYZ";

pub fn generate_base62_string(length: usize) -> String {
    let mut rng = thread_rng();
    let uniform = Uniform::from(0..62);

    let base62_string: String = (0..length)
        .map(|_| {
            let idx = rng.sample(uniform);
            BASE62_CHARSET[idx] as char
        })
        .collect();

    base62_string
}
