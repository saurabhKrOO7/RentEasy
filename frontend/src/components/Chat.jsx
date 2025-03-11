import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Paper,
  Avatar,
  IconButton,
  Fade,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import {
  useGetChatMessagesQuery,
  useSaveChatMessageMutation,
  useUpdateSeenStatusMutation,
} from "../redux/api/chatApiSlice";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const socket = io("https://renteasy-backend.onrender.com", {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

const Chat = () => {
  const { _id: productId } = useParams();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userId = userInfo?._id || null;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [saveChatMessage] = useSaveChatMessageMutation();
  const [markAsSeen] = useUpdateSeenStatusMutation();
  const { data, refetch } = useGetChatMessagesQuery(productId, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setMessages(data);
      socket.emit("messageSeen", { room: productId, userId });
      try {
        markAsSeen({ productId, userId });
      } catch (error) {
        console.error("Error updating seen status", error);
      }
    }
  }, [data, productId, userId, markAsSeen]);

  useEffect(() => {
    socket.emit("joinRoom", productId);
    socket.on("messageUpdated", () => {
      refetch();
    });
    return () => {
      socket.off("messageUpdated");
    };
  }, [productId, refetch]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const msgData = {
      productId,
      message,
      sender: {
        _id: userId,
        name: "buyer",
      },
      timestamp: new Date().toISOString(),
      seenBy: [userId],
    };

    try {
      socket.emit("sendMessage", msgData);
      setMessages((prevMessages) => [...prevMessages, msgData]);
      await saveChatMessage(msgData);
      refetch();
      setMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };
  if (!userId) return <></>;

  return (
    <>
      <IconButton
        onClick={() => setChatOpen(true)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          bgcolor: "#007bff",
          color: "white",
          width: 50,
          height: 50,
          zIndex: 2000,
          "&:hover": { bgcolor: "#0056b3" },
        }}
      >
        <ChatIcon fontSize="large" />
      </IconButton>
      <Fade in={chatOpen}>
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            right: 10,
            width: "100%",
            maxWidth: 400,
            height: "70vh",
            bgcolor: "white",
            boxShadow: 3,
            borderRadius: "10px 10px 0 0",
            display: "flex",
            flexDirection: "column",
            zIndex: 3000,
            "@media (max-width: 600px)": {
              maxWidth: "100%",
              right: 0,
              height: "80vh",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              bgcolor: "#007bff",
              color: "white",
            }}
          >
            <Typography variant="h6">Chat</Typography>
            <IconButton
              onClick={() => setChatOpen(false)}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <List sx={{ flexGrow: 1, overflowY: "auto", p: 1 }}>
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender._id === userId ? "flex-end" : "flex-start",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {msg.sender._id !== userId && (
                  <Avatar
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      msg.sender.name
                    )}&background=random`}
                    alt={msg.sender.name}
                    sx={{ width: 35, height: 35 }}
                  />
                )}
                <Box
                  sx={{
                    bgcolor: msg.sender._id === userId ? "#4caf50" : "#2196f3",
                    color: "#fff",
                    borderRadius: "10px",
                    p: 1,
                    maxWidth: "75%",
                  }}
                >
                  <Typography sx={{ fontSize: "0.95rem" }}>
                    {msg.message}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      textAlign: "right",
                      mt: 0.5,
                      color: msg.seenBy.includes(userId) ? "green" : "gray",
                    }}
                  >
                    {msg.seenBy.length > 1 ? "Seen" : "Sent"} -{" "}
                    {dayjs(msg.timestamp).format("h:mm A")}
                  </Typography>
                </Box>
                {msg.sender._id === userId && (
                  <Avatar
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      msg.sender.name
                    )}&background=random`}
                    alt={msg.sender.name}
                    sx={{ width: 35, height: 35 }}
                  />
                )}
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
          <Box sx={{ display: "flex", gap: 1, p: 2 }}>
            <TextField
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Box>
        </Box>
      </Fade>
    </>
  );
};
export default Chat;
