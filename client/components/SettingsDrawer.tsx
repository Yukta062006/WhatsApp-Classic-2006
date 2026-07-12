"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

export default function SettingsDrawer({ onClose }: { onClose: () => void }) {
  const { connected, setConnected } = useStore();
  const [theme, setTheme] = useState("blue");
  const [fontSize, setFontSize] = useState("medium");
  const [sounds, setSounds] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1000);
  };

  const handleChangePassword = () => {
    const current = prompt("Enter current password:");
    if (!current) return;
    const newPass = prompt("Enter new password (min 4 chars):");
    if (!newPass || newPass.length < 4) { alert("Password must be at least 4 characters."); return; }
    const confirm = prompt("Confirm new password:");
    if (confirm !== newPass) { alert("Passwords don't match!"); return; }
    alert("✅ Password changed successfully!");
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="w-[400px] rounded-lg overflow-hidden shadow-2xl border-2 border-[#0058EE]"
        style={{ background: "#ECE9D8" }}>
        <div className="xp-panel-title px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2"><span>⚙️</span><span>Settings</span></div>
          <button onClick={onClose} className="text-white hover:text-red-200 text-lg leading-none">✕</button>
        </div>
        <div className="p-5 space-y-4">
          {/* Appearance */}
          <fieldset className="border border-[#ACA899] rounded p-3">
            <legend className="text-[10px] font-bold text-[#003399] px-1">🎨 Appearance</legend>
            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-bold block mb-1">Theme</label>
                <select value={theme} onChange={e => setTheme(e.target.value)} className="xp-input w-full text-[11px]">
                  <option value="blue">Classic Blue (Default)</option>
                  <option value="silver">Silver</option>
                  <option value="olive">Olive Green</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold block mb-1">Font Size</label>
                <select value={fontSize} onChange={e => setFontSize(e.target.value)} className="xp-input w-full text-[11px]">
                  <option value="small">Small (10px)</option>
                  <option value="medium">Medium (12px)</option>
                  <option value="large">Large (14px)</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* Notifications */}
          <fieldset className="border border-[#ACA899] rounded p-3">
            <legend className="text-[10px] font-bold text-[#003399] px-1">🔔 Notifications</legend>
            <label className="flex items-center gap-2 text-[11px] mb-1.5 cursor-pointer">
              <input type="checkbox" checked={sounds} onChange={e => setSounds(e.target.checked)} className="accent-[#0058EE]" />
              Enable notification sounds
            </label>
            <label className="flex items-center gap-2 text-[11px] cursor-pointer">
              <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} className="accent-[#0058EE]" />
              Show popup notifications
            </label>
          </fieldset>

          {/* Connection */}
          <fieldset className="border border-[#ACA899] rounded p-3">
            <legend className="text-[10px] font-bold text-[#003399] px-1">📡 Connection</legend>
            <div className="flex items-center justify-between">
              <span className="text-[11px]">Status: <b className={connected ? "text-green-700" : "text-red-600"}>{connected ? "Connected" : "Disconnected"}</b></span>
              <button onClick={() => setConnected(!connected)} className="xp-btn text-[9px] px-3">
                {connected ? "Disconnect" : "Connect"}
              </button>
            </div>
            {!connected && <p className="text-[9px] text-red-500 mt-1">⚠️ Cannot send/receive while disconnected.</p>}
            <div className="mt-2">
              <label className="text-[10px] font-bold block mb-1">Network Type</label>
              <select className="xp-input w-full text-[11px]">
                <option>GPRS (56 kbps)</option>
                <option>EDGE (128 kbps)</option>
                <option>Broadband (256 kbps)</option>
              </select>
            </div>
          </fieldset>

          {/* Account */}
          <fieldset className="border border-[#ACA899] rounded p-3">
            <legend className="text-[10px] font-bold text-[#003399] px-1">🔒 Account</legend>
            <button onClick={handleChangePassword} className="xp-btn text-[10px] w-full">🔑 Change Password</button>
          </fieldset>

          {saved && (
            <div className="text-center text-[11px] text-green-700 font-bold bg-green-50 border border-green-200 rounded p-2">
              ✅ Settings saved!
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} className="xp-btn xp-btn-primary flex-1 py-2">💾 OK</button>
            <button onClick={onClose} className="xp-btn flex-1 py-2">Cancel</button>
            <button onClick={handleSave} className="xp-btn flex-1 py-2">Apply</button>
          </div>

          <p className="text-[9px] text-gray-400 text-center pt-2 border-t border-[#D5D5D5]">
            WhatsApp Classic 2006 • Version 1.0.0 • © 2006 WhatsApp Inc.
          </p>
        </div>
      </div>
    </div>
  );
}
