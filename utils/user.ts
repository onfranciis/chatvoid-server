import { Data, WebSocket } from "ws";
import { messagesDataType, usersType } from "./types";
import moment from "moment";
import { numberOfUsers } from "./message";

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
    broadcastMessage(`${ID} left the chat`);
  }
}

export const broadcastMessage = (message: string, ID?: string) => {
  for (let userID in users) {
    const user = users[userID];

    if (user.readyState === WebSocket.OPEN) {
      if (ID) {
        user.send(`${message} from ${ID}`);
      } else {
        user.send(message);
      }
    }
  }
};

export default User;
