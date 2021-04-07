import React, { useEffect, useRef, useState } from "react";
import socket from "../Socket/Socket";
import "./Game.css";
import avatar from "../../img/man.svg";
import hotel from "../../img/hotel.jpeg";
import { v4 as uuidv4 } from "uuid";

const rightQuestion = "green";
const wrongQuestion = "red";
const questionYet = "orange";
const irrelevant = "black";

const Game = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [nombre, setNombre] = useState("");
  const [registrado, setRegistrado] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [ready, setReady] = useState(false);

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleMarkRightQuestion = (message) => () => {
    const index = messages.findIndex((element) => element.id === message.id);
    const newMessage = { ...message, status: rightQuestion };
    console.log(messages);
    const newMessages = [
      ...messages.slice(0, index),
      newMessage,
      ...messages.slice(index + 1),
    ];
    console.log(newMessages);
    setMessages(newMessages); //Local
    socket.emit("editMensaje", newMessage); //Socket
  };

  const handleMarkWrongQuestion = (message) => () => {
    const index = messages.findIndex((element) => element.id === message.id);
    const newMessage = { ...message, status: wrongQuestion };
    const newMessages = [
      ...messages.slice(0, index),
      newMessage,
      ...messages.slice(index + 1),
    ];
    setMessages(newMessages); //Local
    socket.emit("editMensaje", newMessage); //Socket
  };

  const handleMarkQuestionYet = (message) => () => {
    const index = messages.findIndex((element) => element.id === message.id);
    const newMessage = { ...message, status: questionYet };
    const newMessages = [
      ...messages.slice(0, index),
      newMessage,
      ...messages.slice(index + 1),
    ];
    setMessages(newMessages); //Local
    socket.emit("editMensaje", newMessage); //Socket
  };

  const handleMarkIrrelevant = (message) => () => {
    const index = messages.findIndex((element) => element.id === message.id);

    const newMessage = { ...message, status: irrelevant };
    const newMessages = [
      ...messages.slice(0, index),
      newMessage,
      ...messages.slice(index + 1),
    ];
    setMessages(newMessages); //Local
    socket.emit("editMensaje", newMessage); //Socket
  };

  const handleChangeName = (e) => {
    setNombre(e.target.value);
  };

  const handleReady = () => {
    setReady(!ready);
  };

  useEffect(() => {
    socket.on("messages", (message) => {
      setMessages([...messages, message]);
    });

    socket.on("editMessages", (message) => {
      const index = messages.findIndex((item) => item.id === message.id);
      const newMessages = [
        ...messages.slice(0, index),
        message,
        ...messages.slice(index + 1),
      ];
      console.log("editMessages", message, newMessages);
      setMessages(newMessages); //Local
    });

    return () => {
      socket.off();
    };
  }, [messages]);

  useEffect(() => {
    socket.on("usuarios", (nombre) => {
      setUsuarios([...usuarios, nombre]);
    });
    console.log(usuarios);
  }, [usuarios]);

  const sendMessage = (e) => {
    e.preventDefault();
    const msg = {
      author: nombre,
      body: message,
      id: uuidv4(),
      status: "message",
    };
    socket.emit("mensaje", msg);
  };

  const register = (e) => {
    e.preventDefault();
    if (nombre !== "") {
      socket.emit("conectado", nombre);
      setRegistrado(true);
    }
  };

  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

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
        ready ? (
          <div className="chat-wrapper">
            <div className="logo"> </div>
            <div className="points">
              <h2>El Hotel</h2>
              <div className="image-points">
                <img src={hotel} alt="" />
              </div>

              <div className="description-points">
                <p>
                  Un coche se detiene en la puerta de un hotel. En ese mismo
                  instante, sabía que estaba arruinado.
                </p>
              </div>
            </div>
            <div className="chat">
              <div className="leyenda">
                <div className="verde">Correcta</div>
                <div className="rojo">Errónea</div>
                <div className="naranja">Irrelevante</div>
                <div className="negro">Ya preguntado</div>
              </div>
              <div className="container-messages">
                {messages.map((message) => (
                  <div className="" key={message.id}>
                    <div className="mensaje-wrap">
                      {message.author !== undefined ? (
                        <div className="name-wrap">
                          <img src={avatar} alt="" />
                          <span className="nombre">
                            {" "}
                            {message.author + ":"}
                          </span>{" "}
                          <br />
                        </div>
                      ) : null}
                      <div className={message.status}>
                        <span>{message.body}</span>
                      </div>
                    </div>
                    {nombre == "admin" ? (
                      <div className="botones-message">
                        <button onClick={handleMarkRightQuestion(message)}>
                          SI
                        </button>
                        <button onClick={handleMarkWrongQuestion(message)}>
                          NO
                        </button>
                        <button onClick={handleMarkQuestionYet(message)}>
                          Ya Preguntado
                        </button>
                        <button onClick={handleMarkIrrelevant(message)}>
                          Irrelevante
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
                <div className="divRef" ref={divRef}></div>
              </div>
              <div className="send">
                <form>
                  <input
                    placeholder="Introduce tu pregunta"
                    onChange={handleChangeMessage}
                  ></input>
                  <button className="btn" onClick={sendMessage}>
                    Enviar
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="popup">
            <h3>Estamos preparando el juego</h3>
            <p>{"Jugadores conectados " + usuarios.length}</p>
            <button onClick={handleReady}> START </button>
          </div>
        )
      ) : null}
    </div>
  );
};

export default Game;
