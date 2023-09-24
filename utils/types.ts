import { Moment } from "moment";
import { WebSocket } from "ws";

export type messageType = "users" | "message" | "notification" | "to_everyone";
export interface usersType {
  [userId: string]: WebSocket;
}

export interface messagesDataType {
  user: string;
  message: string;
  time: Moment;
  type: messageType;
}
