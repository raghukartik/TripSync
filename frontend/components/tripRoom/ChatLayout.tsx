import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";

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
  onSend: (text: string) => void;
}

const ChatLayout = ({ messages, userId, onSend }: Props) => {
  return (
    <div className="flex flex-col flex-1">
      <ChatHeader />

      <ChatBody messages={messages} userId={userId} />

      <ChatInput onSend={onSend} />
    </div>
  );
};

export default ChatLayout;
