"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useStore } from "@/lib/store";
import api from "@/lib/api";
import { getSocket } from "@/lib/socket";

const EMOJIS = [
  "😀","😂","😍","😎","🤔","😢","😡","👍",
  "👎","❤️","🔥","🎉","💯","🙏","😊","🤣",
  "😘","🥺","💀","👀","✨","☕","🍕","🎮"
];

export default function ChatWindow() {
  const { user, currentChat, messages, setMessages, addMessage, connected, onlineUsers } = useStore();
  const [text, setText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sending, setSending] = useState(false);
  // Camera state
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState("");
  // File state
  const [showFilePanel, setShowFilePanel] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const MAX_CHARS = 500;

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Cleanup camera on unmount or close
  useEffect(() => { return () => { stopCamera(); }; }, []);

  const chatMessages = messages.filter((m) => m.chat === currentChat?._id);
  const filteredMessages = searchQuery
    ? chatMessages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : chatMessages;

  const getOtherUser = () => {
    if (!currentChat) return null;
    if (currentChat.isGroup) return { name: currentChat.groupName || "Group", _id: "" };
    return currentChat.participants?.find((p) => p._id !== user?._id) || null;
  };
  const otherUser = getOtherUser();
  const otherOnline = otherUser?._id ? onlineUsers.includes(otherUser._id) : false;

  // === SEND TEXT MESSAGE ===
  const handleSend = async () => {
    if (!text.trim() || !currentChat) return;
    if (!connected) { alert("No connection! Check your GPRS signal."); return; }
    setSending(true);
    try {
      const res = await api.post("/messages", { chatId: currentChat._id, text: text.trim() });
      const msg = res.data.message || res.data;
      addMessage(msg);
      const socket = getSocket();
      if (socket) socket.emit("sendMessage", msg);
      setText(""); setShowEmojis(false);
    } catch { alert("Failed to send. Try again."); }
    setSending(false);
  };

  // === CAMERA FUNCTIONS ===
  const startCamera = async () => {
    if (!connected) { alert("No connection!"); return; }
    if (!currentChat) { alert("Open a chat first!"); return; }
    setCameraError(""); setCapturedImage(null);
    try {
      // Request camera with 2MP-ish resolution (1600x1200)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1600 }, height: { ideal: 1200 }, facingMode: "user" }
      });
      setCameraStream(stream);
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      }, 100);
    } catch (err: any) {
      setCameraError("Camera access denied or not available.\n" + (err.message || ""));
      setShowCamera(true);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    // Capture at 2MP equivalent (1600x1200) then compress to ~200-400KB JPEG
    canvas.width = Math.min(video.videoWidth, 1600);
    canvas.height = Math.min(video.videoHeight, 1200);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Compress to JPEG at 60% quality (simulating 2-3MP phone camera from 2006)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const stopCamera = () => {
    if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); setCameraStream(null); }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const sendCapturedPhoto = () => {
    if (!capturedImage || !currentChat) return;
    // Calculate approximate file size
    const sizeKB = Math.round((capturedImage.length * 3) / 4 / 1024);
    const msg = {
      _id: "photo_" + Date.now(),
      chat: currentChat._id,
      sender: { _id: user?._id || "", name: user?.name || "You", avatar: "" },
      text: `[Photo captured - ${sizeKB}KB - JPEG 2MP]`,
      type: "image",
      fileUrl: capturedImage,
      createdAt: new Date().toISOString(),
      status: "sent"
    };
    addMessage(msg as any);
    setCapturedImage(null); setShowCamera(false);
  };

  const closeCamera = () => { stopCamera(); setCapturedImage(null); setShowCamera(false); setCameraError(""); };

  // === REAL FILE UPLOAD ===
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!connected) { alert("No connection!"); return; }
    if (file.size > 2 * 1024 * 1024) { alert("File too large! Maximum 2MB allowed."); return; }
    const sizeKB = Math.round(file.size / 1024);
    const msg = {
      _id: "file_" + Date.now(),
      chat: currentChat!._id,
      sender: { _id: user?._id || "", name: user?.name || "You", avatar: "" },
      text: `[File: ${file.name} - ${sizeKB}KB]`,
      type: "text",
      createdAt: new Date().toISOString(),
      status: "sent"
    };
    addMessage(msg as any);
    setShowFilePanel(false);
    e.target.value = "";
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!connected) { alert("No connection!"); return; }
    if (file.size > 1 * 1024 * 1024) { alert("Image too large! Maximum 1MB allowed."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const sizeKB = Math.round(file.size / 1024);
      const msg = {
        _id: "img_" + Date.now(),
        chat: currentChat!._id,
        sender: { _id: user?._id || "", name: user?.name || "You", avatar: "" },
        text: `[Image: ${file.name} - ${sizeKB}KB]`,
        type: "image",
        fileUrl: dataUrl,
        createdAt: new Date().toISOString(),
        status: "sent"
      };
      addMessage(msg as any);
      setShowFilePanel(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleClearChat = () => {
    if (confirm("Delete all messages in this chat?\n\nThis cannot be undone.")) {
      setMessages(messages.filter(m => m.chat !== currentChat?._id));
    }
  };

  // === EMPTY STATE ===
  if (!currentChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center border-r border-[#ACA899]"
        style={{ background: "linear-gradient(135deg, #E8F4FD 0%, #D6E7FD 50%, #C4DAFC 100%)" }}>
        <div className="text-center p-8">
          <div className="text-6xl mb-4 opacity-60">💬</div>
          <h2 className="text-xl font-bold text-[#003C8F] mb-2">WhatsApp Classic 2006</h2>
          <p className="text-[12px] text-[#445] mb-4">Select a contact to start a conversation</p>
          <div className="inline-block p-4 rounded-lg border-2 border-[#B4D2F7]" style={{ background: "linear-gradient(to bottom, #FFFFFF, #F0F7FF)" }}>
            <p className="text-[10px] text-gray-500">Click a contact on the left to chat</p>
            <p className="text-[10px] text-gray-400 mt-2">Signed in as <b>{user?.name}</b></p>
          </div>
        </div>
      </div>
    );
  }

  // === MAIN RENDER ===
  return (
    <div className="flex-1 flex flex-col border-r border-[#ACA899] bg-white overflow-hidden">
      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.zip,.rar" onChange={handleFileSelect} />
      <input ref={imageInputRef} type="file" className="hidden" accept="image/jpeg,image/png,image/bmp" onChange={handleImageSelect} />
      <canvas ref={canvasRef} className="hidden" />

      {/* Chat Title Bar */}
      <div className="xp-panel-title justify-between px-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm border border-white/30">
            {currentChat.isGroup ? "👥" : "👤"}
          </div>
          <div>
            <span className="font-bold text-[12px]">{otherUser?.name || "Chat"}</span>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${otherOnline ? "bg-green-400" : "bg-gray-400"}`} />
              <span className="text-[9px] opacity-80">{otherOnline ? "Online" : "Last seen recently"}</span>
            </div>
          </div>
        </div>
        <span className="text-[9px] opacity-70">{connected ? "Connected" : "No Signal"}</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-[#D5D5D5]"
        style={{ background: "linear-gradient(to bottom, #FAFAFA, #EEEEEE)" }}>
        <button className="xp-btn text-[9px] px-2 py-1" onClick={() => setShowFilePanel(!showFilePanel)}>📎 File</button>
        <button className="xp-btn text-[9px] px-2 py-1" onClick={() => imageInputRef.current?.click()}>🖼️ Image</button>
        <button className="xp-btn text-[9px] px-2 py-1" onClick={startCamera}>📷 Camera</button>
        <button className="xp-btn text-[9px] px-2 py-1" onClick={() => setShowEmojis(!showEmojis)}>😊 Emoji</button>
        <div className="flex-1" />
        <button className="xp-btn text-[9px] px-2 py-1" onClick={() => setShowSearch(!showSearch)}>🔍</button>
        <button className="xp-btn text-[9px] px-2 py-1" onClick={() => setShowHistory(!showHistory)}>📜</button>
        <button className="xp-btn text-[9px] px-2 py-1" onClick={handleClearChat}>🗑️</button>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#FFFFF0] border-b border-[#E8E0C0]">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..." className="xp-input flex-1 text-[11px]" autoFocus />
          <button className="xp-btn text-[9px] px-2" onClick={() => { setShowSearch(false); setSearchQuery(""); }}>Close</button>
        </div>
      )}

      {/* File Upload Panel */}
      {showFilePanel && (
        <div className="px-3 py-2 bg-[#F5F5F0] border-b border-[#D5D5D5]">
          <p className="text-[10px] font-bold mb-2">Send File (Max 2MB)</p>
          <div className="flex gap-2">
            <button className="xp-btn text-[9px] px-3" onClick={() => fileInputRef.current?.click()}>Browse...</button>
            <button className="xp-btn text-[9px] px-2" onClick={() => setShowFilePanel(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* History Panel */}
      {showHistory && (
        <div className="px-3 py-2 bg-[#F0F5FF] border-b border-[#B5C8E8]">
          <p className="text-[10px] font-bold">Chat History - {chatMessages.length} messages</p>
          <p className="text-[9px] text-gray-500 mt-1">First: {chatMessages[0] ? new Date(chatMessages[0].createdAt).toLocaleString() : "N/A"}</p>
          <button className="xp-btn text-[9px] px-2 mt-1" onClick={() => setShowHistory(false)}>Close</button>
        </div>
      )}

      {/* CAMERA PANEL */}
      {showCamera && (
        <div className="border-b-2 border-[#ACA899] bg-black p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-green-400 font-bold">Camera - 2MP Mode (1600x1200)</span>
            <button className="text-white text-xs bg-red-600 px-2 py-0.5 rounded" onClick={closeCamera}>Close</button>
          </div>
          {cameraError ? (
            <div className="text-center py-6">
              <p className="text-red-400 text-[11px]">{cameraError}</p>
              <button className="xp-btn text-[9px] mt-2" onClick={closeCamera}>OK</button>
            </div>
          ) : capturedImage ? (
            <div className="text-center">
              <img src={capturedImage} alt="Captured" className="max-h-[200px] mx-auto rounded border border-gray-600" />
              <p className="text-[9px] text-gray-400 mt-1">Preview - JPEG 60% quality ({Math.round((capturedImage.length * 3) / 4 / 1024)}KB)</p>
              <div className="flex gap-2 justify-center mt-2">
                <button className="xp-btn xp-btn-primary text-[10px] px-4" onClick={sendCapturedPhoto}>Send Photo</button>
                <button className="xp-btn text-[10px] px-3" onClick={() => { setCapturedImage(null); startCamera(); }}>Retake</button>
                <button className="xp-btn text-[10px] px-3" onClick={closeCamera}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <video ref={videoRef} autoPlay playsInline muted className="max-h-[200px] mx-auto rounded border border-gray-600 bg-gray-900" />
              <div className="flex gap-2 justify-center mt-2">
                <button className="xp-btn xp-btn-primary text-[10px] px-4" onClick={capturePhoto}>Capture</button>
                <button className="xp-btn text-[10px] px-3" onClick={closeCamera}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ background: "#F8F5F0" }}>
        {filteredMessages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[11px] text-gray-400">No messages yet. Say hello!</p>
          </div>
        )}
        {filteredMessages.map((msg) => {
          const isSelf = msg.sender?._id === user?._id || (msg.sender as unknown as string) === user?._id;
          const senderName = typeof msg.sender === "object" ? msg.sender.name : "User";
          const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return (
            <div key={msg._id} className={`flex ${isSelf ? "justify-end" : "justify-start"}`}>
              <div className={`relative max-w-[70%] ${isSelf ? "msg-bubble-self" : "msg-bubble-other"}`}
                style={{ padding: "10px 14px", borderRadius: isSelf ? "12px 2px 12px 12px" : "2px 12px 12px 12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                {!isSelf && <p className="text-[10px] font-bold text-[#0058EE] mb-1">{senderName}</p>}
                {/* Show image if it has fileUrl */}
                {msg.fileUrl && msg.type === "image" && (
                  <img src={msg.fileUrl} alt="Photo" className="max-w-[240px] max-h-[180px] rounded mb-1 border border-gray-300 cursor-pointer"
                    onClick={() => window.open(msg.fileUrl, "_blank")} />
                )}
                <p className="text-[12px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[9px] text-gray-400">{time}</span>
                  {isSelf && <span className="text-[9px]" style={{ color: "#53BDEB" }}>✓✓</span>}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Panel */}
      {showEmojis && (
        <div className="border-t border-[#D5D5D5] p-2" style={{ background: "linear-gradient(to bottom, #FFFDF0, #FFF8E0)" }}>
          <div className="grid grid-cols-8 gap-1 max-h-[100px] overflow-y-auto">
            {EMOJIS.map((emoji) => (
              <button key={emoji} onClick={() => setText(prev => prev + emoji)}
                className="text-xl hover:bg-[#FFE88C] rounded p-1 transition-colors">{emoji}</button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t-2 border-[#ACA899]" style={{ background: "linear-gradient(to bottom, #F5F3EC, #ECE9D8)" }}>
        {!connected && (
          <div className="px-3 py-1.5 bg-[#FFE8E8] border-b border-[#FFCCCC]">
            <span className="text-[10px] text-[#CC0000] font-bold">No connection! Messages cannot be sent.</span>
          </div>
        )}
        <div className="flex items-center gap-2 p-2.5">
          <button onClick={() => setShowEmojis(!showEmojis)} className="xp-btn px-2 py-1.5 text-lg">😊</button>
          <button onClick={() => fileInputRef.current?.click()} className="xp-btn px-2 py-1.5 text-lg">📎</button>
          <button onClick={startCamera} className="xp-btn px-2 py-1.5 text-lg">📷</button>
          <input type="text" value={text}
            onChange={(e) => e.target.value.length <= MAX_CHARS && setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={connected ? "Type a message..." : "Disconnected"}
            className="xp-input flex-1 py-2 text-[12px]" disabled={!connected} />
          <span className="text-[9px] text-gray-400 w-14 text-right">{text.length}/{MAX_CHARS}</span>
          <button onClick={handleSend} disabled={!text.trim() || !connected || sending}
            className="xp-btn xp-btn-primary px-5 py-2 text-[12px] font-bold disabled:opacity-50">
            {sending ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
