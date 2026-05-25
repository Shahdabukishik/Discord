import { useEffect, useRef } from "react";

import MessageBubble from "./MessageBubble";

function ChatBox({ messages, loading, error, currentUsername, typingUser }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  if (loading) {
    return (
      <div className="chat-state">
        <div className="loader" />
        <p>Loading conversation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-state error-state">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="messages-panel">
      {messages.length === 0 ? (
        <div className="empty-state">
          <span>#</span>
          <h2>No messages yet</h2>
          <p>Start the conversation and make this channel feel alive.</p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble
            isOwn={message.username === currentUsername}
            key={message._id || `${message.createdAt}-${message.username}-${message.text}`}
            message={message}
          />
        ))
      )}

      {typingUser && <p className="typing-indicator">{typingUser} is typing...</p>}
      <div ref={bottomRef} />
    </section>
  );
}

export default ChatBox;
