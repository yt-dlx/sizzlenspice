FROM ubuntu:latest
RUN apt-get update && \
    apt-get install -y curl gnupg2 && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs npm && \
    npm install -g yarn && \
    apt-get clean
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 8000
CMD ["yarn", "run", "start"]
