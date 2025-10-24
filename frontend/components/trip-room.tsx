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
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    console.log(message);
    socket.emit("message", {message, room})
  }

  const handleJoinRoom = (e:React.FormEvent) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
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
      <h2>Join Room</h2>
      <form onSubmit={handleJoinRoom}>
        <input value={roomName} type="text" onChange={(e) => setRoomName(e.target.value)} className="bg-amber-500 mr-2" placeholder="message"/>
        <button type="submit" className="p-2">send</button>
      </form>
      <div>
        {allmsg.map((m, i)=> (
          <h2 key={i}>{m}</h2>
        ))}
      </div>
    </div>
  )
};

export default TripRoom;
