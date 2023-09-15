# syntax=docker/dockerfile:1

FROM node:alpine AS builder

WORKDIR /app
COPY . /app

RUN npm ci
RUN npm run build

FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y
COPY --from=builder /app/nginx.conf /etc/nginx/sites-available/default
COPY --from=builder /app/dist /var/www/html/
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
