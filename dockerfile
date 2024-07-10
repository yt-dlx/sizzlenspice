FROM node:20-alpine
RUN apk add --no-cache curl unzip && \
    curl -fsSL https://bun.sh/install | bash && \
    mv /root/.bun/bin/bun /usr/local/bin/bun && \
    rm -rf /root/.bun
WORKDIR /app
COPY package*.json ./
RUN bun install
COPY . .
EXPOSE 3000
CMD bun run dev