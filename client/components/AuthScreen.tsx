"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useStore } from "@/lib/store";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser, setToken } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin ? { phone, password } : { name, phone, password };
      const res = await api.post(endpoint, payload);
      const { user, token } = res.data;
      setToken(token);
      setUser(user);
      // Seed demo data immediately
      const { getDemoChats, getDemoMessages } = await import("@/lib/demoData");
      const { chats } = getDemoChats(user._id);
      const messages = getDemoMessages(user._id);
      useStore.getState().setChats(chats as any);
      useStore.getState().setMessages(messages as any);
      useStore.getState().setOnlineUsers(["demo_sara", "demo_hassan", "demo_mom", "demo_ayesha"]);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.error || "Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #3A6EA5 0%, #1C4E8A 50%, #0A246A 100%)" }}>
      <div className="xp-dialog w-[420px]">
        {/* Dialog Title */}
        <div className="xp-dialog-title">
          <div className="flex items-center gap-2">
            <span>📱</span>
            <span>WhatsApp Classic 2006 - {isLogin ? "Sign In" : "Register"}</span>
          </div>
          <button className="xp-window-btn xp-window-btn-close text-[9px]"
            onClick={() => alert("You cannot close this window!")}>✕</button>
        </div>

        {/* Dialog Body */}
        <div className="p-6">
          {/* Logo */}
          <div className="text-center mb-4">
            <div className="text-4xl mb-1">📱</div>
            <h1 className="text-lg font-bold text-[#003C8F]">WhatsApp Classic</h1>
            <p className="text-[10px] text-gray-500">Connecting people since 2006™</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-3 p-2 bg-[#FFDDDD] border border-[#D84B4B] rounded text-[11px] text-[#D84B4B]">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <div>
                <label className="block text-[11px] font-bold mb-1">Display Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="xp-input w-full"
                  placeholder="Enter your name"
                  required={!isLogin}
                />
              </div>
            )}
            <div>
              <label className="block text-[11px] font-bold mb-1">Phone Number:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="xp-input w-full"
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="xp-input w-full"
                placeholder="Enter password"
                required
              />
            </div>

            {/* 3G Loading Bar */}
            {loading && (
              <div className="mt-2">
                <p className="text-[10px] text-gray-600 mb-1">📡 Connecting via GPRS...</p>
                <div className="xp-progress-bar">
                  <div className="xp-progress-fill loading-3g" />
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="xp-btn xp-btn-primary w-full py-2 mt-2 disabled:opacity-50"
            >
              {loading ? "Connecting..." : isLogin ? "📡 Sign In" : "📡 Register"}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-4 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-[11px] text-[#0058EE] underline hover:text-[#003C8F]"
            >
              {isLogin ? "New user? Create an account" : "Already have an account? Sign In"}
            </button>
          </div>

          {/* Footer text */}
          <div className="mt-4 pt-3 border-t border-[#ACA899] text-center text-[9px] text-gray-500">
            <p>⚡ Optimized for 56kbps dialup and GPRS connections</p>
            <p className="mt-1">Best viewed in Internet Explorer 6.0 at 1024x768</p>
          </div>
        </div>
      </div>
    </div>
  );
}
