'use client';

import { io, Socket } from 'socket.io-client';

class ChatService {
  private static instance: ChatService;
  private socket: Socket | null = null;
  private roomId: string | null = null;

  private constructor() {
    this.socket = io('https://your-chat-server.com', {
      autoConnect: false,
      transports: ['websocket'],
    });

    this.setupListeners();
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  public connect(username: string) {
    if (!this.socket) return;
    this.socket.auth = { username };
    this.socket.connect();
  }

  public disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
  }

  public joinRoom(roomId: string) {
    if (!this.socket) return;
    this.roomId = roomId;
    this.socket.emit('join_room', { roomId });
  }

  public leaveRoom() {
    if (!this.socket || !this.roomId) return;
    this.socket.emit('leave_room', { roomId: this.roomId });
    this.roomId = null;
  }

  public sendMessage(message: any) {
    if (!this.socket || !this.roomId) return;
    this.socket.emit('message', { roomId: this.roomId, ...message });
  }

  public onMessage(callback: (message: any) => void) {
    if (!this.socket) return;
    this.socket.on('message', callback);
  }

  public onUserJoined(callback: (user: any) => void) {
    if (!this.socket) return;
    this.socket.on('user_joined', callback);
  }

  public onUserLeft(callback: (user: any) => void) {
    if (!this.socket) return;
    this.socket.on('user_left', callback);
  }
}

export const chatService = ChatService.getInstance();