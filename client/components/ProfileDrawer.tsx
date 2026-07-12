"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import api from "@/lib/api";

export default function ProfileDrawer({ onClose }: { onClose: () => void }) {
  const { user, setUser } = useStore();
  const [name, setName] = useState(user?.name || "");
  const [customStatus, setCustomStatus] = useState(user?.customStatus || "");
  const [phone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put("/user/profile", { name, customStatus });
      setUser(data.user || data);
      setSaved(true);
      setTimeout(() => onClose(), 1200);
    } catch { alert("Failed to save. Try again."); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="w-[380px] rounded-lg overflow-hidden shadow-2xl border-2 border-[#0058EE]"
        style={{ background: "#ECE9D8" }}>
        {/* Title */}
        <div className="xp-panel-title px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2"><span>👤</span><span>Edit Profile</span></div>
          <button onClick={onClose} className="text-white hover:text-red-200 text-lg leading-none">✕</button>
        </div>
        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-3xl text-white font-bold"
              style={{ background: "linear-gradient(135deg, #4488DD, #1155AA)", border: "3px solid #88BBEE" }}>
              👤
            </div>
            <p className="text-[10px] text-gray-500">{phone}</p>
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#003399] block mb-1">Display Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="xp-input w-full" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#003399] block mb-1">Status Message</label>
            <input value={customStatus} onChange={e => setCustomStatus(e.target.value)} className="xp-input w-full" placeholder="What's on your mind?" />
          </div>
          {saved && (
            <div className="text-center text-[11px] text-green-700 font-bold bg-green-50 border border-green-200 rounded p-2">
              ✅ Profile saved successfully!
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={saving} className="xp-btn xp-btn-primary flex-1 py-2">
              {saving ? "⏳ Saving..." : "💾 Save Profile"}
            </button>
            <button onClick={onClose} className="xp-btn flex-1 py-2">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
