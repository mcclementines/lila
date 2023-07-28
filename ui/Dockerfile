# syntax=docker/dockerfile:1

FROM node:bullseye
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@5.0.1 -g

COPY . ./
ENV PATH /app/node_modules/.bin:$PATH

CMD ["npm", "start"]