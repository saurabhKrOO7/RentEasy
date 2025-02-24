import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Button,
  Tabs,
  Tab,
  Collapse,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  ExpandMore,
  ExpandLess,
  ShoppingCart,
} from "@mui/icons-material";
import { green, red, grey } from "@mui/material/colors";
import { Link } from "react-router";
import {
  useApproveOrderMutation,
  useRejectOrderMutation,
  useShowAllOrdersOfSellerQuery,
} from "../../redux/api/sellerApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const ViewOrders = () => {
  const navigate = useNavigate();
  const [approveOrder] = useApproveOrderMutation();
  const [rejectOrder] = useRejectOrderMutation();
  const { data: ordersData = [], refetch } = useShowAllOrdersOfSellerQuery();
  console.log(ordersData);
  const [selectedTab, setSelectedTab] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const handleTabChange = (_, newValue) => setSelectedTab(newValue);
  const toggleExpand = (id) =>
    setExpandedOrder(expandedOrder === id ? null : id);

  const onApprove = async (orderId) => {
    try {
      const res = await approveOrder(orderId);
      refetch();
      if (res.error) {
        console.log(res.error);
        toast.error(res.error?.data?.message || "Failed to approve order");
        return;
      }

      toast.success("Order approved successfully");
    } catch (error) {
      console.error("Error approving order:", error);
    }
  };
  const onReject = async (orderId) => {
    try {
      const res = await rejectOrder(orderId);
      refetch();
      if (res.error) {
        toast.error("Failed to reject order");
        return;
      }

      toast.success("Order rejected successfully");
    } catch (error) {
      console.error("Error rejecting order:", error);
    }
  };

  const filteredOrders =
    selectedTab === "All"
      ? ordersData
      : ordersData.filter((order) => order.order_status === selectedTab);

  return (
    <Card
      sx={{
        maxWidth: "95%",
        mx: "auto",
        mt: 15,
        mb: 5,
        boxShadow: 3,
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333", mb: 2 }}
        >
          Orders Overview
        </Typography>

        {/* Tabs for Order Status Filtering */}
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
        >
          <Tab label="All" value="All" />
          <Tab label="Pending" value="Pending" />
          <Tab label="Approved" value="Approved" />
          <Tab label="Rejected" value="Rejected" />
        </Tabs>

        {/* Orders Table */}
        <TableContainer
          component={Paper}
          sx={{ mt: 2, borderRadius: 2, overflow: "hidden", boxShadow: 2 }}
        >
          <Table>
            <TableHead sx={{ bgcolor: grey[200] }}>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Total Price</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <React.Fragment key={order._id}>
                  {/* Main Order Row */}
                  <TableRow hover>
                    <TableCell>
                      {/* <Avatar
                        src={order.product.image}
                        sx={{ width: 40, height: 40, mr: 1 }}
                      /> */}
                      {order.items[0]?.product_id?.name || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {order.user_id?.name || "Unknown"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {order.user_id?.email || "Unknown"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {order.items[0]?.quantity}
                    </TableCell>
                    <TableCell align="center">
                      ₹{order.items[0]?.price * order.items[0]?.quantity}
                    </TableCell>

                    <TableCell align="center">
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color:
                            order.order_status === "Pending"
                              ? "#f57c00"
                              : order.order_status === "Approved"
                              ? green[600]
                              : red[600],
                        }}
                      >
                        {order.order_status}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {order.order_status === "Pending" ? (
                        <>
                          <IconButton
                            onClick={() => onApprove(order._id)}
                            sx={{ color: green[500] }}
                          >
                            <CheckCircle />
                          </IconButton>
                          <IconButton
                            onClick={() => onReject(order._id)}
                            sx={{ color: red[500] }}
                          >
                            <Cancel />
                          </IconButton>
                        </>
                      ) : (
                        <Typography variant="caption" color="textSecondary">
                          No Actions
                        </Typography>
                      )}
                      <IconButton onClick={() => toggleExpand(order._id)}>
                        {expandedOrder === order._id ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Expandable Row for Extra Details */}
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0 }}>
                      <Collapse
                        in={expandedOrder === order._id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <CardContent
                          sx={{
                            bgcolor: grey[100],
                            borderRadius: 2,
                            mx: 2,
                            my: 1,
                          }}
                        >
                          <Typography variant="body2" color="textSecondary">
                            Order ID: {order._id}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Order Date: {order.date}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Status: {order.order_status}
                          </Typography>
                        </CardContent>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Back to Dashboard Button */}
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<ShoppingCart />}
          sx={{ mt: 2, textTransform: "none" }}
        >
          <Link to="/renter/dashboard" style={{ textDecoration: "none" }}>
            Back to Dashboard
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ViewOrders;
