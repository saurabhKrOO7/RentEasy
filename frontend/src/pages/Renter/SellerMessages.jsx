import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { useGetUnseenMessagesQuery } from "../../redux/api/chatApiSlice";
import dayjs from "dayjs";

const SellerMessages = () => {
  // Fetch chats (each chat document contains buyer info, product info, and messages array)
  const { data: chats = [], isLoading, isError } = useGetUnseenMessagesQuery();
  const [selectedChat, setSelectedChat] = useState(null);

  if (isLoading) return <Typography>Loading messages...</Typography>;
  if (isError) return <Typography>Error loading messages</Typography>;

  return (
    <Box sx={{ p: 2, mt: 10 }}>
      <Typography variant="h5" gutterBottom>
        Seller Messages
      </Typography>
      <Grid container spacing={2}>
        {/* Chat Conversations List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ maxHeight: "80vh", overflowY: "auto" }}>
            <List>
              {chats.length === 0 && (
                <Typography sx={{ p: 2 }}>No chats available</Typography>
              )}
              {chats.map((chat) => (
                <ListItem
                  button
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  selected={selectedChat?._id === chat._id}
                >
                  <ListItemText
                    primary={chat.buyerId.name || "Unknown Buyer"}
                    secondary={chat.productId?.name || "Unknown Product"}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Conversation Detail */}
        <Grid item xs={12} md={8}>
          {selectedChat ? (
            <Paper sx={{ p: 2, maxHeight: "80vh", overflowY: "auto" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  Conversation with {selectedChat.name || "Unknown Buyer"}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedChat(null)}
                >
                  Back
                </Button>
              </Box>
              <Divider sx={{ my: 1 }} />
              {selectedChat.messages && selectedChat.messages.length > 0 ? (
                selectedChat.messages.map((msg) => (
                  <Box key={msg._id} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">
                      {msg.sender?.name || "Unknown"}{" "}
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        component="span"
                      >
                        ({dayjs(msg.timestamp).format("h:mm A")})
                      </Typography>
                    </Typography>
                    <Typography variant="body1">{msg.message}</Typography>
                  </Box>
                ))
              ) : (
                <Typography>No messages in this conversation.</Typography>
              )}
            </Paper>
          ) : (
            <Paper sx={{ p: 2, textAlign: "center", height: "80vh" }}>
              <Typography variant="body1">
                Select a chat conversation to view messages.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SellerMessages;
