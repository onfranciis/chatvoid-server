import { Moment } from "moment";
import { WebSocket } from "ws";

export interface usersType {
  [userId: string]: WebSocket;
}

export interface messagesDataType {
  user: string;
  message: string;
  time: Moment;
}
