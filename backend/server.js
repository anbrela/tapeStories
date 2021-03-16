const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);




const io = require('socket.io')(server, { origins: '*:*'});


io.on("connection", socket => {

    socket.on('conectado', (nombre) => {
        console.log("usuario conectado", nombre);
    })

    socket.on("mensaje", (nombre, message) => {
        io.emit("messages", {nombre, message});
    })

    socket.on("disconnect", () => {
        io.emit("messages", {nombre:"server", nombre: "Ha abandonado la sala" });
    })
})

server.listen(4000, () => console.log("server started on port 4000"))