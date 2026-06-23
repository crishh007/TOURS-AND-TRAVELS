import React from 'react';
import './MessageBubble.css';

export default function MessageBubble({ message, time }) {
  const isUser = message.role === 'user';

  return (
    <div className={`bubble-wrapper ${isUser ? 'user' : 'ai'}`}>
      {!isUser && (
        <div className="bubble-avatar">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="2" y="7" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 7V5a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="9" cy="14" r="1.5" fill="currentColor"/>
            <circle cx="15" cy="14" r="1.5" fill="currentColor"/>
            <path d="M9 17.5s1 1.5 3 1.5 3-1.5 3-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      )}

      <div className="bubble-content">
        <div className={`bubble ${isUser ? 'bubble-user' : 'bubble-ai'}`}>
          <MessageText content={message.content} />
        </div>
        <span className="bubble-time">{time}</span>
      </div>
    </div>
  );
}

// Renders markdown-like formatting without an extra library
function MessageText({ content }) {
  // Simple markdown parsing for bold, code blocks, inline code
  const lines = content.split('\n');

  return (
    <div className="message-text">
      {lines.map((line, i) => {
        // Code block start/end handled simply
        if (line.startsWith('```')) {
          return null; // handled below
        }
        // Bold: **text**
        const formatted = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j}>{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('`') && part.endsWith('`')) {
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
