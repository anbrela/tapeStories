import io from "socket.io-client";

let socket = io("api2.escenapp.com:4001");

export default socket;
