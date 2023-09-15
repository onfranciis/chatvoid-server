import { WebSocket } from "ws";
import { users } from "./user";

export const numberOfUsers = () => {
  return JSON.stringify({
    type: "no_of_users",
    value: Object.keys(users).length,
  });
};

export const toSender = (message: string) => {
  return JSON.stringify({
    type: "to_sender",
    value: message,
  });
};

export const toEveryoneExceptSender = (senderID: string) => {
  for (let userID in users) {
    const user = users[userID];

    if (user.readyState === WebSocket.OPEN) {
      if (userID === senderID) {
        // Same user
      } else {
        user.send(
          JSON.stringify({
            type: "to_everyone",
            value: `${senderID} has joined the chat`,
          })
        );
      }
    }
  }
};
