# syntax=docker/dockerfile:1

FROM node:alpine AS builder

ENV NODE_ENV production

WORKDIR /app
COPY package.json package-lock.json ./
COPY public/ public/
COPY src/ src/
RUN npm ci
RUN npm run build --production

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
