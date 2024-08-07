import express from "express";
import expressWs from "express-ws";

const app = express();
const wsInstance = expressWs(app);

// Websocket 服务
app.ws("/", (ws) => {
  ws.on("message", (data) => {
    if (data === "ping") {
      ws.send("pong");
      return;
    }
    // 广播消息 除了自己
    wsInstance.getWss().clients.forEach((server) => {
      if (server !== ws) {
        server.send(data);
      }
    });
  });
});

app.listen(8080, () => {
  console.log("Websocket server start at 8080 port 🎉");
});
