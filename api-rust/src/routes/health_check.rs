//! src/routes/health_check.rs

use actix_web::{http::header::ContentType, HttpResponse, Responder};

pub async fn health_check() -> impl Responder {
    HttpResponse::Ok()
        .content_type(ContentType::plaintext())
        .body("Ok\n")
}
