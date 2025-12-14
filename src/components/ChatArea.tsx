import { cn } from "@/lib/utils";

export interface ChatAreaMessage {
  id: number;
  content: string;
  role: "user" | "assistant";
}

interface Props {
  messages: ChatAreaMessage[];
}

export default function ChatArea({ messages }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((msg) => (
        <div key={msg.id} className={cn("flex w-full", msg.role === "user" ? "justify-end" : "justify-start")}>
          <div className={cn(
            "max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm",
            msg.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"
          )}>
            {msg.content}
          </div>
        </div>
      ))}
    </div>
  );
}
