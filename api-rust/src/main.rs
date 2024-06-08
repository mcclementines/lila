use std::{io, net::TcpListener};

use api_rust::{
    configuration::{get_configuration, ConfigureCors},
    startup::run,
};

use mongodb::Client;
use tracing::subscriber::set_global_default;
use tracing_bunyan_formatter::{BunyanFormattingLayer, JsonStorageLayer};
use tracing_log::LogTracer;
use tracing_subscriber::{prelude::__tracing_subscriber_SubscriberExt, EnvFilter, Registry};
use vec_string_to_static_str::vec_string_to_static_str;

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    LogTracer::init().expect("Failed to set logger");

    let env_filter = EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info"));
    let formatting_layer = BunyanFormattingLayer::new("lila".into(), std::io::stdout);

    let subscriber = Registry::default()
        .with(env_filter)
        .with(JsonStorageLayer)
        .with(formatting_layer);

    set_global_default(subscriber).expect("Failed to set subscriber");

    let configuration = get_configuration().expect("Could not get configuration!");
    let address = format!(
        "{}:{}",
        configuration.application.host, configuration.application.port
    );

    let listener = TcpListener::bind(address).expect("Could not bind to port!");

    let cors = ConfigureCors {
        allowed_origin: configuration.application.allowed_origin.clone(),
        allowed_methods: vec_string_to_static_str(&vec![String::from("GET"), String::from("POST")]),
        allowed_headers: vec_string_to_static_str(&vec![
            String::from("X-Requested-With"),
            String::from("Cache-Control"),
            String::from("Pragma"),
            String::from("Expires"),
        ]),
    };

    let client: Result<Client, mongodb::error::Error> =
        Client::with_uri_str(configuration.database.connection_string()).await;

    let client: Client = client.map_err(|err| {
        std::io::Error::new(
            io::ErrorKind::Other,
            format!("MongoDB Client Error: {}", err),
        )
    })?;

    run(listener, cors, client)?.await
}
