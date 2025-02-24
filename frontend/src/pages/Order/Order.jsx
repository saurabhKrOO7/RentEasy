import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Container,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import {
  useCreateOrderMutation,
  useSendEmailMutation,
} from "../../redux/api/orderApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetCartItemsQuery } from "../../redux/api/cartApiSlice";

const Order = () => {
  const navigate = useNavigate();
  const {
    data: cartItems = [],
    isLoading: cartLoading,
    refetch,
  } = useGetCartItemsQuery();

  const [createOrder, { isLoading: LoadingToMakeOrder }] =
    useCreateOrderMutation();
  const [sendEmail, { isLoading: LoadingToSendMail }] = useSendEmailMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { _id: user_id } = userInfo;
  const [open, setOpen] = useState(false);

  const isLoading = LoadingToMakeOrder || LoadingToSendMail;
  useEffect(() => {
    refetch();
  }, [cartItems, refetch]);
  const handleConfirmOrder = async () => {
    const data = { user_id, paymentMethod: "PayPal" };
    setOpen(true);
    try {
      const order = await createOrder(data).unwrap();
      await sendEmail({ userInfo, order }).unwrap();
      toast.success("Order placed successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message);
      navigate("/cart");
    }
  };

  return (
    <Container maxWidth="md" sx={{ minHeight: "100vh", py: 15 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}
        >
          Order Summary
        </Typography>

        {cartLoading ? (
          <Backdrop sx={{ color: "#fff", zIndex: 9999 }} open>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : cartItems.length === 0 ? (
          <Typography variant="h6" align="center" color="error">
            No items in your cart!
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {cartItems.map((item, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                  }}
                >
                  {/* Product Image */}
                  <CardMedia
                    component="img"
                    image={item.productId.images[0] || "/default-image.png"}
                    alt={item.productId.name}
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: 2,
                      objectFit: "cover",
                      mr: 2,
                    }}
                  />

                  {/* Product Details */}
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {item.productId.name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Quantity:</strong> {item.quantity}
                    </Typography>
                    <Typography variant="body1">
                      <strong>RentalOption:</strong> {item.rentalRate}
                    </Typography>
                  </CardContent>
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="body1">
                      <strong>Description:</strong> {item.productId.description}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Condition:</strong> {item.productId.condition}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Insurance:</strong>{" "}
                      {item.productId.insuranceStatus
                        ? "Available"
                        : "Not Available"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Checkout Button */}
        <Box mt={4} display="flex" flexDirection="column" alignItems="center">
          <Button
            variant="contained"
            size="large"
            onClick={handleConfirmOrder}
            sx={{
              px: 5,
              py: 2,
              borderRadius: 30,
              backgroundColor: "#ff7f50",
              color: "#fff",
              "&:hover": { backgroundColor: "#ff6347" },
            }}
          >
            Confirm Order
          </Button>

          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

          <Box mt={2}>
            <PayPalButtons />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Order;
