const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
app.use(cors());
const io = require("socket.io")(server, {
  cors: {
    origins: "*:*",
  },
});

io.on("connection", (socket) => {
  socket.on("conectado", (nombre) => {
    console.log("usuario conectado", nombre);
  });

  socket.on("mensaje", (nombre, message) => {
    io.emit("messages", { nombre, message });
    console.log(message);
  });

  socket.on("disconnect", () => {
    io.emit("messages", { nombre: "server", nombre: "Ha abandonado la sala" });
  });
});

server.listen(4000, () => console.log("server started on port 4000"));
