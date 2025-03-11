import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
  Divider,
  Button,
  TextField,
  Avatar,
} from "@mui/material";
import { io } from "socket.io-client";
import {
  useGetUnseenMessagesQuery,
  useSaveChatMessageFromSellerMutation,
  useGetSellerChatsQuery,
  useUpdateSeenStatusForSellerMutation,
} from "../../redux/api/chatApiSlice";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const SellerMessages = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userId = userInfo?._id || null;

  const {
    data: chats = [],
    isLoading,
    isError,
    refetch: refetchUnseen,
  } = useGetUnseenMessagesQuery();
  const [selectedChat, setSelectedChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const [sendChatMessage] = useSaveChatMessageFromSellerMutation();
  const [markAsSeen] = useUpdateSeenStatusForSellerMutation();

  // Compute sorted chats with unread messages on top.
  const sortedChats = chats.slice().sort((a, b) => {
    const unreadCountA = a.messages
      ? a.messages.filter(
          (msg) => msg.sender._id !== userId && !msg.seenBy?.includes(userId)
        ).length
      : 0;
    const unreadCountB = b.messages
      ? b.messages.filter(
          (msg) => msg.sender._id !== userId && !msg.seenBy?.includes(userId)
        ).length
      : 0;
    return unreadCountB - unreadCountA;
  });

  // Fetch chat messages when a chat is selected
  const { data: messages = [], refetch } = useGetSellerChatsQuery(
    selectedChat
      ? {
          buyerId: selectedChat.buyerId._id,
          productId: selectedChat.productId._id,
        }
      : {},
    { skip: !selectedChat }
  );

  useEffect(() => {
    // Connect to Socket.io server
    const newSocket = io("http://localhost:5000"); // Adjust in production
    setSocket(newSocket);

    if (selectedChat) {
      newSocket.emit("joinRoom", { buyerId: selectedChat.buyerId._id });
      (async () => {
        await markAsSeen({ productId: selectedChat.productId._id });
        refetchUnseen(); // Ensure unseen messages get updated after marking as seen
      })();
    }

    newSocket.on("message", (newMessage) => {
      setChatMessages((prev) => [...prev, newMessage]);
      refetch();
    });

    return () => {
      newSocket.disconnect();
    };
  }, [selectedChat, refetch, markAsSeen, refetchUnseen, userId]);

  useEffect(() => {
    // Load messages from API when component mounts
    if (messages.length > 0) {
      setChatMessages(messages);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      buyerId: selectedChat.buyerId._id,
      productId: selectedChat.productId._id,
      sender: {
        _id: userId,
        name: "Seller",
      },
      message,
      timestamp: new Date().toISOString(),
      seenBy: [userId],
    };

    await sendChatMessage(newMessage);
    socket.emit("sendMessage", newMessage);
    setChatMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  if (isLoading) return <Typography>Loading messages...</Typography>;
  if (isError) return <Typography>Error loading messages</Typography>;

  return (
    <Box sx={{ p: 2, mt: 10 }}>
      <Typography variant="h5" gutterBottom>
        Seller Messages
      </Typography>
      <Grid container spacing={2}>
        {/* Chat List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ maxHeight: "80vh", overflowY: "auto" }}>
            <List>
              {sortedChats.length === 0 && (
                <Typography sx={{ p: 2 }}>No chats available</Typography>
              )}
              {sortedChats.map((chat) => {
                const unreadCount = chat.messages
                  ? chat.messages.filter(
                      (msg) =>
                        msg.sender._id !== userId &&
                        !msg.seenBy?.includes(userId)
                    ).length
                  : 0;
                const lastMsg =
                  chat.messages && chat.messages.length > 0
                    ? chat.messages[chat.messages.length - 1]
                    : null;
                return (
                  <ListItem
                    button
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    selected={selectedChat?._id === chat._id}
                    sx={{
                      backgroundColor: unreadCount > 0 ? "#f5f5f5" : "inherit",
                      borderRadius: 1,
                      my: 0.5,
                      p: 1,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          chat.buyerId.name
                        )}`}
                        alt={chat.buyerId.name}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: unreadCount > 0 ? "bold" : "normal",
                            }}
                          >
                            {chat.buyerId.name || "Unknown Buyer"}
                          </Typography>
                          {lastMsg && (
                            <Typography variant="caption" color="textSecondary">
                              {dayjs(lastMsg.timestamp).format("h:mm A")}
                            </Typography>
                          )}
                        </Box>
                      }
                      secondary={
                        <Box display="flex" flexDirection="column">
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: unreadCount > 0 ? "bold" : "normal",
                            }}
                          >
                            {chat.buyerId.email || ""}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {chat.productId?.name || "Unknown Product"}
                          </Typography>
                        </Box>
                      }
                    />
                    {unreadCount > 0 && (
                      <Box
                        sx={{
                          bgcolor: "#1976d2",
                          borderRadius: "50%",
                          width: 20,
                          height: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="caption" color="#fff">
                          {unreadCount}
                        </Typography>
                      </Box>
                    )}
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>

        {/* Chat UI */}
        <Grid item xs={12} md={8}>
          {" "}
          {selectedChat ? (
            <Paper sx={{ p: 2, maxHeight: "80vh", overflowY: "auto" }}>
              {" "}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                {" "}
                <Typography variant="h6">
                  {" "}
                  Chat with {selectedChat.buyerId.name || "Unknown Buyer"}{" "}
                </Typography>{" "}
                <Button
                  variant="outlined"
                  onClick={() => setSelectedChat(null)}
                >
                  {" "}
                  Back{" "}
                </Button>{" "}
              </Box>{" "}
              <Divider sx={{ my: 1 }} /> {/* Message List */}{" "}
              <Paper
                sx={{
                  height: "400px",
                  overflowY: "auto",
                  p: 1,
                  borderRadius: 2,
                }}
              >
                {" "}
                <List>
                  {" "}
                  {chatMessages.map((msg, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent:
                          msg.sender._id === userId ? "flex-end" : "flex-start",
                        alignItems: "flex-start",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      {" "}
                      {msg.sender._id !== userId && (
                        <Avatar
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            msg.sender.name
                          )}&background=random`}
                          alt={msg.sender.name}
                          sx={{ width: 35, height: 35 }}
                        />
                      )}{" "}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems:
                            msg.sender._id === userId
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        {" "}
                        <Box
                          sx={{
                            display: "inline-block",
                            p: 1,
                            borderRadius: 2,
                            bgcolor:
                              msg.sender._id === userId ? "#4caf50" : "#2196f3",
                            color: "#fff",
                            // minWidth: "50%",
                            // maxWidth: "100%",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {" "}
                          <Typography sx={{ fontSize: "1.1rem" }}>
                            {" "}
                            {msg.message}{" "}
                          </Typography>{" "}
                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              textAlign: "right",
                              mt: 0.5,
                              color: msg.seenBy?.includes(userId)
                                ? "purple"
                                : "yellow",
                            }}
                          >
                            {" "}
                            {(msg.seenBy?.length ?? 0) > 1
                              ? "Seen"
                              : "Sent"} -{" "}
                            {dayjs(msg.timestamp).format("h:mm A")}{" "}
                          </Typography>{" "}
                        </Box>{" "}
                      </Box>{" "}
                      {msg.sender._id === userId && (
                        <Avatar
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            msg.sender.name
                          )}&background=random`}
                          alt={msg.sender.name}
                          sx={{ width: 35, height: 35 }}
                        />
                      )}{" "}
                    </ListItem>
                  ))}{" "}
                </List>{" "}
              </Paper>{" "}
              {/* Message Input */}{" "}
              <Box sx={{ display: "flex", mt: 2 }}>
                {" "}
                <TextField
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                />{" "}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={sendMessage}
                >
                  {" "}
                  Send{" "}
                </Button>{" "}
              </Box>{" "}
            </Paper>
          ) : (
            <Paper sx={{ p: 2, textAlign: "center", height: "80vh" }}>
              {" "}
              <Typography variant="body1">
                {" "}
                Select a chat conversation to view messages.{" "}
              </Typography>{" "}
            </Paper>
          )}{" "}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SellerMessages;
