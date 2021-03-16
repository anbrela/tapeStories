import io, { Socket } from "socket.io-client";

let socket = io("//localhost:4000");

export default socket;