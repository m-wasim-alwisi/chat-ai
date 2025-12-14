import { useState } from "react";

export interface StateMessage {
  id: number;
  text: string;
  sender: "user" | "ai";
}

export interface ChatHistoryItem {
  id: number;
  name: string;
}

export type MessagesByChatId = Record<number, StateMessage[]>;

export function useChat(initialChats: ChatHistoryItem[]) {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<number>(initialChats[0]?.id || 1);
  const [messagesByChatId, setMessagesByChatId] = useState<MessagesByChatId>({});
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newMessage: StateMessage = { id: Date.now(), text, sender: "user" };
    setMessagesByChatId(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage],
    }));

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const botMessage: StateMessage = { id: Date.now() + 1, text: data.reply, sender: "ai" };
      setMessagesByChatId(prev => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), botMessage],
      }));
    } catch {
      const errorMessage: StateMessage = { id: Date.now() + 1, text: "Backend not reachable", sender: "ai" };
      setMessagesByChatId(prev => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), errorMessage],
      }));
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => setMessagesByChatId(prev => ({ ...prev, [activeChatId]: [] }));

  return { chatHistory, activeChatId, setActiveChatId, messagesByChatId, sendMessage, clearChat, loading, setChatHistory };
}
