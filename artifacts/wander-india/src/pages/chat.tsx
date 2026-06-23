import React, { useState, useRef, useEffect, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import "./chat.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const INITIAL_MESSAGE: Message = {
  id: 'init',
  role: 'assistant',
  content: "Hey there! I'm Tourist AI, your dedicated travel and tourism assistant. Ask me anything about destinations, travel tips, sightseeing, or local attractions!",
  timestamp: new Date(),
  suggestions: ["Best places to visit in India", "Goa travel guide", "Budget travel tips", "India travel safety"],
};

// Local Backend Fallback Function
async function callBackendChatFallback(conversationHistory: { role: string; content: string }[]): Promise<{ message: string; suggestions?: string[] }> {
  const lastMsg = conversationHistory[conversationHistory.length - 1]?.content || "";
  const token = localStorage.getItem("wander_token");
  
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch("/api/chat", {
    method: "POST",
    headers,
    body: JSON.stringify({
      message: lastMsg,
      conversationHistory
    })
  });

  if (!res.ok) {
    throw new Error("Chat server is temporarily unavailable. Please try again later.");
  }

  return res.json();
}

// Generate context-appropriate suggestions if Gemini API is used directly
function generateSuggestionsForText(text: string): string[] {
  const lower = text.toLowerCase();
  if (lower.includes("goa")) return ["Best beaches in Goa", "Goa nightlife guide", "Goa budget travel tips"];
  if (lower.includes("jaipur") || lower.includes("udaipur") || lower.includes("rajasthan")) return ["Rajasthan royal palaces", "Desert camp in Jaisalmer", "Jaipur travel itinerary"];
  if (lower.includes("kerala")) return ["Kerala houseboat booking", "Munnar tea gardens", "Best Kerala food"];
  if (lower.includes("ladakh") || lower.includes("himachal") || lower.includes("manali")) return ["Ladakh road trip guide", "Manali adventure activities", "Spiti Valley trek"];
  if (lower.includes("budget") || lower.includes("cheap")) return ["Budget travel India tips", "Cheapest destinations in India", "Train travel in India"];
  if (lower.includes("food") || lower.includes("eat")) return ["Best street food in India", "Indian regional cuisines", "Food tours in India"];
  if (lower.includes("safe") || lower.includes("safety")) return ["India travel safety tips", "Solo female travel India", "Emergency contacts India"];
  if (lower.includes("visa")) return ["India e-Visa application", "India visa requirements", "India entry requirements"];
  return ["Top destinations in India", "Best time to visit India", "India travel on a budget", "Cultural experiences in India"];
}

// Direct Client-Side Gemini Call with Automated Fallback
async function sendChatMessage(conversationHistory: { role: string; content: string }[]): Promise<{ message: string; suggestions?: string[] }> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return callBackendChatFallback(conversationHistory);
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  // Convert conversation history to Gemini format
  const contents = conversationHistory.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const body = {
    contents,
    systemInstruction: {
      parts: [
        {
          text: "You are Tourist AI, a specialized assistant for tourism, travel, sightseeing, destinations, itineraries, and travel-related questions. You must and should ONLY provide tourist and travel-related information. If a user asks about any other topic (such as coding, math, general science, politics, or general non-travel advice), you must politely decline to answer and remind them that you are Tourist AI, designed exclusively for tourism and travel assistance."
        }
      ]
    },
    generationConfig: {
      temperature: 0.9,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.warn("Direct Gemini API error. Falling back to local Express AI Chatbot...", response.status);
      return callBackendChatFallback(conversationHistory);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return callBackendChatFallback(conversationHistory);
    }

    const suggestions = generateSuggestionsForText(text);
    return { message: text, suggestions };
  } catch (err) {
    console.warn("Failed to reach Gemini API. Falling back to local Express AI Chatbot...", err);
    return callBackendChatFallback(conversationHistory);
  }
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatContent />
    </ProtectedRoute>
  );
}

