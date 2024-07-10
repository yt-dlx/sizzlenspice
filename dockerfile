FROM node:20-alpine

RUN apk add --no-cache curl unzip bash && \
    curl -fsSL https://bun.sh/install | bash && \
    mv /root/.bun/bin/bun /usr/local/bin/bun && \
    export BUN_INSTALL="/root/.bun" && \
    export PATH="$BUN_INSTALL/bin:$PATH"

WORKDIR /app

COPY package*.json ./
RUN /root/.bun/bin/bun install
RUN /root/.bun/bin/bun run build

COPY . .

EXPOSE 3000

CMD ["/root/.bun/bin/bun", "run", "start"]
