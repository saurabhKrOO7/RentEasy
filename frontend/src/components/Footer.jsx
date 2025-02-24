import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";

export default function Footer() {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #1a1a1a, #2c3e50)",
        color: "white",
        py: 6,
        mt: 4,
        boxShadow: "0px -2px 10px rgba(0,0,0,0.3)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} justifyContent="center">
          {/* Brand & About */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              RentEase
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 1, opacity: 0.8, fontSize: "14px" }}
            >
              Your go-to platform for renting small to large equipment
              effortlessly. Secure, fast, and reliable.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ borderBottom: "2px solid #00bcd4", pb: 1 }}
            >
              Quick Links
            </Typography>
            {["About Us", "Categories", "Contact Us", "Privacy Policy"].map(
              (text) => (
                <Typography
                  key={text}
                  variant="body2"
                  sx={{
                    mt: 1,
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": {
                      color: "#00bcd4",
                      transform: "translateX(5px)",
                    },
                  }}
                >
                  {text}
                </Typography>
              )
            )}
          </Grid>

          {/* Contact Info */}
          <Grid item xs={6} sm={3} md={3}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ borderBottom: "2px solid #00bcd4", pb: 1 }}
            >
              Contact Us
            </Typography>
            <Box display="flex" alignItems="center" mt={1}>
              <Email fontSize="small" sx={{ mr: 1, color: "#00bcd4" }} />
              <Typography variant="body2">support@rentease.com</Typography>
            </Box>
            <Box display="flex" alignItems="center" mt={1}>
              <Phone fontSize="small" sx={{ mr: 1, color: "#00bcd4" }} />
              <Typography variant="body2">+91 98765 43210</Typography>
            </Box>
            <Box display="flex" alignItems="center" mt={1}>
              <LocationOn fontSize="small" sx={{ mr: 1, color: "#00bcd4" }} />
              <Typography variant="body2">Patna, Bihar, India</Typography>
            </Box>
          </Grid>

          {/* Newsletter Subscription */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ borderBottom: "2px solid #00bcd4", pb: 1 }}
            >
              Stay Updated
            </Typography>
            <Box
              sx={{
                display: "flex",
                mt: 2,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                backdropFilter: "blur(10px)",
                padding: "6px",
              }}
            >
              <TextField
                variant="standard"
                placeholder="Enter your email"
                InputProps={{
                  disableUnderline: true,
                  sx: { color: "white", ml: 2 },
                }}
                sx={{ flex: 1 }}
              />
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#00bcd4",
                  "&:hover": { backgroundColor: "#0097a7" },
                  borderRadius: "8px",
                  px: 3,
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Social Media Links */}
        <Box display="flex" justifyContent="center" mt={4}>
          {[Facebook, Twitter, Instagram, LinkedIn, YouTube].map(
            (Icon, index) => (
              <IconButton
                key={index}
                sx={{
                  color: "white",
                  mx: 1.5,
                  transition: "0.3s",
                  "&:hover": {
                    color: "#00bcd4",
                    transform: "scale(1.2)",
                    textShadow: "0px 0px 10px #00bcd4",
                  },
                }}
              >
                <Icon />
              </IconButton>
            )
          )}
        </Box>

        {/* Copyright */}
        <Typography textAlign="center" sx={{ mt: 3, opacity: 0.7 }}>
          © {new Date().getFullYear()} RentEase. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
