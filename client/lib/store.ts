import { create } from "zustand";

interface User {
  _id: string;
  name: string;
  phone: string;
  avatar?: string;
  status?: string;
  customStatus?: string;
  theme?: string;
}

interface Message {
  _id: string;
  chat: string;
  sender: { _id: string; name: string; avatar?: string };
  text: string;
  type: string;
  fileUrl?: string;
  createdAt: string;
  status?: string;
}

interface Chat {
  _id: string;
  participants: User[];
  lastMessage?: Message;
  isGroup?: boolean;
  groupName?: string;
  updatedAt: string;
}

interface AppState {
  user: User | null;
  token: string | null;
  chats: Chat[];
  messages: Message[];
  currentChat: Chat | null;
  onlineUsers: string[];
  connected: boolean;
  setUser: (u: User | null) => void;
  setToken: (t: string | null) => void;
  setChats: (c: Chat[]) => void;
  setMessages: (m: Message[]) => void;
  addMessage: (m: Message) => void;
  setCurrentChat: (c: Chat | null) => void;
  setOnlineUsers: (u: string[]) => void;
  setConnected: (c: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  token: null,
  chats: [],
  messages: [],
  currentChat: null,
  onlineUsers: [],
  connected: true,
  setUser: (user) => set({ user }),
  setToken: (token) => { set({ token }); if (typeof window !== "undefined") { if (token) localStorage.setItem("token", token); else localStorage.removeItem("token"); } },
  setChats: (chats) => set({ chats }),
  setMessages: (messages) => set({ messages }),
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  setCurrentChat: (currentChat) => set({ currentChat }),
  setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
  setConnected: (connected) => set({ connected }),
}));
