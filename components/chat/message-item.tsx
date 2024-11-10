'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'text' | 'audio' | 'file' | 'image';
  content: string;
  sender: string;
  timestamp: Date;
  fileName?: string;
}

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isCurrentUser = message.sender === 'user';

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isCurrentUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isCurrentUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback><User /></AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[70%] rounded-lg p-3",
          isCurrentUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        {message.type === 'text' && <p>{message.content}</p>}
        {message.type === 'audio' && (
          <audio src={message.content} controls className="max-w-full" />
        )}
        {message.type === 'image' && (
          <img src={message.content} alt="Shared image" className="max-w-full rounded" />
        )}
        {message.type === 'file' && (
          <a
            href={message.content}
            download={message.fileName}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
          >
            📎 {message.fileName}
          </a>
        )}
        <span className="text-xs opacity-70 mt-1 block">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      {isCurrentUser && (
        <Avatar className="w-8 h-8">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback><User /></AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}