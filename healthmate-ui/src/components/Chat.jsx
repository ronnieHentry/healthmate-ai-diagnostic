import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Chat = () => {
  const location = useLocation();
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

      const reply = { role: "assistant", content: res.data.reply };
      setMessages((prev) => [...prev, reply]);
      setInput("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
        <Typography variant="h6">Agent Chat</Typography>
        <Box sx={{ maxHeight: 400, overflowY: "auto", my: 2 }}>
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{ mb: 1, textAlign: msg.role === "user" ? "right" : "left" }}
            >
              <Typography
                variant="body2"
                sx={{
                  p: 1,
                  bgcolor: msg.role === "user" ? "primary.light" : "grey.200",
                  display: "inline-block",
                  borderRadius: 2,
                }}
              >
                {msg.content}
              </Typography>
            </Box>
          ))}
          <div ref={messagesEndRef}/>
        </Box>
        <TextField
          fullWidth
          label="Your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Box mt={2}>
          <Button variant="contained" fullWidth onClick={handleSend}>
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Chat;
