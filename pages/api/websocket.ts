// pages/api/websocket.ts
import type { NextApiRequest } from "next";
import { Server as SocketIOServer } from "socket.io";
import type { NextApiResponseServerIO } from "@/types/next";

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("Socket is initializing");
    const io = new SocketIOServer(res.socket.server as any);
    res.socket.server.io = io;
    io.on("connection", (socket) => {
      socket.on("join-room", (userId) => socket.join(userId));
      socket.on("update-order", ({ userId, orderId, status }) => {
        io.to(userId).emit("order-updated", { orderId, status });
      });
      socket.on("disconnect", () => {});
    });
  }
  res.end();
};
export default SocketHandler;
