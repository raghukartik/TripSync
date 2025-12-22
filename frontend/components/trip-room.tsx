"use client";
import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

interface TripRoomProps {
  tripId: string;
  userId: string;
}

const TripRoom = ({tripId, userId}: TripRoomProps) => {
  
  const socket = useMemo(
    () =>
      io("http://localhost:8000", {
        withCredentials: true,
        transports: ["websocket"],
      }),
    []
  );
  const [message, setMessage] = useState("");
  const [allmsg, setAllMsg] = useState<string[]>([]);

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    socket.emit("message", {message, tripId, userId})
  }


  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });
    socket.on("welcome", (data) => {
      console.log(data.message);
    });
    socket.on("recieve-msg", (data)=>{
      const {message: msgrcv} = data
      console.log(data);
      setAllMsg((allmsg) => [...allmsg, msgrcv]);
    })
    socket.emit("join-room", tripId);
  }, []);

  return (
    <div>
      <h1>TripRoom</h1>
      <h2>{userId} logged in in {tripId}</h2>
      <form onSubmit={handleSubmit}>
        <input value={message} type="text" onChange={(e) => setMessage(e.target.value)} className="bg-amber-500 mr-2" placeholder="message"/>
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
