FROM node:latest
WORKDIR /app
COPY . .
RUN yarn install --force
RUN yarn build
CMD ["yarn","start"]
