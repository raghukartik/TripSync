import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Mail } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface User {
  _id: string;
  name: string;
  email: string;
}

interface SharedWithDisplayProps {
  sharedWith: User[];
  compact?: boolean;
}

export function SharedWithDisplay({ sharedWith, compact = false }: SharedWithDisplayProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (sharedWith.length === 0) {
    return <span className="text-sm text-gray-500 italic">Not shared</span>;
  }

  // For compact view (mobile cards) - interactive with popover
  if (compact) {
    const totalPeople = sharedWith.length + 1;
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full border border-green-200 cursor-pointer hover:bg-green-100 transition-colors active:scale-95">
            <Users className="h-3.5 w-3.5 text-green-600" />
            <span className="text-xs font-medium text-green-700">
              Shared with {totalPeople} {totalPeople === 1 ? 'person' : 'people'}
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-gray-500" />
              <h4 className="font-semibold text-sm text-gray-900">
                Shared with {totalPeople} {totalPeople === 1 ? 'person' : 'people'}
              </h4>
            </div>
            <Separator className="mb-2" />
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {sharedWith.map((user) => (
                <div 
                  key={user._id}
                  className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-green-400 to-green-600 text-white font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  const totalPeople = sharedWith.length + 1;
  const visibleAvatars = Math.min(sharedWith.length, 3);
  const remainingCount = sharedWith.length - visibleAvatars;

  // Desktop view with stacked avatars and popover
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="flex -space-x-2">
            {sharedWith.slice(0, visibleAvatars).map((user) => (
              <Avatar 
                key={user._id} 
                className="h-8 w-8 border-2 border-white hover:z-10 transition-all"
              >
                <AvatarFallback className="text-xs bg-gradient-to-br from-green-400 to-green-600 text-white font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            ))}
            {remainingCount > 0 && (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 border-2 border-white flex items-center justify-center hover:z-10 transition-all">
                <span className="text-xs text-white font-semibold">+{remainingCount}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              {totalPeople} {totalPeople === 1 ? 'person' : 'people'}
            </span>
            <span className="text-xs text-gray-500">Click to view</span>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-gray-500" />
            <h4 className="font-semibold text-sm text-gray-900">
              Shared with {totalPeople} {totalPeople === 1 ? 'person' : 'people'}
            </h4>
          </div>
          <Separator className="mb-3" />
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {sharedWith.map((user) => (
              <div 
                key={user._id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs bg-gradient-to-br from-green-400 to-green-600 text-white font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}