FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 8000
CMD ["yarn", "run", "start"]
