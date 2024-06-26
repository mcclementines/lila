//! src/startup.rs

use std::net::TcpListener;

use actix_cors::Cors;
use actix_web::{dev::Server, middleware::Logger, web, App, HttpServer};
use mongodb::Client;

use crate::{
    configuration::ConfigureCors,
    routes::{completion, completion_by_key, completion_stats_update, health_check},
    utils::dictionary::load_dictionary,
};

pub fn run(
    listener: TcpListener,
    cors_config: ConfigureCors,
    mongodb_client: Client,
) -> Result<Server, std::io::Error> {
    let dictionary = web::Data::new(load_dictionary().expect("Could not load dictionary"));
    let mongodb_client = web::Data::new(mongodb_client);

    let server = HttpServer::new(move || {
        let mut cors = Cors::default()
            .allowed_headers(cors_config.allowed_headers.clone())
            .allowed_methods(cors_config.allowed_methods.clone());

        if cors_config.allowed_origin == "*" {
            cors = cors.allow_any_origin().send_wildcard();
        } else {
            cors = cors.allowed_origin(cors_config.allowed_origin.as_str());
        }

        App::new()
            .wrap(Logger::default())
            .wrap(cors)
            .app_data(dictionary.to_owned())
            .app_data(mongodb_client.to_owned())
            .route("/health_check", web::get().to(health_check))
            .route("/completion", web::get().to(completion))
            .route("/completion/{id}", web::get().to(completion_by_key))
            .route(
                "/completion/stats/update",
                web::post().to(completion_stats_update),
            )
    })
    .listen(listener)?
    .run();

    Ok(server)
}
