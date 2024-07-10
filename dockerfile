FROM ubuntu:20.04
RUN apt-get update && apt-get install -y curl unzip
RUN curl -fsSL https://fnm.vercel.app/install | bash
RUN fnm use --install-if-missing 20
RUN node -v
RUN apt-get update && apt-get install -y nodejs npm
RUN npm i -g yarn
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
