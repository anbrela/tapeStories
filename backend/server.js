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
    console.log("usuario conectado nuevo", nombre);
    io.emit("usuarios", nombre);
  });

  socket.on("mensaje", (message) => {
    io.emit("messages", message);
  });

  socket.on("editMensaje", (message) => {
    io.emit("editMessages", message);
  });

  socket.on("disconnect", (nombre) => {
    io.emit("messages", { body: nombre + " Ha abandonado la sala" });
  });
});

<<<<<<< HEAD
server.listen(4001, () => console.log("server started on port 4001"));
=======
server.listen(4001, () => console.log("server started on port 4000"));
>>>>>>> 2b7610f35c79b48877aa850798a918262537ccd2
