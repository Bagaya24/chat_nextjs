'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Video, Phone } from 'lucide-react';

interface ChatHeaderProps {
  onVideoCall: () => void;
  onVoiceCall: () => void;
  username: string;
  roomId: string;
}

export function ChatHeader({ onVideoCall, onVoiceCall, username, roomId }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b flex items-center justify-between bg-primary/5">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback><User /></AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{username || 'Chat Room'}</h2>
          <p className="text-sm text-muted-foreground">Room: {roomId || 'Not connected'}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={onVoiceCall}>
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onVideoCall}>
          <Video className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}