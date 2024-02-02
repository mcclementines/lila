//! src/startup.rs

use std::net::TcpListener;

use actix_web::{dev::Server, middleware::Logger, web, App, HttpServer};

use crate::routes::health_check;

pub fn run(listener: TcpListener) -> Result<Server, std::io::Error> {
    let server = HttpServer::new(|| {
        App::new()
            .wrap(Logger::default())
            .route("/health_check", web::get().to(health_check))
    })
    .listen(listener)?
    .run();

    Ok(server)
}
