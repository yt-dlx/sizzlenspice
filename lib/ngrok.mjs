// lib/ngrok.mjs
import http from "http";
import dotenv from "dotenv";
import ngrok from "@ngrok/ngrok";

dotenv.config({ path: ".env.local" });

http
  .createServer((req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/html",
      "User-Agent": "Custom-User-Agent",
      "ngrok-skip-browser-warning": "true",
    });
    res.end("Congrats you have created an ngrok web server");
  })
  .listen(3003, () => console.log("ngrok.js web server at 3003 is running..."));

ngrok
  .connect({
    addr: 3003,
    authtoken: process.env.NGROK_AUTHTOKEN,
    domain: "camel-obliging-anemone.ngrok-free.app",
  })
  .then((listener) => console.log(`Ingress established at: ${listener.url()}`));
