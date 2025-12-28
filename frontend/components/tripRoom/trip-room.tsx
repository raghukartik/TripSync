"use client";

import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";
import CollaboratorsSidebar from "./CollaboratorsSidebar";
import { getUserInfo } from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Sender {
  _id: string;
  name: string;
  email: string;
}

interface Collaborator {
  collabId: string;
  name: string;
  email: string;
}

interface Message {
  sender: Sender;
  text: string;
  timestamp: Date;
}

interface TripRoomProps {
  tripId: string;
  userId: string;
  chatMessage: Message[];
  roomCollab: Collaborator[];
}

const userDetails: User = await getUserInfo();

const TripRoom = ({
  tripId,
  userId,
  chatMessage,
  roomCollab,
}: TripRoomProps) => {
  const socket = useMemo(
    () =>
      io("http://localhost:8000", {
        transports: ["websocket"],
        withCredentials: true,
      }),
    []
  );
  const [messages, setMessages] = useState<Message[]>(chatMessage);
  console.log(userId);

  useEffect(() => {
    socket.emit("join-room", tripId);

    socket.on("recieve-msg", (data) => {
      console.log(data);

      const normalizedMessage: Message = {
        text: data.text,
        timestamp: new Date(),
        sender: data.sender,
      };

      setMessages((prev) => [...prev, normalizedMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (text: string) => {
    const sender: User = {
      _id: userId,
      name: userDetails.name,
      email: userDetails.email,
    };
    socket.emit("message", { text, tripId, sender });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <CollaboratorsSidebar collaborators={roomCollab} />

      <div className="flex flex-col flex-1">
        <ChatHeader memberCount={roomCollab.length} />
        <ChatBody messages={messages} userId={userId} />
        <ChatInput onSend={sendMessage} />
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TripRoom;
