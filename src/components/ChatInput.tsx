"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="p-4 md:p-6 bg-white border-t">
      <div className="relative mx-auto max-w-3xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !disabled && handleSend()}
          placeholder="Type a message..."
          disabled={disabled}
          className="w-full rounded-full border border-gray-300 bg-gray-50 py-3.5 pl-5 pr-12 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="absolute right-2 top-2 rounded-full bg-blue-600 p-1.5 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:hover:bg-blue-600"
        >
          <Send size={18} />
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-gray-400">
        Press Enter to send
      </p>
    </div>
  );
}