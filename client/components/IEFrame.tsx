"use client";

import React from "react";

interface IEFrameProps {
  children: React.ReactNode;
}

export default function IEFrame({ children }: IEFrameProps) {
  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col bg-[#ECE9D8] border-2 border-[#0A246A] rounded shadow-2xl"
      style={{ height: "96vh", minHeight: "600px" }}>
      {/* Title Bar */}
      <div className="ie-titlebar">
        <div className="flex items-center gap-2">
          <span className="text-sm">🌐</span>
          <span>WhatsApp Classic 2006 - Microsoft Internet Explorer</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="xp-window-btn xp-window-btn-min" title="Minimize">_</button>
          <button className="xp-window-btn xp-window-btn-max" title="Maximize">□</button>
          <button className="xp-window-btn xp-window-btn-close" title="Close"
            onClick={() => alert("Nice try! This is 2006, we don't close browsers.")}>✕</button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="ie-menubar">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Favorites</span>
        <span>Tools</span>
        <span>Help</span>
      </div>

      {/* Toolbar */}
      <div className="ie-toolbar">
        <ToolbarBtn icon="⬅️" label="Back" />
        <ToolbarBtn icon="➡️" label="Forward" />
        <div className="w-px h-5 bg-[#ACA899] mx-1" />
        <ToolbarBtn icon="🛑" label="Stop" />
        <ToolbarBtn icon="🔄" label="Refresh" />
        <ToolbarBtn icon="🏠" label="Home" />
        <div className="w-px h-5 bg-[#ACA899] mx-1" />
        <ToolbarBtn icon="🔍" label="Search" />
        <ToolbarBtn icon="⭐" label="Favorites" />
        <ToolbarBtn icon="📜" label="History" />
        <ToolbarBtn icon="📧" label="Mail" />
        <ToolbarBtn icon="🖨️" label="Print" />
      </div>

      {/* Address Bar */}
      <div className="ie-addressbar">
        <span className="text-[10px] font-bold">Address</span>
        <div className="flex items-center flex-1 bg-white border border-[#7F9DB9] px-1">
          <span className="text-sm mr-1">🔒</span>
          <input
            type="text"
            defaultValue="https://www.whatsappclassic2006.com"
            className="flex-1 border-none outline-none text-[11px] py-0.5"
            readOnly
          />
        </div>
        <button className="xp-btn text-[10px] px-3">Go</button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden bg-white">
        {children}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-2 py-0.5 bg-[#ECE9D8] border-t border-[#ACA899] text-[10px]">
        <div className="flex items-center gap-1">
          <span>✅</span>
          <span>Done</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🌐 Internet</span>
          <span>🔒 128-bit SSL</span>
        </div>
      </div>
    </div>
  );
}

function ToolbarBtn({ icon, label }: { icon: string; label: string }) {
  return (
    <button
      className="ie-toolbar-btn"
      title={label}
      onClick={() => alert(`${label} - This feature is not available in 2006 edition.`)}
    >
      <span className="text-sm">{icon}</span>
      <span className="text-[9px] text-gray-600">{label}</span>
    </button>
  );
}
