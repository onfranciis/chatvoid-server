import { Data, WebSocket } from "ws";
import { messagesDataType, usersType } from "./types";
import moment from "moment";

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
    const receivedMessage = JSON.parse(message.toString()).message;

    messagesData.push({
      message: receivedMessage,
      time: moment(),
      user: ID,
    });

    return { receivedMessage };
  }

  getNumberOfUsers() {
    return Object.keys(users).length;
  }

  disconnect() {
    console.log(`Number of connected users: ${Object.keys(users).length}`);

    for (let userID in users) {
      const user = users[userID];

      if (user.readyState === WebSocket.OPEN) {
        user.send("Someone left the chat");
      }
    }
  }
}

export default User;
