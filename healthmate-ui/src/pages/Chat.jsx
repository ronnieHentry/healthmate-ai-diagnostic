import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
} from "@mui/material";
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
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Agent Chat
        </Typography>

        <Box sx={{ maxHeight: 400, overflowY: "auto", my: 2, p: 2 }}>
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                mb: 2,
                textAlign: msg.role === "user" ? "right" : "left",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  p: 2,
                  bgcolor: msg.role === "user" ? "primary.main" : "grey.300",
                  color: msg.role === "user" ? "white" : "text.primary",
                  display: "inline-block",
                  borderRadius: 2,
                  maxWidth: "80%",
                  wordBreak: "break-word",
                }}
              >
                {msg.content}
              </Typography>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <TextField
          fullWidth
          label="Your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{ mb: 2 }}
          variant="outlined"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSend}
          sx={{
            padding: "10px",
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          Send
        </Button>
      </Paper>
    </Container>
  );
};

export default Chat;
