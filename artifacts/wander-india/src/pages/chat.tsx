import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSendChatMessage } from "@workspace/api-client-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2, MessageSquare } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "Namaste! I'm your WanderIndia AI travel guide. I know everything about traveling in India — destinations, food, culture, budget, safety, visas, and more. Where would you like to explore?",
  suggestions: ["Best places to visit in India", "Goa travel guide", "Budget travel tips", "India travel safety"],
};

export default function ChatPage() {
  return <ProtectedRoute><ChatContent /></ProtectedRoute>;
}

function ChatContent() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const sendMessage = useSendChatMessage();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = text || input.trim();
    if (!content) return;
    setInput("");

    const userMsg: Message = { role: "user", content };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await sendMessage.mutateAsync({
        data: {
          message: content,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
        },
      });
      setMessages(prev => [...prev, { role: "assistant", content: res.message, suggestions: res.suggestions }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble responding. Please try again!" }]);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 pt-28 pb-32 flex flex-col">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center glow-cyan">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold">WanderIndia AI Guide</div>
            <div className="text-muted-foreground text-xs flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Online · Expert on all of India
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === "assistant"
                    ? "bg-gradient-to-br from-cyan-400 to-blue-500"
                    : "bg-gradient-to-br from-amber-400 to-orange-500"
                }`}>
                  {msg.role === "assistant" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-black" />}
                </div>
                <div className={`max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-2`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "assistant"
                      ? "glass-card text-white rounded-tl-sm"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-tr-sm"
                  }`}>
                    {msg.content}
                  </div>
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {msg.suggestions.map(s => (
                        <button
                          key={s}
                          onClick={() => handleSend(s)}
                          className="text-xs px-3 py-1.5 bg-white/5 hover:bg-amber-500/20 rounded-xl text-white/70 hover:text-amber-400 transition-all border border-white/5 hover:border-amber-500/30"
                          data-testid={`suggestion-btn`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {sendMessage.isPending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3">
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input — fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-white/5">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask about any destination in India..."
            className="flex-1 h-12 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground rounded-xl"
            data-testid="input-message"
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || sendMessage.isPending}
            className="h-12 w-12 bg-gradient-to-r from-amber-500 to-orange-500 text-black border-0 rounded-xl flex-shrink-0 glow-amber"
            data-testid="btn-send"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
