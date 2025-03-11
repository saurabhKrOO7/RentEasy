import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import {
  useSaveChatMessageMutation,
  useGetSellerChatsQuery,
} from "../../redux/api/chatApiSlice";

const SellerChat = () => {
  const { buyerId, productId } = useParams();
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const { data: messages = [], refetch } = useGetSellerChatsQuery({
    buyerId,
    productId,
  });

  const [sendChatMessage] = useSaveChatMessageMutation();

  useEffect(() => {
    // Connect to the socket server
    const newSocket = io("https://renteasy-backend.onrender.com"); // Adjust for production
    setSocket(newSocket);

    newSocket.emit("joinRoom", { buyerId });

    // Listen for incoming messages
    newSocket.on("message", (newMessage) => {
      setChatMessages((prev) => [...prev, newMessage]);
      refetch();
    });

    return () => {
      newSocket.disconnect();
    };
  }, [buyerId, refetch]);

  useEffect(() => {
    // Load messages from API when component mounts
    if (messages.length > 0) {
      setChatMessages(messages);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      buyerId,
      sender: "seller",
      message,
    };

    await sendChatMessage(newMessage);
    socket.emit("sendMessage", newMessage);

    // Add message to chat immediately for better UX
    setChatMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <Box sx={{ width: "90%", mx: "auto", mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Chat with Buyer
      </Typography>
      <Paper sx={{ height: "400px", overflowY: "auto", p: 2, borderRadius: 2 }}>
        {chatMessages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              textAlign: msg.sender === "seller" ? "right" : "left",
              mb: 1,
            }}
          >
            <Typography
              sx={{
                display: "inline-block",
                p: 1.5,
                borderRadius: 2,
                bgcolor: msg.sender === "seller" ? "#007bff" : "#f0f0f0",
                color: msg.sender === "seller" ? "#fff" : "#000",
                maxWidth: "70%",
                wordBreak: "break-word",
              }}
            >
              {msg.message}
            </Typography>
          </Box>
        ))}
      </Paper>
      <Box sx={{ display: "flex", mt: 2 }}>
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <Button variant="contained" color="primary" onClick={sendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default SellerChat;
