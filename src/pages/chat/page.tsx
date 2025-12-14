"use client";

import { Plus, Send, Trash2, MessageSquare } from "lucide-react";
import { useState } from "react";
import ChatArea, { ChatAreaMessage } from "@/components/ChatArea";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { chatHistory, activeChatId, setActiveChatId, messagesByChatId, sendMessage, clearChat, loading, setChatHistory } = useChat([
    { id: 1, name: "Project Ideas" },
    { id: 2, name: "Python Help" },
  ]);

  const [newMessage, setNewMessage] = useState("");


  const activeMessages: ChatAreaMessage[] = (messagesByChatId[activeChatId] || []).map(msg => ({
    id: msg.id,
    content: msg.text,
    role: msg.sender === "user" ? "user" : "assistant",
  }));

  return (
    <div className="flex h-screen">
      <div className="hidden md:flex w-[260px] flex-col border-r bg-gray-200 p-4 text-black-700">
        <button onClick={() => {
          const newId = Date.now();
          setChatHistory([{ id: newId, name: "New Chat" }, ...chatHistory]);
          setActiveChatId(newId);
        }} className="flex items-center gap-2 rounded-lg border bg-gray-700 px-4 py-3 text-sm font-medium hover:bg-gray-200 transition">
          <Plus size={16} /> New Chat
        </button>
        <div className="mt-6 flex flex-col gap-2 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-gray-500">Recents</p>
          {chatHistory.map(chat => (
            <button key={chat.id} onClick={() => setActiveChatId(chat.id)}
              className={cn("flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition hover:bg-blue",
                chat.id === activeChatId ? "bg-blue-500 text-white hover:bg-blue-600" : "text-gray-700 hover:bg-gray-200")}>
              <MessageSquare size={16} /> {chat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-black">Chat: {chatHistory.find(c => c.id === activeChatId)?.name || "New Chat"}</h2>
          <button onClick={clearChat} disabled={loading} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition disabled:opacity-50">
            <Trash2 size={20} />
          </button>
        </div>

        <ChatArea messages={activeMessages} />

        <div className="p-4 border-t flex gap-2">
          <input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyPress={e => e.key === "Enter" && (sendMessage(newMessage), setNewMessage(""))}
            placeholder="Type your message..."
            className="flex-1 p-3 border rounded-lg focus:ring-blue-600 focus:border-blue-600 text-black"
          />
          <button onClick={() => { sendMessage(newMessage); setNewMessage(""); }} disabled={loading} className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
