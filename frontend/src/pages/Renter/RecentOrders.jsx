import {
  Avatar,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { green, red } from "@mui/material/colors";
import { toast } from "react-toastify";
import {
  useApproveOrderMutation,
  useRejectOrderMutation,
} from "../../redux/api/sellerApiSlice";

const RecentOrders = ({ ordersData, refetch }) => {
  const [approveOrder] = useApproveOrderMutation();
  const [rejectOrder] = useRejectOrderMutation();
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
  return (
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Recent Orders
      </Typography>
      <List>
        {ordersData?.length > 0 ? (
          (() => {
            const pendingOrders = ordersData.filter(
              (order) => order.order_status === "Pending"
            );
            const approvedOrders = ordersData.filter(
              (order) => order.order_status === "Approved"
            );
            const rejectedOrders = ordersData.filter(
              (order) => order.order_status === "Rejected"
            );

            const displayedOrders = [
              ...pendingOrders,
              ...approvedOrders,
              ...rejectedOrders,
            ];

            return displayedOrders.map((order) => (
              <ListItem key={order._id} divider>
                <ListItemAvatar>
                  <Avatar>
                    <ShoppingCartIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <span style={{ fontWeight: "bold", color: "#333" }}>
                      Product: {order.items[0]?.product_id?.name || "Unknown"}
                    </span>
                  }
                  secondary={
                    <>
                      <div
                        style={{
                          margin: "8px 0",
                          padding: "6px",
                          background: "#f5f5f5",
                          borderRadius: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "#1976d2",
                          }}
                        >
                          Buyer: {order.user_id?.name || "Unknown"}
                        </span>
                        <br />
                        <span style={{ color: "#555", fontSize: "14px" }}>
                          Email: {order.user_id?.email || "Not provided"}
                        </span>
                      </div>
                      <div style={{ fontSize: "14px", color: "#444" }}>
                        Price:{" "}
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "#388e3c",
                          }}
                        >
                          ₹{order.items[0]?.price}
                        </span>
                        | Status:{" "}
                        <span
                          style={{
                            fontWeight: "bold",
                            color:
                              order.order_status === "Pending"
                                ? "#f57c00"
                                : order.order_status === "Approved"
                                ? "#388e3c"
                                : "#d32f2f",
                          }}
                        >
                          {order.order_status}
                        </span>
                        | Quantity:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {order.items[0]?.quantity}
                        </span>
                      </div>
                    </>
                  }
                />
                {order.order_status === "Pending" && (
                  <>
                    <IconButton
                      onClick={() => onApprove(order._id)}
                      sx={{ color: green[500] }}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => onReject(order._id)}
                      sx={{ color: red[500] }}
                    >
                      <CancelIcon />
                    </IconButton>
                  </>
                )}
              </ListItem>
            ));
          })()
        ) : (
          <Typography variant="body2" align="center">
            No orders found.
          </Typography>
        )}
      </List>
    </CardContent>
  );
};
export default RecentOrders;
