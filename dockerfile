FROM node:20-alpine

RUN apk add --no-cache curl unzip bash && \
    curl -fsSL https://bun.sh/install | bash && \
    mv /root/.bun/bin/bun /usr/local/bin/bun && \
    rm -rf /root/.bun

WORKDIR /app

COPY package*.json ./
RUN bun install
RUN bun run build

COPY . .

EXPOSE 3000

CMD ["bun", "run", "start"]
