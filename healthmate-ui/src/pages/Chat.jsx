import React, { useState, useEffect, useRef } from "react";
import { TextField, Button } from "@mui/material";
import "./Chat.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { report, sessionId, user } = location.state;
  const [messages, setMessages] = useState([
    { role: "assistant", content: report.reply },
  ]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMsg = { role: "user", content: input };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);

    try {
      const res = await axios.post("http://localhost:8000/api/intake", {
        session_id: sessionId,
        message: input,
      });

      if (res.data.status === "diagnosis-in-progress") {
        navigate("/diagnosis", { state: { sessionId, user } });
        return;
      }

      const reply = { role: "assistant", content: res.data.reply };
      setMessages((prev) => [...prev, reply]);
      setInput("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-paper">
        <div className="chat-title">Agent Chat</div>
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message-row ${msg.role}`}
            >
              <div className="chat-bubble">
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input-section">
          <TextField
            fullWidth
            label="Your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="chat-input"
            variant="outlined"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          <button
            className="chat-send-btn"
            onClick={handleSend}
            type="button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
