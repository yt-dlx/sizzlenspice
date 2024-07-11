FROM ubuntu:latest
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y curl gnupg2 && \
    apt-get install -y --no-install-recommends apt-utils && \
    apt-get clean
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs npm git && \
    apt-get clean
RUN npm install -g yarn
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 8000
CMD ["yarn", "start"]
