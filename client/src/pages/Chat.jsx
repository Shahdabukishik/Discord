import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ChatBox from "../components/ChatBox";
import MessageInput from "../components/MessageInput";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";
import API from "../services/api";
import socket from "../socket";

function Chat() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeChannel, setActiveChannel] = useState("general");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(socket.connected);
  const [typingUser, setTypingUser] = useState("");
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    socket.auth = { token: localStorage.getItem("token") };

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleConnectError = () => {
      setConnected(false);
      setError("Realtime connection failed. Please log in again.");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, []);

  useEffect(() => {
    const handleMessage = (message) => {
      if (message.channel === activeChannel) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleTyping = ({ channel, username }) => {
      if (channel !== activeChannel || username === user?.username) return;

      setTypingUser(username);
      window.clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = window.setTimeout(() => setTypingUser(""), 1400);
    };

    socket.on("receive_message", handleMessage);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("receive_message", handleMessage);
      socket.off("typing", handleTyping);
    };
  }, [activeChannel, user?.username]);

  useEffect(() => {
    const loadChannel = async () => {
      setLoading(true);
      setError("");
      setTypingUser("");

      socket.emit("join_channel", activeChannel);

      try {
        const res = await API.get(`/messages/${activeChannel}`);
        setMessages(res.data.messages);
      } catch (error) {
        setError(error.response?.data?.message || "Could not load messages.");
      } finally {
        setLoading(false);
      }
    };

    loadChannel();
  }, [activeChannel]);

  const handleSend = useCallback(
    (text) => {
      socket.emit("send_message", {
        channel: activeChannel,
        text,
      });
    },
    [activeChannel]
  );

  const handleTyping = useCallback(() => {
    socket.emit("typing", { channel: activeChannel });
  }, [activeChannel]);

  const handleLogout = () => {
    socket.disconnect();
    logout();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <Sidebar activeChannel={activeChannel} onSelectChannel={setActiveChannel} />

      <main className="chat-layout">
        <Navbar
          channel={activeChannel}
          connected={connected}
          onLogout={handleLogout}
          user={user}
        />
        <ChatBox
          currentUsername={user.username}
          error={error}
          loading={loading}
          messages={messages}
          typingUser={typingUser}
        />
        <MessageInput
          channel={activeChannel}
          disabled={loading || !connected}
          onSend={handleSend}
          onTyping={handleTyping}
        />
      </main>
    </div>
  );
}

export default Chat;
