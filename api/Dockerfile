# syntax=docker/dockerfile:1

FROM golang:1.19-alpine
WORKDIR /api
COPY ./go.mod ./
COPY ./go.sum ./
RUN go mod download
COPY ./*.go ./
ADD ./static ./static
RUN CGO_ENABLED=0 GOOS=linux go build -o /lila

ENV PORT 8000
EXPOSE 8000

CMD ["/lila"]

