'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatHeader } from '@/components/chat/chat-header';
import { MessageItem } from '@/components/chat/message-item';
import { MessageInput } from '@/components/chat/message-input';
import { VideoCallDialog } from '@/components/chat/video-call-dialog';
import { JoinChatDialog } from '@/components/chat/join-chat-dialog';
import { chatService } from '@/lib/socket';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  type: 'text' | 'audio' | 'file' | 'image';
  content: string;
  sender: string;
  timestamp: Date;
  fileName?: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [showJoinDialog, setShowJoinDialog] = useState(true);
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    chatService.onMessage((message) => {
      setMessages((prev) => [...prev, message]);
    });

    chatService.onUserJoined((user) => {
      toast({
        title: "User Joined",
        description: `${user.username} has joined the chat`,
      });
    });

    chatService.onUserLeft((user) => {
      toast({
        title: "User Left",
        description: `${user.username} has left the chat`,
      });
    });

    return () => {
      chatService.disconnect();
    };
  }, [toast]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleJoinChat = (username: string, roomId: string) => {
    setUsername(username);
    setRoomId(roomId);
    chatService.connect(username);
    chatService.joinRoom(roomId);
    setShowJoinDialog(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        const audioUrl = URL.createObjectURL(blob);
        
        const message = {
          id: Date.now().toString(),
          type: 'audio',
          content: audioUrl,
          sender: username,
          timestamp: new Date(),
        };
        
        chatService.sendMessage(message);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        type: 'text',
        content: inputMessage,
        sender: username,
        timestamp: new Date(),
      };
      
      chatService.sendMessage(message);
      setInputMessage('');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const isImage = file.type.startsWith('image/');
      
      const message = {
        id: Date.now().toString(),
        type: isImage ? 'image' : 'file',
        content: content,
        sender: username,
        timestamp: new Date(),
        fileName: file.name
      };
      
      chatService.sendMessage(message);
    };

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setLocalStream(stream);
      setIsVideoCallActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const endVideoCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setIsVideoCallActive(false);
  };

  const startVoiceCall = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // Implement voice call logic here
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  return (
    <>
      <Card className="w-full h-[80vh] flex flex-col">
        <ChatHeader 
          onVideoCall={startVideoCall}
          onVoiceCall={startVoiceCall}
          username={username}
          roomId={roomId}
        />

        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
          </div>
        </ScrollArea>

        <MessageInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          fileInputRef={fileInputRef}
          handleFileUpload={handleFileUpload}
        />
      </Card>

      <VideoCallDialog
        isOpen={isVideoCallActive}
        onClose={endVideoCall}
        stream={localStream}
      />

      <JoinChatDialog
        isOpen={showJoinDialog}
        onJoin={handleJoinChat}
      />
    </>
  );
}