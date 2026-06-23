import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ChatWindow.css';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { sendMessage } from '../services/gemini';

const INITIAL_MESSAGE = {
  id: 'init',
  role: 'assistant',
  content: "Hey there! I'm Tourist AI, your dedicated travel and tourism assistant. Ask me anything about destinations, travel tips, sightseeing, or local attractions!",
  timestamp: new Date(),
};

export default function ChatWindow() {
  const [messages, setMessages]   = useState([INITIAL_MESSAGE]);
  const [input, setInput]         = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const chatBodyRef    = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isLoading, scrollToBottom]);

  // Focus input on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleClear = () => {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
    inputRef.current?.focus();
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Build history excluding the initial greeting for the API call
      const history = updatedMessages
        .filter((m) => m.id !== 'init')
        .map((m) => ({ role: m.role, content: m.content }));

      const responseText = await sendMessage(history);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <div className="avatar">
            <svg viewBox="0 0 24 24" fill="none" className="avatar-icon">
              <rect x="2" y="7" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 7V5a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="9" cy="14" r="1.5" fill="currentColor"/>
              <circle cx="15" cy="14" r="1.5" fill="currentColor"/>
              <path d="M9 17.5s1 1.5 3 1.5 3-1.5 3-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
          <MessageBubble key={msg.id} message={msg} time={formatTime(msg.timestamp)} />
        ))}
        {isLoading && <TypingIndicator />}
        {error && (
          <div className="error-banner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
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
            className={`send-btn ${isLoading ? 'loading' : ''} ${input.trim() ? 'active' : ''}`}
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            title="Send message"
          >
            {isLoading ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin-icon">
                <circle cx="12" cy="12" r="10" strokeDasharray="31.4" strokeDashoffset="10"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            )}
          </button>
        </div>
        <p className="footer-hint">Powered by Google Gemini · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
