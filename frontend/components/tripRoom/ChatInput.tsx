import { useState } from "react";
import { Send } from "lucide-react";
const ChatInput = ({ onSend }: { onSend: (text: string) => void }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 py-4 bg-white border-t border-gray-200">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 outline-none focus:border-blue-400 focus:bg-white transition-all text-sm"
          placeholder="Type your message..."
        />
        <button 
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
