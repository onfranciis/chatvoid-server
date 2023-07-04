import http from "http";
import { WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";
import User, { users } from "./utils/user";

const PORT = process.env.PORT || 5050;
const server = http.createServer();
const ws = new WebSocketServer({ server });

ws.on("connection", (res) => {
  const userId = uuid();
  const client = new User(userId, res);
  const { ID, Details, getNumberOfUsers, sendMessage, disconnect } = client;
  console.log(`Received a new connection and connected user ${userId}`);
  console.log(`Number of connected users: ${getNumberOfUsers()}`);

  res.onmessage = (message) => {
    const { data } = message;
    const { receivedMessage } = sendMessage(data, ID);
    console.log(receivedMessage);
  };

  res.on("close", () => {
    console.log(`${ID} has disconnected`);
    delete users[ID];
    disconnect();
  });
});

server.listen(PORT, () => {
  console.log(`Web socket server started on port ${PORT}`);
});
