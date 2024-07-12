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
  })
  .listen(3003, () => console.log("ngrok.js web server at 3003 is running..."));

ngrok
  .connect({
    addr: 3000,
    authtoken: process.env.NGROK_AUTHTOKEN,
    domain: "camel-obliging-anemone.ngrok-free.app",
  })
  .then((url) => console.log(`Forwarding to: ${url}`))
  .catch((err) => console.error("Error establishing ngrok connection:", err));
