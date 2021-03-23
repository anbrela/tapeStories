import React, { useEffect, useRef, useState } from "react";
import socket from "../Socket/Socket";
import "./Game.css";

const Game = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [nombre, setNombre] = useState("");
  const [registrado, setRegistrado] = useState(false);

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleChangeName = (e) => {
    setNombre(e.target.value);
  };

  useEffect(() => {
    socket.on("messages", (message) => {
      setMessages([...messages, message]);
    });

    return () => {
      socket.off();
    };
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("mensaje", nombre, message);
    e.target.reset();
  };

  const register = (e) => {
    e.preventDefault();
    socket.emit("conectado", nombre);
    if (nombre !== "") setRegistrado(true);
  };

  return (
    <div className="container">
      <div className="image"></div>

      {!registrado ? (
        <div className="name">
          <form onSubmit={register}>
            <input
              value={nombre}
              placeholder="Introduzca su nombre"
              onChange={handleChangeName}
            ></input>
            <button className="btn">Enviar</button>
          </form>
        </div>
      ) : null}

      {registrado ? (
        <div className="chat">
          {messages.map((e, i) => (
            <div key={i}>
              {e.nombre + ":"} <br /> {e.message}
            </div>
          ))}

          <form onSubmit={sendMessage}>
            <label>Mensaje</label>
            <input onChange={handleChangeMessage}></input>
            <button type="reset">Enviar</button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Game;
