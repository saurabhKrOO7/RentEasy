import React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useBecomeSellerMutation } from "../redux/api/usersApiSlice";
import { toast } from "react-toastify";

const BecomeSeller = () => {
  const navigate = useNavigate();
  const [becomeSeller] = useBecomeSellerMutation();
  // Redirect to payment page with selected plan as query parameter
  const handleUpgrade = async (plan) => {
    const res = await becomeSeller();
    console.log(res);
    if (res.error) {
      toast.error(res.error.message);
      return;
    }
    toast.success("Upgrade successful!");
    navigate(`/`);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 15,
        py: { xs: 4, md: 8 },
        background: "linear-gradient(135deg, #ece9e6, #ffffff)",
      }}
    >
      <Grid container spacing={4} alignItems="center">
        {/* Left section: Hero / Intro */}
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Transform Your Business!
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Upgrade to a seller account and unlock advanced tools to boost
              your sales. Enjoy exclusive features, analytics, and more tailored
              to your business needs.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                backgroundColor: "#1976d2",
                boxShadow: 3,
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
              onClick={() => navigate("/payment")}
            >
              Learn More
            </Button>
          </Box>
        </Grid>

        {/* Right section: Pricing Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 6, borderRadius: 3 }}>
            <CardMedia
              component="img"
              height="200"
              image="https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"
              alt="Business transformation"
            />
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Become a Seller Today!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Choose the plan that fits your needs. Our flexible pricing is
                designed to help your business grow.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {/* Basic Plan */}
                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      p: 2,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Basic Plan
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      ₹499
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      / month
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Access to essential seller tools. Lorem, ipsum dolor.
                    </Typography>
                    <CardActions sx={{ justifyContent: "center", p: 0 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleUpgrade("basic")}
                      >
                        <PayPalButtons />
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                {/* Premium Plan */}
                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      p: 2,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Premium Plan
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      ₹999
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      / month
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Unlock advanced features and detailed analytics.
                    </Typography>
                    <CardActions sx={{ justifyContent: "center", p: 0 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleUpgrade("premium")}
                      >
                        {/* Select Plan */}
                        <PayPalButtons />
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BecomeSeller;
