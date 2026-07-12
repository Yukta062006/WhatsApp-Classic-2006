"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import api from "@/lib/api";
import ProfileDrawer from "./ProfileDrawer";
import SettingsDrawer from "./SettingsDrawer";

const STATUS_OPTIONS = [
  { value: "available", label: "🟢 Available", color: "#44AA44" },
  { value: "busy", label: "🔴 Busy", color: "#D84B4B" },
  { value: "away", label: "🟡 Away", color: "#F3C623" },
  { value: "invisible", label: "👻 Invisible", color: "#999" },
  { value: "offline", label: "⚫ Appear Offline", color: "#666" },
];

export default function RightPanel() {
  const { user, connected, setConnected, chats } = useStore();
  const [status, setStatus] = useState("available");
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");

  const handleStatusChange = async (val: string) => {
    setStatus(val);
    if (val === "offline") setConnected(false);
    else setConnected(true);
    try { await api.put("/user/profile", { status: val }); } catch {}
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) { alert("Enter a group name!"); return; }
    try {
      await api.post("/groups", { name: groupName.trim(), members: [] });
      alert(`✅ Group "${groupName}" created!`);
      setGroupName("");
      setShowCreateGroup(false);
    } catch { alert("Failed to create group."); }
  };

  const groupChats = chats.filter(c => c.isGroup);

  return (
    <div className="w-[240px] flex flex-col overflow-y-auto"
      style={{ background: "linear-gradient(to bottom, #F8F8F8, #F0F0F0)" }}>

      {/* Profile Card */}
      <div className="xp-panel m-1.5">
        <div className="xp-panel-title text-[10px]"><span>👤</span><span>My Profile</span></div>
        <div className="p-3 text-center">
          <div className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl font-bold text-white"
            style={{ background: "linear-gradient(135deg, #4488DD 0%, #1155AA 100%)", border: "2px solid #88BBEE", boxShadow: "0 2px 6px rgba(0,50,150,0.3)" }}>
            👤
          </div>
          <p className="text-[12px] font-bold text-[#003399]">{user?.name || "User"}</p>
          <p className="text-[10px] text-gray-500">{user?.phone || ""}</p>
          <p className="text-[10px] text-gray-400 italic mt-0.5">{user?.customStatus || "Available"}</p>
          <button onClick={() => setShowProfile(true)} className="xp-btn text-[10px] mt-2 w-full">✏️ Edit Profile</button>
        </div>
      </div>

      {/* Status Panel */}
      <div className="xp-panel m-1.5">
        <div className="xp-panel-title text-[10px]"><span>🔵</span><span>My Status</span></div>
        <div className="p-2 space-y-0.5">
          {STATUS_OPTIONS.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-[#E8F0FE] text-[11px] transition-colors">
              <input type="radio" name="status" value={opt.value} checked={status === opt.value}
                onChange={() => handleStatusChange(opt.value)} className="w-3 h-3 accent-[#0058EE]" />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Groups Panel */}
      <div className="xp-panel m-1.5">
        <div className="xp-panel-title text-[10px]"><span>👥</span><span>Groups</span></div>
        <div className="p-2">
          {groupChats.length === 0 ? (
            <p className="text-[10px] text-gray-500 text-center py-2">No groups yet</p>
          ) : (
            <div className="space-y-1 mb-2">
              {groupChats.map(chat => (
                <div key={chat._id} className="flex items-center gap-2 p-1.5 rounded hover:bg-[#E8F0FE] cursor-pointer text-[10px]">
                  <span className="text-sm">👥</span>
                  <span className="font-bold flex-1 truncate">{chat.groupName}</span>
                  <span className="text-[9px] text-gray-400">{chat.participants?.length || 0}</span>
                </div>
              ))}
            </div>
          )}
          {showCreateGroup ? (
            <div className="space-y-1.5 pt-1 border-t border-[#E8E8E8]">
              <input type="text" value={groupName} onChange={e => setGroupName(e.target.value)}
                placeholder="Group name..." className="xp-input w-full text-[10px]"
                onKeyDown={e => e.key === "Enter" && handleCreateGroup()} />
              <div className="flex gap-1">
                <button onClick={handleCreateGroup} className="xp-btn xp-btn-primary text-[9px] flex-1">Create</button>
                <button onClick={() => setShowCreateGroup(false)} className="xp-btn text-[9px] px-2">✕</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowCreateGroup(true)} className="xp-btn text-[10px] w-full">➕ Create Group</button>
          )}
        </div>
      </div>

      {/* Connection Panel */}
      <div className="xp-panel m-1.5">
        <div className="xp-panel-title text-[10px]" style={!connected ? { background: "linear-gradient(to bottom, #AA4444, #882222)" } : undefined}>
          <span>📡</span><span>Connection</span>
        </div>
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="signal-bars">
              {[4, 7, 10, 13].map((h, i) => (
                <div key={i} className="signal-bar"
                  style={{ height: `${h}px`, background: connected ? "#44AA44" : "#D84B4B", animationDelay: `${i*0.2}s` }} />
              ))}
            </div>
            <span className={`text-[11px] font-bold ${connected ? "text-green-700" : "text-red-600"}`}>
              {connected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <p className="text-[9px] text-gray-500 mb-2">{connected ? "GPRS • 56kbps • Stable Signal" : "⚠️ No network signal detected"}</p>
          <button onClick={() => setConnected(!connected)}
            className={`xp-btn text-[10px] w-full ${!connected ? "xp-btn-primary" : ""}`}>
            {connected ? "🔌 Disconnect" : "📡 Reconnect"}
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="p-2 mt-auto">
        <button onClick={() => setShowSettings(true)} className="xp-btn text-[10px] w-full">⚙️ Settings</button>
      </div>

      {/* Modals */}
      {showProfile && <ProfileDrawer onClose={() => setShowProfile(false)} />}
      {showSettings && <SettingsDrawer onClose={() => setShowSettings(false)} />}
    </div>
  );
}
