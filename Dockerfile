# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/oss/go/microsoft/golang:1.19-bullseye

ENV PORT 1337
EXPOSE 1337

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY *.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -o /lila

ADD static ./static

CMD ["/lila"]

