# # Development Stage
# FROM node:18-alpine AS development
# WORKDIR /app
# COPY package*.json yarn.lock ./
# RUN yarn install
# COPY . .
# EXPOSE 8000
# CMD ["yarn", "dev", "--port", "8000"]

# Builder Stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Production Stage 
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
ENV NODE_ENV=production
EXPOSE 8000
CMD ["node", "server.js", "--port", "8000"]
