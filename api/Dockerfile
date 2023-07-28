# syntax=docker/dockerfile:1

FROM golang:1.19-bullseye
WORKDIR /api
ADD api ./
RUN go mod download
COPY ./api/*.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /lila

ENV PORT 8000
EXPOSE 8000

CMD ["/lila"]

