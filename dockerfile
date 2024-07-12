FROM node:latest
WORKDIR /app
COPY . .
RUN yarn install --force
CMD yarn build && yarn start
