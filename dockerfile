FROM node:latest
RUN npm install -g yarn
WORKDIR /app
COPY . .
RUN yarn install --force
RUN yarn build
CMD ["yarn","start"]
