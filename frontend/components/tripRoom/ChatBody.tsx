import MessageBubble from "./MessageBubble";
import { useRef, useEffect } from "react";
import { Users } from "lucide-react";
interface Message {
  sender: Sender;
  text: string;
  timestamp: Date;
}

interface Sender {
  _id: string;
  name: string;
  email: string;
}


interface Props {
  messages: Message[];
  userId: string;
}

const ChatBody = ({ messages, userId }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Users size={48} className="mb-3 opacity-50" />
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble
              key={i}
              message={msg}
              isOwn={msg.sender._id === userId}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};


export default ChatBody;
