import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Paper,
  TextField,
  Button,
  Rating,
  Grid,
} from "@mui/material";
import {
  useAddProductReviewMutation,
  useGetReviewsQuery,
} from "../redux/api/productApiSlice.js";
import { toast } from "react-toastify";

const ReviewSection = ({ productId }) => {
  const { data: reviews = [], refetch } = useGetReviewsQuery(productId);
  const [createReview] = useAddProductReviewMutation();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [expanded, setExpanded] = useState({});

  const settings = {
    dots: true,
    infinite: reviews.length > 1,
    speed: 500,
    slidesToShow: 1, // Show only one review at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000, // Slide changes every 4 seconds
    arrows: false, // Hide arrows for a cleaner look
  };

  const handleReadMoreToggle = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const truncateText = (text, maxLength, isExpanded) => {
    if (isExpanded || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating: Number(rating),
        comment,
      }).unwrap();
      refetch();
      setComment("");
      setRating(0);
      toast.success("Review submitted successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit review.");
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", my: 5, px: 2 }}>
      <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
        Customer Reviews
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {/* Review Carousel Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: "100%", mx: "auto" }}>
            <Slider {...settings}>
              {reviews.map((review, index) => (
                <Card
                  key={index}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                    boxShadow: 3,
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  <Avatar
                    src={
                      review.sender.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        review.sender.name
                      )}&background=random`
                    }
                    alt={review.sender.name}
                    sx={{ width: 35, height: 35 }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    {review?.user?.name}
                  </Typography>
                  <Rating value={review.rating} readOnly sx={{ mb: 1 }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontStyle="italic"
                  >
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    {truncateText(review.comment, 100, expanded[index])}
                    {review.comment.length > 100 && (
                      <Typography
                        component="span"
                        onClick={() => handleReadMoreToggle(index)}
                        sx={{
                          color: "primary.main",
                          cursor: "pointer",
                          ml: 1,
                          fontWeight: "bold",
                        }}
                      >
                        {expanded[index] ? "Read less" : "Read more"}
                      </Typography>
                    )}
                  </Typography>
                </Card>
              ))}
            </Slider>
          </Box>
        </Grid>

        {/* Review Submission Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Submit Your Review
            </Typography>
            <TextField
              label="Your Review"
              multiline
              rows={4}
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="body1" mb={1}>
              Rating:
            </Typography>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={submitHandler}
              sx={{
                fontWeight: "bold",
                py: 1.5,
                textTransform: "none",
                bgcolor: "#007bff",
                "&:hover": { bgcolor: "#0056b3" },
              }}
            >
              Submit Review
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReviewSection;
