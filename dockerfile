FROM ubuntu:20.04
RUN apt-get update && apt-get install -y curl unzip bash && \
    curl -fsSL https://bun.sh/install | bash && \
    mv /root/.bun/bin/bun /usr/local/bin/bun && \
    rm -rf /root/.bun
WORKDIR /app
COPY . .
RUN /usr/local/bin/bun install
RUN /usr/local/bin/bun run build
EXPOSE 3000
CMD ["bun", "run", "start"]
