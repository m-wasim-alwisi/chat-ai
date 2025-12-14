"use client";

import { MessageSquare, Plus, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StateMessage {
  id: number;
  text: string;
  sender: "user" | "ai";
}

interface ChatAreaMessage {
  id: number;
  content: string;
  role: "user" | "assistant";
  text?: string;
}

interface ChatHistoryItem {
  id: number;
  name: string;
}

type MessagesByChatId = Record<number, StateMessage[]>;


interface ChatAreaProps {
  messages: ChatAreaMessage[];
}

function ChatArea({ messages }: ChatAreaProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn(
            "flex w-full",
            msg.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm",
              msg.role === "user"
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-100 text-gray-800 rounded-bl-none"
            )}
          >
            {msg.content || msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}

const mapMessagesForChatArea = (
  messages: StateMessage[]
): ChatAreaMessage[] => {
  return messages.map((msg) => ({
    ...msg,
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.text,
  }));
};

export default function ChatPage() {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([
    { id: 1, name: "Project Ideas" },
    { id: 2, name: "Python Help" },
  ]);

  const [activeChatId, setActiveChatId] = useState<number>(1);
  const [messagesByChatId, setMessagesByChatId] = useState<MessagesByChatId>({
    1: [{ id: 1, text: "Welcome! This is chat 1 data.", sender: "ai" }],
    2: [{ id: 2, text: "This is chat 2 data.", sender: "user" }],
  });

  const [newMessageText, setNewMessageText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleNewChat = () => {
    const newChatId = Date.now();
    setChatHistory([{ id: newChatId, name: "New Chat" }, ...chatHistory]);
    setMessagesByChatId((prev) => ({ ...prev, [newChatId]: [] }));
    setActiveChatId(newChatId);
  };

  const handleSendMessage = async () => {
    if (!newMessageText.trim()) return;

    const newMessage: StateMessage = {
      id: Date.now(),
      text: newMessageText,
      sender: "user",
    };

    setMessagesByChatId((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage],
    }));
    setNewMessageText("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage.text }),
      });
      const data = await response.json();

      const botMessage: StateMessage = {
        id: Date.now() + 1,
        text: data.reply,
        sender: "ai",
      };

      setMessagesByChatId((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), botMessage],
      }));
    } catch (err) {
      console.error(err);
      const errorMessage: StateMessage = {
        id: Date.now() + 1,
        text: "Backend not reachable (Error: 500).",
        sender: "ai",
      };
      setMessagesByChatId((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), errorMessage],
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessagesByChatId((prev) => ({ ...prev, [activeChatId]: [] }));
  };

  const activeChatMessages = mapMessagesForChatArea(
    messagesByChatId[activeChatId] || []
  );
  const activeChatName =
    chatHistory.find((c) => c.id === activeChatId)?.name || "New Chat";

  return (
    <div className="flex h-screen">
        <div className="flex w-[260px] flex-col border-r bg-gray-200 p-4 hidden md:flex text-black-700">
        <button
          className="flex items-center gap-2 rounded-lg border bg-gray-700 px-4 py-3 text-sm font-medium hover:bg-gray-200 transition"
          onClick={handleNewChat}
        >
          <Plus size={16} />
          New Chat
        </button>
        <div className="mt-6 flex flex-col gap-2 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-gray-500">Recents</p>
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition hover:bg-blue",
                chat.id === activeChatId
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "text-gray-700 hover:bg-gray-200"
              )}
            >
              <MessageSquare size={16} />
              {chat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        <div className="flex items-center justify-between p-4 border-b ">
          <h2 className="text-xl text-black font-semibold">Chat: {activeChatName}</h2>
          <button
            onClick={handleClearChat}
            disabled={loading}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition disabled:opacity-50"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <ChatArea messages={activeChatMessages} />

        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            placeholder="Type your message..."
            className="flex-1 p-3 border rounded-lg focus:ring-blue-600 ring-blue-400 focus:border-blue-600 border-blue-400  text-black"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
