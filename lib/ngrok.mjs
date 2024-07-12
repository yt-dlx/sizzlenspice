// lib/ngrok.mjs
import http from "http";
import dotenv from "dotenv";
import ngrok from "@ngrok/ngrok";

dotenv.config({ path: ".env.local" });

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Congrats you have created an ngrok web server");
  })
  .listen(3000, () => console.log("Node.js web server at 3000 is running..."));

ngrok.connect({ addr: 3000, authtoken: process.env.NGROK_AUTHTOKEN }).then((listener) => console.log(`Ingress established at: ${listener.url()}`));
