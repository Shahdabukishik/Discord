import { useState } from "react";

function MessageInput({ disabled, onSend, onTyping, channel }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = message.trim();

    if (!text || disabled) return;

    onSend(text);
    setMessage("");
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <input
        aria-label={`Message #${channel}`}
        disabled={disabled}
        onChange={(event) => {
          setMessage(event.target.value);
          onTyping?.();
        }}
        placeholder={`Message #${channel}`}
        type="text"
        value={message}
      />
      <button disabled={disabled || !message.trim()} type="submit">
        Send
      </button>
    </form>
  );
}

export default MessageInput;
