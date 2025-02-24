import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  ListItemButton,
} from "@mui/material";
import { green, red } from "@mui/material/colors";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Notifications from "../../components/Notifications";
import "./Dashboard.css";
import { toast } from "react-toastify";
import ViewOrders from "./ViewOrders";

import { useGetSellerEarningsQuery } from "../../redux/api/sellerApiSlice";
import { useShowAllOrdersOfSellerQuery } from "../../redux/api/sellerApiSlice";
import {
  useApproveOrderMutation,
  useRejectOrderMutation,
  useGetSellerEarningsByMonthQuery,
} from "../../redux/api/sellerApiSlice";
import { Link, useNavigate } from "react-router";
import RecentOrders from "./RecentOrders";
import { useGetSellerChatsQuery } from "../../redux/api/chatApiSlice";
import { io } from "socket.io-client";
import { useGetUnseenMessagesQuery } from "../../redux/api/chatApiSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [chatNotifications, setChatNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const { data: chatData } = useGetSellerChatsQuery();
  const { data: unseenMessages = [] } = useGetUnseenMessagesQuery();
  console.log(unseenMessages);
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket server:", newSocket.id);
    });

    newSocket.on("newMessage", ({ buyerId, buyerName, message, productId }) => {
      console.log("New Message Received:", {
        buyerId,
        buyerName,
        message,
        productId,
      });
      setChatNotifications((prev) => {
        const isExisting = prev.some((notif) => notif.buyerId === buyerId);
        return isExisting
          ? prev.map((notif) =>
              notif.buyerId === buyerId ? { ...notif, message } : notif
            )
          : [...prev, { buyerId, buyerName, message, productId }];
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (Array.isArray(unseenMessages) && unseenMessages.length > 0) {
      setChatNotifications(
        unseenMessages.map((chat) => ({
          buyerId: chat.buyerId,
          buyerName: chat.name, // Seller name from the unseen message
          message:
            Array.isArray(chat.messages) && chat.messages.length > 0
              ? chat.messages[chat.messages.length - 1].message
              : "New message",
          productId: chat.productId?._id || "", // Ensure productId exists
        }))
      );
    }
  }, [unseenMessages]);

  // const handleNotificationsClick = useCallback(() => {
  //   setNotificationsOpen(true);
  // }, []);

  const handleNotificationsClick = () => {
    navigate("/renter/messages");
  };

  const handleOpenChat = (buyerId, productId) => {
    navigate(`/seller-chats/${buyerId}/${productId}`);
  };

  // const [notifications, setNotifications] = useState([
  //   {
  //     id: 1,
  //     message: "New order received! New order received! New order received!",
  //     read: false,
  //   },
  //   { id: 2, message: "Product listing approved.", read: true },
  //   { id: 3, message: "Payment received for Order #123.", read: false },
  // ]);

  const { data } = useGetSellerEarningsQuery(); // Removed unused variables
  const { data: ordersData = [], refetch } = useShowAllOrdersOfSellerQuery(); // Removed unused variables

  let pendingOrders = ordersData.filter(
    (order) => order.order_status === "Pending"
  );
  pendingOrders = pendingOrders.length;

  const totalRevenue = data?.totalRevenue || 0;

  // Get current year
  const year = new Date().getFullYear();
  console.log(year);
  // Fetch revenue data for all months
  const { data: earningsData = [] } = useGetSellerEarningsByMonthQuery(year);

  // Process earnings data for the bar chart
  const monthlyRevenue = Array(12).fill(0); // Default to 0 for all 12 months

  if (earningsData && earningsData.length > 0) {
    earningsData.forEach((item) => {
      const monthIndex = item.month - 1; // Convert 1-based month to 0-based index
      monthlyRevenue[monthIndex] = item.revenue;
    });
  }

  // Bar Chart Data with Real Revenue
  const barChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: monthlyRevenue, // Use dynamically fetched data
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
    ],
  };

  // Bar Chart Options with Tooltip
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Revenue" },
      tooltip: {
        callbacks: {
          label: function (context) {
            let value = context.raw || 0;
            return `Revenue: ₹${value}`;
          },
        },
      },
    },
  };

  return (
    <Box className="dashboard-container">
      {/* Action Buttons */}
      <Box
        className="dashboard-actions"
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          <Link to="/renter/createproduct">Add New Product</Link>
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<ShoppingCartIcon />}
        >
          <Link to="/renter/vieworders">View Orders</Link>
        </Button>
        {/* Existing content */}
        <Button
          variant="outlined"
          color="primary"
          startIcon={<NotificationsIcon />}
          onClick={handleNotificationsClick}
        >
          Notifications{" "}
          {chatNotifications.length > 0 && `(${chatNotifications.length})`}
        </Button>
      </Box>

      {/* Notifications Drawer */}
      <Notifications
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      >
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Chat Notifications</Typography>
          {chatNotifications.length === 0 ? (
            <Typography>No new messages</Typography>
          ) : (
            <List>
              {chatNotifications.map((notif, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    onClick={() =>
                      handleOpenChat(notif.buyerId, notif.productId)
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "blue" }}>
                        {notif.buyerName?.[0] || "U"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notif.buyerName || "Unknown"}
                      secondary={notif.message}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Notifications>

      <Grid container spacing={3} sx={{ display: "flex", flexWrap: "wrap" }}>
        {/* Overview Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper className="dashboard-card" elevation={3}>
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h5">{totalRevenue}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper className="dashboard-card" elevation={3}>
            <Typography variant="h6">Pending Orders</Typography>
            <Typography variant="h5">{pendingOrders}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper className="dashboard-card" elevation={3}>
            <Typography variant="h6">Active Listings</Typography>
            <Typography variant="h5">{ordersData.length}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper className="dashboard-card" elevation={3}>
            <Typography variant="h6">Notifications</Typography>
            <Typography variant="body1">🛒 New Orders: 2</Typography>
            {/* <Typography variant="body1">📩 New Messages: 3</Typography>
            <Typography variant="body1">💰 Pending Payments: 1</Typography>
            <Typography variant="body1">⚠️ Low Stock: 4</Typography> */}
          </Paper>
        </Grid>

        {/* Analytics Section */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{ display: "flex", flexDirection: "column", flex: 1 }}
        >
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Analytics
              </Typography>
              <Bar data={barChartData} options={barChartOptions} />
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Orders Section */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: "300px",
          }}
        >
          <Card sx={{ flex: 1, maxHeight: "645px", overflowY: "auto" }}>
            <RecentOrders ordersData={ordersData} refetch={refetch} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
