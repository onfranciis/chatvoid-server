import { WebSocket } from "ws";
import { users } from "./user";
import { v4 as uuid } from "uuid";
import { messageType } from "./types";

export const numberOfUsers = () => {
  try {
    return JSON.stringify({
      type: "users",
      message: Object.keys(users),
    });
  } catch (error) {
    console.log(error);
  }
};

export const toSender = (message: string) => {
  return JSON.stringify({
    type: "to_sender",
    message: message,
  });
};

export const toEveryoneExceptSender = (
  senderID: string,
  message?: string,
  type?: messageType
) => {
  for (let userID in users) {
    const user = users[userID];

    if (user.readyState === WebSocket.OPEN && userID != senderID) {
      user.send(
        JSON.stringify({
          type: type || "notification",
          message: message || `${senderID} has joined the chat`,
          key: uuid(),
          user: senderID,
        })
      );
    }
  }
};
