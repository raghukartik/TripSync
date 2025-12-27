import { MoreVertical } from "lucide-react";

const ChatHeader = ({ memberCount }: { memberCount: number }) => {
  return (
    <div className="h-16 px-6 flex items-center justify-between bg-white border-b border-gray-200 shadow-sm">
      <div>
        <h2 className="font-semibold text-lg text-gray-800">Trip Room Chat</h2>
        <p className="text-xs text-gray-500">{memberCount} members</p>
      </div>
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <MoreVertical size={20} className="text-gray-600" />
      </button>
    </div>
  );
};

export default ChatHeader;
