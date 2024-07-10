FROM oven/bun
RUN apt-get update && apt-get install -y curl unzip
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build
EXPOSE 3000
CMD ["bun", "run", "start"]
