//! src/startup.rs

use std::net::TcpListener;

use actix_web::{dev::Server, middleware::Logger, web, App, HttpServer};

use crate::{
    dictionary::load_dictionary,
    routes::{completion, health_check},
};

pub fn run(listener: TcpListener) -> Result<Server, std::io::Error> {
    let dictionary = web::Data::new(load_dictionary().expect("Could not load dictionary"));

    let server = HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .app_data(dictionary.to_owned())
            .route("/health_check", web::get().to(health_check))
            .route("/completion", web::get().to(completion))
    })
    .listen(listener)?
    .run();

    Ok(server)
}
