import { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  Paper,
} from "@mui/material";
import { useFetchProductByIdQuery } from "../../redux/api/productApiSlice";
import ReviewSection from "../../components/ReviewSection.jsx";
import HeartIcon from "../../components/HeartIcon.jsx";
import { useAddToCartMutation } from "../../redux/api/cartApiSlice.js";
import { toast } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Grid } from "@mui/material";

import Chat from "../../components/Chat.jsx";

const ProductDetails = () => {
  const { _id: productId } = useParams();
  const {
    data: product = null,
    isLoading,
    isError,
  } = useFetchProductByIdQuery(productId);

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const [rentalRate, setRentalRate] = useState("daily");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (product && product.images?.length) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  if (isLoading) {
    return <Box sx={{ textAlign: "center", mt: 10 }}>Loading...</Box>;
  }

  if (isError || !product) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        Failed to load product details.
      </Box>
    );
  }

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId, quantity, rentalRate });
      toast.success("Product added to cart successfully");
    } catch (error) {
      toast.error("Failed to add product to cart");
      console.error("Failed to add product to cart", error);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "90%",
        margin: "auto",
        mt: 10,
        bgcolor: "#f9fafb",
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <Grid
        container
        spacing={4}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        {/* Image Section */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                width: "100%",
                height: 400,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 2,
              }}
            >
              <img
                src={selectedImage}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            </Paper>
            <Box sx={{ display: "flex", gap: 1, mt: 2, overflowX: "auto" }}>
              {product.images.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`Thumbnail ${idx}`}
                  onClick={() => setSelectedImage(image)}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "8px",
                    cursor: "pointer",
                    border:
                      selectedImage === image
                        ? "2px solid #1976d2"
                        : "2px solid transparent",
                    transition: "border 0.3s",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Details Section */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "2px solid #e0e0e0",
                pb: 2,
                mb: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "#333" }}
              >
                {product.name}
              </Typography>
              <HeartIcon product={product} />
            </Box>

            <Typography
              sx={{
                color: "#1976d2",
                fontSize: 18,
                fontWeight: "bold",
                bgcolor: "#e3f2fd",
                display: "inline-block",
                px: 2,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              {product.category}
            </Typography>

            <Typography
              sx={{
                mt: 2,
                fontSize: 16,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#555",
              }}
            >
              <strong>Owner:</strong>
              <Typography
                component="span"
                sx={{ color: "#1976d2", fontWeight: "bold" }}
              >
                {product.owner?.name}
              </Typography>
            </Typography>

            {/* Pricing Section */}
            <Typography sx={{ fontSize: 18, fontWeight: "bold", mt: 2 }}>
              Price:
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 1,
                p: 2,
                bgcolor: "#f3f4f6",
                borderRadius: 2,
                fontWeight: "bold",
              }}
            >
              <Typography sx={{ color: "#1976d2" }}>
                Daily: ${product.rentalRate.daily}
              </Typography>
              <Typography sx={{ color: "#388e3c" }}>
                Weekly: ${product.rentalRate.weekly}
              </Typography>
              <Typography sx={{ color: "#d32f2f" }}>
                Monthly: ${product.rentalRate.monthly}
              </Typography>
            </Box>

            {/* Additional Info */}
            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: "#f3f4f6",
                borderRadius: 2,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Availability:{" "}
                    {product.availability ? (
                      <CheckCircleIcon sx={{ color: "#388e3c", ml: 1 }} />
                    ) : (
                      <CloseIcon sx={{ color: "#d32f2f", ml: 1 }} />
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: product.insurance ? "#1976d2" : "#d32f2f",
                    }}
                  >
                    Insurance:{" "}
                    {product.insurance ? "Available" : "Not Available"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Condition:{" "}
                    <span style={{ color: "#ff9800" }}>
                      {product.condition}
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Location:{" "}
                    <span style={{ color: "#1976d2" }}>{product.location}</span>
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Typography
              sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <strong>Rating:</strong>
              {Array.from({ length: 5 }, (_, index) =>
                index < Math.round(product.rating) ? (
                  <StarIcon key={index} sx={{ color: "#FFD700" }} />
                ) : (
                  <StarBorderIcon key={index} sx={{ color: "#FFD700" }} />
                )
              )}
            </Typography>

            {/* Form */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 3,
                p: 3,
                borderRadius: 2,
                bgcolor: "#f9fafb",
                boxShadow: 2,
              }}
            >
              <Typography
                sx={{ fontWeight: "bold", fontSize: 18, color: "#333" }}
              >
                Choose Rental Plan & Quantity
              </Typography>

              {/* Rental Plan & Quantity Side-by-Side */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {/* Rental Plan Select */}
                <Select
                  value={rentalRate}
                  onChange={(e) => setRentalRate(e.target.value)}
                  sx={{
                    flex: 1,
                    minWidth: "150px",
                    bgcolor: "#fff",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#125ea5",
                    },
                  }}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>

                {/* Quantity Input */}
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  sx={{
                    flex: 1,
                    minWidth: "150px",
                    bgcolor: "#fff",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#125ea5",
                    },
                  }}
                />
              </Box>

              {/* Add to Cart Button */}
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleAddToCart}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  py: 1.5,
                  bgcolor: "#28a745",
                  "&:hover": { bgcolor: "#218838" },
                }}
              >
                Add to Cart
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Chat />
      {/* Reviews Section */}
      <ReviewSection productId={product._id} />
    </Box>
  );
};

export default ProductDetails;
