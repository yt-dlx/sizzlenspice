FROM node:latest
RUN npm install -g yarn
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build
CMD ["yarn","start"]
