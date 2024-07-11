FROM ubuntu:latest
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y curl gnupg2 apt-utils git && \
    apt-get clean
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g yarn && \
    apt-get clean
WORKDIR /app
COPY . .
RUN yarn install && \
    yarn build
EXPOSE 8000
CMD ["yarn", "start"]
