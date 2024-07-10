# syntax=docker/dockerfile:1.4
FROM ubuntu:20.04

RUN apt-get update && apt-get install -y curl unzip \
    && curl -sL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update && apt-get install -y nodejs \
    && npm i -g yarn

WORKDIR /app
COPY . .

RUN yarn install \
    && yarn build

EXPOSE 3000
CMD ["yarn", "start"]
