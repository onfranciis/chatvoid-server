import { Data, WebSocket } from "ws";
import { v4 as uuid } from "uuid";
import { messagesDataType, usersType } from "./types";
import moment from "moment";
import { numberOfUsers, toEveryoneExceptSender } from "./message";

export const users: usersType = {};
export const messagesData: messagesDataType[] = [];

class User {
  ID: string;
  Details: WebSocket;

  constructor(ID: string, Details: WebSocket) {
    this.ID = ID;
    this.Details = Details;
    users[ID] = Details;

    return this;
  }

  sendMessage(message: Data, ID: string) {
    try {
      const receivedMessage = JSON.parse(message.toString()).message;

      if (receivedMessage) {
        messagesData.push({
          message: receivedMessage,
          time: moment(),
          user: ID,
          type: "message",
        });

        console.log("Received message: ", receivedMessage);
        return { receivedMessage, ID };
      } else {
        console.log("Error");
      }
    } catch (err) {
      console.log(err);
      return { receivedMessage: "Invalid data" };
    }
  }

  getNumberOfUsers() {
    return Object.keys(users).length;
  }

  disconnect(ID: string) {
    delete users[ID];
    console.log(`Number of connected users: ${Object.keys(users).length}`);
    broadcastMessage(numberOfUsers());
    toEveryoneExceptSender(ID, `${ID} has left the chat`, "notification");
  }
}

export const broadcastMessage = (message: string | undefined, ID?: string) => {
  if (typeof message == "string")
    for (let userID in users) {
      const user = users[userID];

      if (user.readyState === WebSocket.OPEN) {
        if (ID) {
          user.send(
            JSON.stringify({
              user: ID,
              key: uuid(),
              message,
              type: "message",
            })
          );
        } else {
          user.send(message);
        }
      }
    }
};

export default User;
