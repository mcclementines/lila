# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/oss/go/microsoft/golang:1.19-bullseye

ENV PORT 8000
EXPOSE 8000

WORKDIR /api

ADD api ./

RUN go mod download

COPY ./api/*.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -o /lila

CMD ["/lila"]

