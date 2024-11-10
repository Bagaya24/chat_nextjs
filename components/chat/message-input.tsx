'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, StopCircle, Paperclip } from 'lucide-react';

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MessageInput({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isRecording,
  startRecording,
  stopRecording,
  fileInputRef,
  handleFileUpload,
}: MessageInputProps) {
  return (
    <div className="p-4 border-t flex gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
      >
        <Paperclip className="h-5 w-5" />
      </Button>
      <Input
        placeholder="Type a message..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? (
          <StopCircle className="h-5 w-5 text-destructive" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>
      <Button onClick={handleSendMessage}>
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}