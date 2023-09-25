# Chatvoid Server

<p style="background-color: #ff3333; color: white; font-style: italic; width: fit-content; padding: 1px 7px; border-radius: 5px">No socket.io</p>

---

For you to understand this, a basic knowledge of TypeScript and web socket is required.

<br>

For every new connection, a new user is created via the class User and the connection details alongside the ID generated via uuid is sent to the users object in `/utils/user.ts` and a stringified json is sent to all connected clients. Data sent or received are in this format

```
{
    type: "users" | "message" | "notification" | "to_everyone",
    message: string
}
```

When a client disconnects, the currently connected users is sent to all available clients and the previous client property is deleted from the users object in `/utils/user.ts`

<br>

<p align="center" style="background-color: rgba(255,255,255, 0.2); border-radius: 3px"  >
Kindly give this repo a star 🌟
</p>
