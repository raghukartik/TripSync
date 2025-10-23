"use client";
import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const TripRoom = () => {
  const socket = useMemo(
    () =>
      io("http://localhost:8000", {
        withCredentials: true,
        transports: ["websocket"],
      }),
    []
  );
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [allmsg, setAllMsg] = useState([]);

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    console.log(message);
    socket.emit("message", {message, room})
  }



  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });
    socket.on("welcome", (data) => {
      console.log(data.message);
    });
    socket.on("recieve-msg", (msgrcv)=>{
      console.log(msgrcv);
      setAllMsg((allmsg) => [...allmsg, msgrcv]);
    })
    socket.emit("message", {msg: "Hy from kartik"})
  }, []);

  return (
    <div>
      <h1>TripRoom</h1>
      <form onSubmit={handleSubmit}>
        <input value={message} type="text" onChange={(e) => setMessage(e.target.value)} className="bg-amber-500 mr-2" placeholder="message"/>
        <input value={room} type="text" onChange={(e) => setRoom(e.target.value)} className="bg-amber-500 mr-2" placeholder="Room Id"/>
        <button type="submit" className="p-2">send</button>
      </form>
      <div>
        {allmsg.map((m, i)=> (
          <h2>{m}</h2>
        ))}
      </div>
    </div>
  )
};

export default TripRoom;
