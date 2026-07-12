"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import api from "@/lib/api";

const GROUPS = ["Favorites", "Friends", "Family", "Work", "Offline"];

export default function Sidebar() {
  const { user, chats, currentChat, setCurrentChat, setMessages, onlineUsers } = useStore();
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [newChatPhone, setNewChatPhone] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);

  const toggleGroup = (group: string) => {
    setCollapsed((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleSelectChat = async (chat: any) => {
    setCurrentChat(chat);
    try {
      const res = await api.get(`/messages/${chat._id}`);
      setMessages(res.data.messages || res.data || []);
    } catch (e) {
      setMessages([]);
    }
  };

  const handleNewChat = async () => {
    if (!newChatPhone.trim()) return;
    try {
      // First search for user by phone
      const searchRes = await api.get(`/user/search?q=${encodeURIComponent(newChatPhone.trim())}`);
      const users = searchRes.data || [];
      if (users.length > 0) {
        // Found on server - create real chat
        const res = await api.post("/chats", { participantId: users[0]._id });
        const chat = res.data.chat || res.data;
        setCurrentChat(chat);
      } else {
        // Not found on server - create local demo chat
        const newId = "local_" + Date.now().toString(36);
        const contactName = prompt("Enter contact name:") || newChatPhone.trim();
        const newChat = {
          _id: "chat_" + newId,
          participants: [
            { _id: user?._id || "", name: user?.name || "You", status: "online" },
            { _id: newId, name: contactName, phone: newChatPhone.trim(), status: "offline", avatar: "" }
          ],
          isGroup: false,
          lastMessage: null,
          updatedAt: new Date().toISOString()
        };
        const currentChats = useStore.getState().chats;
        useStore.getState().setChats([newChat as any, ...currentChats]);
        setCurrentChat(newChat as any);
      }
      setShowNewChat(false);
      setNewChatPhone("");
    } catch (e: any) {
      // Fallback: create local chat on any error
      const newId = "local_" + Date.now().toString(36);
      const contactName = prompt("Enter contact name:") || newChatPhone.trim();
      const newChat = {
        _id: "chat_" + newId,
        participants: [
          { _id: user?._id || "", name: user?.name || "You", status: "online" },
          { _id: newId, name: contactName, phone: newChatPhone.trim(), status: "offline", avatar: "" }
        ],
        isGroup: false,
        lastMessage: null,
        updatedAt: new Date().toISOString()
      };
      const currentChats = useStore.getState().chats;
      useStore.getState().setChats([newChat as any, ...currentChats]);
      setCurrentChat(newChat as any);
      setShowNewChat(false);
      setNewChatPhone("");
    }
  };

  const getOtherUser = (chat: any) => {
    if (chat.isGroup) return { name: chat.groupName || "Group", phone: "" };
    const other = chat.participants?.find((p: any) => p._id !== user?._id);
    return other || { name: "Unknown", phone: "" };
  };

  const isOnline = (userId: string) => onlineUsers.includes(userId);

  const filteredChats = useMemo(() => {
    if (!search) return chats;
    return chats.filter((chat) => {
      const other = getOtherUser(chat);
      return other.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [chats, search, user]);

  // Group chats into categories (simple assignment for demo)
  const groupedChats = useMemo(() => {
    const groups: Record<string, any[]> = {};
    GROUPS.forEach((g) => (groups[g] = []));
    filteredChats.forEach((chat, i) => {
      const other = getOtherUser(chat);
      const userId = chat.participants?.find((p: any) => p._id !== user?._id)?._id;
      if (userId && !isOnline(userId)) {
        groups["Offline"].push(chat);
      } else if (i % 4 === 0) {
        groups["Favorites"].push(chat);
      } else if (i % 4 === 1) {
        groups["Friends"].push(chat);
      } else if (i % 4 === 2) {
        groups["Family"].push(chat);
      } else {
        groups["Work"].push(chat);
      }
    });
    return groups;
  }, [filteredChats, onlineUsers, user]);

  return (
    <div className="w-[280px] flex flex-col border-r border-[#ACA899] bg-white overflow-hidden">
      {/* Panel Title */}
      <div className="xp-panel-title">
        <span>👤</span>
        <span>Contacts</span>
        <span className="ml-auto text-[9px] opacity-70">{chats.length} total</span>
      </div>

      {/* Search */}
      <div className="p-2 border-b border-[#E8E8E8]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search contacts..."
          className="xp-input w-full"
        />
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {GROUPS.map((group) => (
          <div key={group}>
            <div className="group-header" onClick={() => toggleGroup(group)}>
              <span>{collapsed[group] ? "▶" : "▼"}</span>
              <span>{group}</span>
              <span className="ml-auto text-[9px] text-gray-500">
                ({groupedChats[group]?.length || 0})
              </span>
            </div>
            {!collapsed[group] && groupedChats[group]?.map((chat) => {
              const other = getOtherUser(chat);
              const userId = chat.participants?.find((p: any) => p._id !== user?._id)?._id;
              const online = userId ? isOnline(userId) : false;
              const isActive = currentChat?._id === chat._id;

              return (
                <div
                  key={chat._id}
                  onClick={() => handleSelectChat(chat)}
                  className={`contact-item flex items-center gap-2 px-3 py-2 cursor-pointer ${isActive ? "active" : ""}`}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {chat.isGroup ? "👥" : "👤"}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className={`status-dot ${online ? "status-online" : "status-offline"}`} />
                      <span className="text-[11px] font-bold truncate">{other.name}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 truncate">
                      {chat.lastMessage?.text || "No messages yet"}
                    </p>
                  </div>
                  {/* Time & Unread */}
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[9px] text-gray-400">
                      {chat.lastMessage?.createdAt
                        ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : ""}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {chats.length === 0 && (
          <div className="p-4 text-center text-[11px] text-gray-500">
            <p>📭 No contacts yet</p>
            <p className="mt-1">Click &quot;Add Contact&quot; below to start chatting</p>
          </div>
        )}
      </div>

      {/* New Chat Dialog */}
      {showNewChat && (
        <div className="p-2 border-t border-[#ACA899] bg-[#F5F5F5]">
          <label className="text-[10px] font-bold">Enter phone number:</label>
          <div className="flex gap-1 mt-1">
            <input
              type="text"
              value={newChatPhone}
              onChange={(e) => setNewChatPhone(e.target.value)}
              className="xp-input flex-1"
              placeholder="+1234567890"
              onKeyDown={(e) => e.key === "Enter" && handleNewChat()}
            />
            <button onClick={handleNewChat} className="xp-btn xp-btn-primary text-[10px] px-2">OK</button>
            <button onClick={() => setShowNewChat(false)} className="xp-btn text-[10px] px-2">✕</button>
          </div>
        </div>
      )}

      {/* Bottom Buttons */}
      <div className="p-2 border-t border-[#ACA899] flex gap-2">
        <button
          onClick={() => setShowNewChat(true)}
          className="xp-btn flex-1 text-[10px]"
        >
          ➕ Add Contact
        </button>
        <button
          onClick={() => alert("Group creation coming in v2.0!")}
          className="xp-btn flex-1 text-[10px]"
        >
          👥 New Group
        </button>
      </div>
    </div>
  );
}