function ChatContent() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleClear = () => {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
    inputRef.current?.focus();
  };

  const handleSend = async (customText?: string) => {
    const trimmed = customText ? customText.trim() : input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (!customText) {
      setInput("");
    }
    setIsLoading(true);
    setError(null);

    try {
      // Build history excluding the initial greeting for the API call
      const history = updatedMessages
          .filter((m) => m.id !== 'init')
          .map((m) => ({ role: m.role, content: m.content }));

      const response = await sendChatMessage(history);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
        suggestions: response.suggestions,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 pt-28 pb-12 flex items-center justify-center">
        <div className="chat-container">
          {/* Header */}
          <div className="chat-header">
            <div className="header-left">
              <div className="avatar">
                <svg viewBox="0 0 24 24" fill="none" className="avatar-icon">
                  <rect x="2" y="7" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 7V5a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="9" cy="14" r="1.5" fill="currentColor" />
                  <circle cx="15" cy="14" r="1.5" fill="currentColor" />
                  <path d="M9 17.5s1 1.5 3 1.5 3-1.5 3-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="header-info">
                <h1 className="header-title">Tourist AI</h1>
                <div className="status-row">
                  <span className="status-dot" />
                  <span className="status-text">Online</span>
                </div>
              </div>
            </div>
            <button className="clear-btn" onClick={handleClear} title="Clear chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg) => (
              <MessageBubble 
                key={msg.id} 
                message={msg} 
                time={formatTime(msg.timestamp)} 
                onSuggestionClick={handleSend}
              />
            ))}
            {isLoading && <TypingIndicator />}
            {error && (
              <div className="error-banner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-footer">
            <div className="input-row">
              <textarea
                ref={inputRef}
                className="message-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message... (Enter to send)"
                rows={1}
                disabled={isLoading}
              />
              <button
                className={`send-btn ${isLoading ? "loading" : ""} ${input.trim() ? "active" : ""}`}
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                title="Send message"
              >
                {isLoading ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin-icon">
                    <circle cx="12" cy="12" r="10" strokeDasharray="31.4" strokeDashoffset="10" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                )}
              </button>
            </div>
            <p className="footer-hint">Powered by Google Gemini · Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  time: string;
  onSuggestionClick?: (text: string) => void;
}

function MessageBubble({ message, time, onSuggestionClick }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`bubble-wrapper ${isUser ? "user" : "ai"}`}>
      {!isUser && (
        <div className="bubble-avatar">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="2" y="7" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 7V5a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="9" cy="14" r="1.5" fill="currentColor" />
            <circle cx="15" cy="14" r="1.5" fill="currentColor" />
            <path d="M9 17.5s1 1.5 3 1.5 3-1.5 3-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      )}

      <div className="bubble-content">
        <div className={`bubble ${isUser ? "bubble-user" : "bubble-ai"}`}>
          <MessageText content={message.content} />
        </div>
        
        {!isUser && message.suggestions && message.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 max-w-md">
            {message.suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestionClick?.(s)}
                className="text-xs px-3 py-1.5 bg-white/5 hover:bg-amber-500/25 rounded-xl text-white/75 hover:text-amber-400 transition-all border border-white/5 hover:border-amber-500/35 cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <span className="bubble-time">{time}</span>
      </div>
    </div>
  );
}

function MessageText({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="message-text">
      {lines.map((line, i) => {
        if (line.startsWith("```")) {
          return null; 
        }
        
        const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
        const formatted = parts.map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={j}>{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith("`") && part.endsWith("`")) {
            return <code key={j} className="inline-code">{part.slice(1, -1)}</code>;
          }
          return part;
        });

        return (
          <React.Fragment key={i}>
            {formatted}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="typing-wrapper">
      <div className="typing-avatar">
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="2" y="7" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 7V5a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="9" cy="14" r="1.5" fill="currentColor" />
          <circle cx="15" cy="14" r="1.5" fill="currentColor" />
        </svg>
      </div>
      <div className="typing-bubble">
        <span className="dot" style={{ animationDelay: "0ms" }} />
        <span className="dot" style={{ animationDelay: "180ms" }} />
        <span className="dot" style={{ animationDelay: "360ms" }} />
      </div>
    </div>
  );
}
