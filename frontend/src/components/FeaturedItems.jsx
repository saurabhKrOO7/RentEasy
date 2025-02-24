import React from "react";
import Slider from "react-slick";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Rating,
} from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FeaturedItems = () => {
  const items = [
    {
      id: 1,
      image: "./images/automative1.jpg",
      name: "Mazda 3 Sedan",
      price: "$199 / Day",
      rating: 5,
    },
    {
      id: 2,
      image: "./images/automative2.jpg",
      name: "Nikon D5100",
      price: "$40 / Day",
      rating: 4.5,
    },
    {
      id: 3,
      image: "./images/automative3.jpg",
      name: "House For Rent",
      price: "$399 / Day",
      rating: 5,
    },
    {
      id: 4,
      image: "./images/automative4.jpg",
      name: "Bike Rental",
      price: "$29 / Day",
      rating: 4.8,
    },
  ];

  // Custom Previous Button
  const CustomPrevArrow = ({ onClick }) => (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        left: "-50px",
        transform: "translateY(-50%)",
        zIndex: 10,
        bgcolor: "rgba(255,255,255,0.2)",
        "&:hover": { bgcolor: "rgba(255,255,255,0.4)" },
      }}
    >
      <ArrowBackIosNew sx={{ color: "#fff", fontSize: 24 }} />
    </IconButton>
  );

  // Custom Next Button
  const CustomNextArrow = ({ onClick }) => (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        right: "-50px",
        transform: "translateY(-50%)",
        zIndex: 10,
        bgcolor: "rgba(255,255,255,0.2)",
        "&:hover": { bgcolor: "rgba(255,255,255,0.4)" },
      }}
    >
      <ArrowForwardIos sx={{ color: "#fff", fontSize: 24 }} />
    </IconButton>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(to right, #141e30, #243b55)",
        color: "#fff",
        py: 8,
        textAlign: "center",
      }}
    >
      <Typography
        variant="h3"
        fontWeight="bold"
        mb={3}
        sx={{ textShadow: "2px 2px 10px rgba(0,0,0,0.5)" }}
      >
        Featured Items
      </Typography>
      <Typography variant="body1" mb={5} sx={{ color: "#ddd" }}>
        Discover the top-rated items available for rent
      </Typography>

      <Box
        sx={{
          width: { xs: "90%", md: "80%" },
          mx: "auto",
          position: "relative",
        }}
      >
        <Slider {...settings}>
          {items.map((item) => (
            <Card
              key={item.id}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 3,
                mx: 2,
                p: 2,
                backdropFilter: "blur(10px)",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 4px 20px rgba(255,255,255,0.2)",
                },
              }}
            >
              <CardMedia
                component="img"
                image={item.image}
                alt={item.name}
                sx={{ height: 200, borderRadius: 2 }}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "#fff", mb: 1 }}
                >
                  {item.name}
                </Typography>
                <Rating
                  value={item.rating}
                  precision={0.5}
                  readOnly
                  sx={{ color: "#ffb400" }}
                />
                <Typography variant="body2" sx={{ color: "#ddd", mt: 1 }}>
                  {item.price}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default FeaturedItems;
