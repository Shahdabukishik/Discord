function formatTime(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function MessageBubble({ message, isOwn }) {
  return (
    <article className={`message ${isOwn ? "own" : ""}`}>
      <div className="avatar">{message.username?.charAt(0).toUpperCase()}</div>

      <div className="message-content">
        <div className="message-meta">
          <strong>{message.username}</strong>
          <time>{formatTime(message.createdAt)}</time>
        </div>
        <p>{message.text}</p>
      </div>
    </article>
  );
}

export default MessageBubble;
