import { io } from "socket.io-client";
const socket = io("http://localhost:8000");

socket.on("newOrder", (order) => {
  console.log("New order received", order);
});
