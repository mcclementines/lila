//! src/startup.rs

use std::net::TcpListener;

use actix_cors::Cors;
use actix_web::{dev::Server, middleware::Logger, web, App, HttpServer};

use crate::{
    configuration::ConfigureCors,
    dictionary::load_dictionary,
    routes::{completion, health_check},
};

pub fn run(listener: TcpListener, cors_config: ConfigureCors) -> Result<Server, std::io::Error> {
    let dictionary = web::Data::new(load_dictionary().expect("Could not load dictionary"));

    let server = HttpServer::new(move || {
        let mut cors = Cors::default()
            .allowed_headers::<Vec<String>, String>(cors_config.allowed_headers.clone())
            .allowed_methods(vec!["GET", "POST"]); // strongly dislike

        if cors_config.allowed_origin == "*" {
            cors = cors.allow_any_origin().send_wildcard();
        } else {
            cors = cors.allowed_origin(cors_config.allowed_origin.as_str());
        }

        App::new()
            .wrap(Logger::default())
            .wrap(cors)
            .app_data(dictionary.to_owned())
            .route("/health_check", web::get().to(health_check))
            .route("/completion", web::get().to(completion))
    })
    .listen(listener)?
    .run();

    Ok(server)
}
