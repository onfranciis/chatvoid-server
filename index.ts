import http from "http";
import { WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";
import User, { broadcastMessage, users } from "./utils/user";
import {
  numberOfUsers,
  toEveryoneExceptSender,
  toSender,
} from "./utils/message";

const PORT = process.env.PORT || 5050;
const server = http.createServer();
const ws = new WebSocketServer({ server });

ws.on("connection", (res) => {
  const userId = uuid();
  const client = new User(userId, res);
  const { ID, Details, getNumberOfUsers, sendMessage, disconnect } = client;
  console.log(`Received a new connection and connected user ${userId}`);
  res.send(toSender("You're connected"));
  toEveryoneExceptSender(ID);
  broadcastMessage(numberOfUsers());

  res.onmessage = (message) => {
    const { data } = message;
    const response = sendMessage(data, ID);

    if (response?.receivedMessage) {
      const receivedMessage = response.receivedMessage;
      console.log(receivedMessage, "received message");
      toEveryoneExceptSender(ID, receivedMessage, "message");
    }
  };

  res.on("close", () => {
    console.log(`${ID} has disconnected`);
    disconnect(ID);
  });
});

server.listen(PORT, () => {
  console.log(`Web socket server started on port ${PORT}`);
});
