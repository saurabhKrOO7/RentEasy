import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  Slider,
  Button,
  CardMedia,
  CircularProgress,
  Pagination,
  Box,
  ImageListItem,
  ImageList,
} from "@mui/material";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css"; // ✅ Required styles
import "swiper/css/navigation"; // ✅ Import navigation styles

import HeartIcon from "../../components/HeartIcon";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { useFetchProductAccordingToPageQuery } from "../../redux/api/productApiSlice";
import { useAddToCartMutation } from "../../redux/api/cartApiSlice.js";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";

// Default locations (backend should provide real ones)
const locations = ["All", "New York", "Los Angeles", "Chicago", "Miami"];

const AllProducts = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userId = userInfo?._id || "";
  const navigate = useNavigate();

  const locationHook = useLocation();
  const queryParams = new URLSearchParams(locationHook.search);

  const [searchTerm, setSearchTerm] = useState(queryParams.get("search") || "");
  const [filterCategory, setFilterCategory] = useState(
    queryParams.get("category") || "all"
  );
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortOrder, setSortOrder] = useState("none");
  const [sortField, setSortField] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(8);
  const [rentalRate, setRentalRate] = useState("daily");
  const [location, setLocation] = useState(queryParams.get("location") || "");

  const { data: categories = [] } = useFetchCategoriesQuery();
  const {
    data: { products = [], pages } = {},
    isLoading,
    isError,
    refetch,
  } = useFetchProductAccordingToPageQuery({
    page: currentPage,
    pageSize: productsPerPage,
    keyword: searchTerm,
    category: filterCategory,
    location,
    sortOrder,
    sortField,
  });

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setPriceRange([0, 1000]);
    setSortField("name");
    setSortOrder("none");
    setLocation("");
  };

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  if (isError)
    return (
      <Typography sx={{ color: "red", textAlign: "center" }}>
        Something went wrong while fetching products!
      </Typography>
    );

  const handleAddToCart = async (productId, quantity, rentalRate) => {
    try {
      const res = await addToCart({ productId, quantity, rentalRate });
      if (!res.error) toast.success("Product added to cart successfully");
      else toast.error(res.error.message || "Failed to add product to cart");
    } catch (error) {
      toast.error("Failed to add product to cart");
      console.error("Failed to add product to cart", error);
    }
  };

  const handleProductDetails = (productId) => {
    navigate(`/productdetails/${productId}`);
  };

  return (
    <Box sx={{ p: 3, mt: 15 }}>
      {/* Filters Section */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          p: 2,
          bgcolor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        {/* Search Bar */}
        <TextField
          label="Search Products"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: { xs: "100%", md: "30%" } }}
        />

        {/* Category Filter */}
        <FormControl sx={{ width: { xs: "100%", md: "20%" } }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Location Filter */}
        <TextField
          label="Location"
          variant="outlined"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          sx={{ width: { xs: "100%", md: "20%" } }}
        />

        {/* Reset Filters */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleResetFilters}
        >
          Reset Filters
        </Button>
      </Box>

      {/* Product Display */}
      <Grid container spacing={3}>
        {products.length > 0 ? (
          products.map((product) => (
            <Grid
              item
              key={product._id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              onClick={() => handleProductDetails(product._id)}
            >
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card
                  sx={{
                    boxShadow: 3,
                    borderRadius: 2,
                    transition: "0.3s",
                    position: "relative",
                  }}
                >
                  {/* ✅ Heart Icon should always be visible */}
                  <Box
                    sx={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}
                  >
                    {userId && <HeartIcon product={product} />}
                  </Box>
                  {/* 1st method */}
                  {/* <CardMedia
                    component="img"
                    height="180"
                    image={
                      "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"
                    }
                    alt={product.name}
                    sx={{ objectFit: "cover" }}
                  /> */}

                  {/* 2nd method */}
                  {/* <ImageList
                    sx={{ height: 180 }}
                    cols={
                      product?.image?.length > 3 ? 3 : product?.image?.length
                    }
                    rowHeight={180}
                  >
                    {product?.image?.map((index, img) => (
                      <ImageListItem key={index}>
                        <img
                          src={
                            "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"
                          }
                          alt={`${product.name} - ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList> */}

                  {/* 3rd method */}
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={10}
                    slidesPerView={1}
                    style={{ height: 180, borderRadius: 8, overflow: "hidden" }}
                  >
                    {product.images?.length > 0 &&
                      product.images.map((img, index) => (
                        <SwiperSlide key={index}>
                          <img
                            src={`https://renteasy-frontend.onrender.com/${img.replace(
                              /^\/+/,
                              ""
                            )}`}
                            alt={`${product.name} - ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </SwiperSlide>
                      ))}
                  </Swiper>

                  <CardContent sx={{ textAlign: "center", p: 2 }}>
                    {/* Row 1: Name & Category */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: "#333" }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#666", fontStyle: "italic" }}
                      >
                        {product.category}
                      </Typography>
                    </Box>

                    {/* Row 2: Owner, Location & Rating */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        👤 {product.owner?.name || "Unknown Owner"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        📍 {product.location}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#ffa41c", fontWeight: "bold" }}
                      >
                        ⭐ {product.rating} / 5
                      </Typography>
                    </Box>

                    {/* Row 3: Pricing (Daily, Weekly, Monthly) */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        mb: 2,
                        bgcolor: "#f9f9f9",
                        p: 1,
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "bold", color: "#007bff" }}
                      >
                        💲{product.rentalRate.daily} / Day
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "bold", color: "#28a745" }}
                      >
                        💲{product.rentalRate.weekly} / Week
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "bold", color: "#dc3545" }}
                      >
                        💲{product.rentalRate.monthly} / Month
                      </Typography>
                    </Box>

                    {/* Row 4: Add to Cart Button */}

                    <Button
                      variant="contained"
                      onClick={() =>
                        handleAddToCart(product._id, 1, rentalRate)
                      }
                      sx={{
                        width: "100%",
                        background: "linear-gradient(135deg, #ff7e5f, #feb47b)",
                        color: "#fff",
                        fontWeight: "bold",
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #ff6a5b, #fd9d6e)",
                        },
                      }}
                    >
                      🛒 Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))
        ) : (
          <Typography
            variant="h6"
            sx={{ textAlign: "center", width: "100%", mt: 4, color: "gray" }}
          >
            No products found
          </Typography>
        )}
      </Grid>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={pages || 1}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default AllProducts;
