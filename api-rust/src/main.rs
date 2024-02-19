use std::net::TcpListener;

use api_rust::{
    configuration::{get_configuration, ConfigureCors},
    startup::run,
};

use tracing::subscriber::set_global_default;
use tracing_bunyan_formatter::{BunyanFormattingLayer, JsonStorageLayer};
use tracing_log::LogTracer;
use tracing_subscriber::{prelude::__tracing_subscriber_SubscriberExt, EnvFilter, Registry};

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
        allowed_methods: vec!["GET".into(), "POST".into()],
        allowed_headers: vec!["X-Requested-With".into()],
    };

    run(listener, cors)?.await
}
