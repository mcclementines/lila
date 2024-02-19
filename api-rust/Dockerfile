FROM rust:1.76.0 AS builder
WORKDIR /app
RUN apt update && apt install lld clang -y
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim AS runtime
WORKDIR /app
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && apt-get remove -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/api-rust api-rust
COPY configuration configuration
COPY static static
ENV APP_ENVIRONMENT production

ENV PORT 8000
EXPOSE 8000

ENTRYPOINT ["./api-rust"]
