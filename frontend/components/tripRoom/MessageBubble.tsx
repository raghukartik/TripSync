interface Props {
  message: Message;
  isOwn: boolean;
}
interface Sender {
  _id: string;
  name: string;
  email: string;
}

interface Message {
  sender: Sender;
  text: string;
  timestamp: Date;
}


const MessageBubble = ({ message, isOwn }: Props) => {
  const time = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4 animate-fadeIn`}>
      <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && (
          <span className="text-xs font-medium text-gray-600 mb-1 px-1">
            {message.sender.name}
          </span>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl shadow-sm ${
            isOwn
              ? "bg-blue-600 text-white rounded-br-md"
              : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
          }`}
        >
          <p className="text-sm leading-relaxed break-words">{message.text}</p>
        </div>
        <span className="text-xs text-gray-400 mt-1 px-1">{time}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
