"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import api from "@/lib/api";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { getDemoChats, getDemoMessages } from "@/lib/demoData";
import IEFrame from "@/components/IEFrame";
import AuthScreen from "@/components/AuthScreen";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import RightPanel from "@/components/RightPanel";

export default function Home() {
  const { user, token, setUser, setToken, setChats, setMessages, addMessage, setOnlineUsers } = useStore();
  const [ready, setReady] = useState(false);

  // On mount: restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      api.get("/user").then((res) => {
        const userData = res.data.user || res.data;
        setUser(userData);
        seedDemoData(userData._id);
        return api.get("/chats");
      }).then((res) => {
        const serverChats = res.data.chats || res.data || [];
        // Merge server chats with demo chats (demo shown if server has none)
        if (serverChats.length === 0) {
          // Already seeded in seedDemoData
        } else {
          setChats(serverChats);
        }
      }).catch(() => {
        setToken(null);
        setUser(null);
      }).finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  // Seed demo data after login
  function seedDemoData(userId: string) {
    const { chats } = getDemoChats(userId);
    const messages = getDemoMessages(userId);
    setChats(chats as any);
    setMessages(messages as any);
    setOnlineUsers(["demo_sara", "demo_hassan", "demo_mom", "demo_ayesha"]);
  }

  // === FAKE NOTIFICATION SYSTEM ===
  const [notification, setNotification] = useState<{ name: string; text: string } | null>(null);

  useEffect(() => {
    if (!user || !token) return;
    // Simulate incoming messages every 15-30 seconds from random online contacts
    const fakeReplies = [
      "Hey! Are you there?", "Just checking in", "Did you get my last message?",
      "Can we talk later?", "LOL", "That's interesting", "Ok sure",
      "What time works for you?", "I'll call you later", "Sounds good!",
      "Where are you?", "Miss you!", "Haha nice one", "See you tomorrow",
      "Let me know", "On my way", "Just a sec", "Talk soon"
    ];
    const demoContacts = [
      { id: "demo_sara", name: "Sara Khan" },
      { id: "demo_hassan", name: "Hassan Ali" },
      { id: "demo_mom", name: "Mom" },
      { id: "demo_ayesha", name: "Ayesha Tariq" },
      { id: "demo_bilal", name: "Bilal Ahmed" },
    ];

    const interval = setInterval(() => {
      const { connected, currentChat } = useStore.getState();
      if (!connected) return;
      const contact = demoContacts[Math.floor(Math.random() * demoContacts.length)];
      const text = fakeReplies[Math.floor(Math.random() * fakeReplies.length)];
      const chatId = "chat_" + contact.id.replace("demo_", "");

      // Add message to store
      const msg = {
        _id: "fake_" + Date.now() + Math.random().toString(36).slice(2),
        chat: chatId,
        sender: { _id: contact.id, name: contact.name, avatar: "" },
        text,
        type: "text",
        createdAt: new Date().toISOString(),
        status: "delivered"
      };
      addMessage(msg as any);

      // Show notification toast (only if not currently viewing that chat)
      if (currentChat?._id !== chatId) {
        setNotification({ name: contact.name, text });
        setTimeout(() => setNotification(null), 4000);
      }
    }, 15000 + Math.random() * 15000);

    return () => clearInterval(interval);
  }, [user, token]);

  // Connect socket when token is available
  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);
    socket.on("new_message", (msg: any) => addMessage(msg));
    socket.on("online_users", (users: string[]) => setOnlineUsers(users));
    return () => { disconnectSocket(); };
  }, [token]);

  // Show loading while restoring session
  if (!ready) {
    return (
      <IEFrame>
        <div className="h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3A6EA5 0%, #1C4E8A 50%, #0A246A 100%)" }}>
          <div className="xp-dialog w-[320px]">
            <div className="xp-dialog-title">
              <span>📱 WhatsApp Classic 2006</span>
            </div>
            <div className="p-6 text-center">
              <div className="text-3xl mb-3 animate-pulse">📡</div>
              <p className="text-[11px] text-gray-600 mb-2">Connecting to server...</p>
              <div className="xp-progress-bar">
                <div className="xp-progress-fill loading-3g" />
              </div>
              <p className="text-[9px] text-gray-400 mt-2">GPRS Connection • Please wait...</p>
            </div>
          </div>
        </div>
      </IEFrame>
    );
  }

  // Not logged in
  if (!token || !user) {
    return (
      <IEFrame>
        <AuthScreen />
      </IEFrame>
    );
  }

  // Logged in - main app
  return (
    <IEFrame>
      <div className="flex flex-col h-full">
        {/* App Header */}
        <header className="app-header px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📱</span>
            <span className="text-white font-bold text-sm">WhatsApp Classic 2006</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="signal-bars">
              <div className="signal-bar" style={{ height: "4px" }} />
              <div className="signal-bar" style={{ height: "7px" }} />
              <div className="signal-bar" style={{ height: "10px" }} />
              <div className="signal-bar" style={{ height: "12px" }} />
            </div>
            <span className="text-white text-[10px] bg-green-700 px-2 py-0.5 rounded border border-green-900">
              GPRS Connected
            </span>
          </div>
          <NavIcons />
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <ChatWindow />
          <RightPanel />
        </div>

        {/* Footer */}
        <footer className="app-footer px-4 py-1.5 flex items-center justify-between text-[10px] text-white">
          <span>© 2006 WhatsApp Classic | About | Privacy | Terms</span>
          <span>GPRS • {new Date().toLocaleTimeString()}</span>
        </footer>

        {/* Notification Toast */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-[9999] animate-[slideUp_0.3s_ease]"
            style={{ animation: "slideUp 0.3s ease" }}>
            <div className="rounded-lg border-2 border-[#E8A000] shadow-xl overflow-hidden w-[280px]"
              style={{ background: "linear-gradient(to bottom, #FFFFEE, #FFFACC)" }}>
              <div className="px-3 py-1.5 flex items-center justify-between"
                style={{ background: "linear-gradient(to bottom, #FFE066, #FFCC00)" }}>
                <span className="text-[10px] font-bold text-[#663300]">New Message</span>
                <button onClick={() => setNotification(null)} className="text-[#663300] text-sm leading-none hover:text-red-600">x</button>
              </div>
              <div className="px-3 py-2">
                <p className="text-[11px] font-bold text-[#003399]">{notification.name}</p>
                <p className="text-[11px] text-gray-700 mt-0.5">{notification.text}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </IEFrame>
  );
}

function NavIcons() {
  const { setUser, setToken } = useStore();
  const handleLogout = () => { setUser(null); setToken(null); disconnectSocket(); };

  return (
    <div className="flex items-center gap-1">
      {[
        { icon: "🏠", label: "Home", fn: () => {} },
        { icon: "👤", label: "Contacts", fn: () => {} },
        { icon: "👥", label: "Groups", fn: () => {} },
        { icon: "⚙️", label: "Settings", fn: () => {} },
        { icon: "🚪", label: "Logout", fn: handleLogout },
      ].map((i) => (
        <button key={i.label} onClick={i.fn} className="xp-btn text-[10px] px-1.5 py-0.5" title={i.label}>
          <span className="text-sm">{i.icon}</span>
        </button>
      ))}
    </div>
  );
}
