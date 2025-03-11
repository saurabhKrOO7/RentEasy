import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
  useUpdateProductDetailsMutation,
} from "../../redux/api/productApiSlice";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const CreateProduct = ({ productInfo, onClose }) => {
  const BASE_URL = "https://renteasy-backend.onrender.com";
  const [image, setImage] = useState([]);
  const [name, setName] = useState("");
  const [rentalRate, setRentalRate] = useState({
    daily: "",
    weekly: "",
    monthly: "",
  });
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("");
  const [insuranceStatus, setInsurance] = useState("");
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    if (productInfo) {
      const imagePath = `${BASE_URL}${productInfo.images[0]}`;
      const x = productInfo.images[0];
      setImage(x || []);
      setPhoto(imagePath || null);
      setName(productInfo.name || "");
      setRentalRate({
        daily: productInfo.rentalRate?.daily || "",
        weekly: productInfo.rentalRate?.weekly || "",
        monthly: productInfo.rentalRate?.monthly || "",
      });
      setDescription(productInfo.description || "");
      setAvailability(productInfo.availability ? "Available" : "Unavailable");
      setLocation(productInfo.location || "");
      setCondition(productInfo.condition || "");
      setInsurance(productInfo.insuranceStatus ? "Yes" : "No");
      setCategory(productInfo.category || "");
      setQuantity(productInfo.quantity || 1);
    }
  }, [productInfo]);

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const [updateProductDetails] = useUpdateProductDetailsMutation();
  const { data: categories = [] } = useFetchCategoriesQuery();

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("images", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setPhoto(res.image);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !image ||
      !name.trim() ||
      !rentalRate.daily ||
      !description.trim() ||
      !availability ||
      !location.trim() ||
      !condition ||
      !insuranceStatus ||
      !category
    ) {
      toast.error("Please fill in all the fields before submitting.");
      return;
    }

    try {
      const productData = new FormData();
      productData.append("images", image);
      productData.append("name", name);
      productData.append("daily", rentalRate.daily);
      productData.append("weekly", rentalRate.weekly || 0);
      productData.append("monthly", rentalRate.monthly || 0);
      productData.append("description", description);
      productData.append("availability", availability === "Available");
      productData.append("location", location);
      productData.append("condition", condition);
      productData.append("insuranceStatus", insuranceStatus === "Yes");
      productData.append("category", category);
      productData.append("quantity", quantity);

      try {
        if (productInfo) {
          const data = await updateProductDetails({
            productId: productInfo._id,
            formData: productData,
          }).unwrap();

          if (data?.error) {
            toast.error(data.error, { autoClose: 2000 });
          } else {
            onClose();
            toast.success(`Product successfully updated`, { autoClose: 2000 });
          }
        } else {
          const data = await createProduct(productData).unwrap();
          console.log(data);
          if (data.error) {
            toast.error("Product creation failed. Try again!");
          } else {
            toast.success(`${data.name} is created`);
            navigate("/");
          }
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again!");
        console.error(error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Product creation failed. Try again!");
    }
  };

  return (
    <Paper
      sx={{
        maxWidth: 700,
        width: "90%",
        mx: "auto",
        my: 10, // vertical margin to ensure top & bottom spacing
        p: 3,
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: 3,
        maxHeight: "90vh", // limit the height
        overflowY: "auto", // scrollable if content exceeds max height
      }}
    >
      {/* You may place the close "X" button in the top-right corner */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={onClose} sx={{ minWidth: "auto", p: 0, fontSize: 18 }}>
          &times;
        </Button>
      </Box>
      <Typography variant="h4" textAlign="center" sx={{ mb: 3, color: "#333" }}>
        {productInfo ? "Edit Product" : "Create Product"}
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              sx={{
                textTransform: "none",
                borderColor: "#ccc",
                color: "#555",
                "&:hover": { borderColor: "#007bff" },
              }}
            >
              Upload Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={uploadFileHandler}
              />
            </Button>
            {photo && (
              <Box
                component="img"
                src={photo}
                alt="Uploaded Preview"
                sx={{
                  mt: 2,
                  width: "100%",
                  maxHeight: 200,
                  objectFit: "contain",
                  border: "1px solid #ddd",
                  borderRadius: 1,
                }}
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Name"
              fullWidth
              required
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Rental Rate
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Daily Rate"
                  type="number"
                  required
                  fullWidth
                  variant="outlined"
                  value={rentalRate.daily}
                  onChange={(e) =>
                    setRentalRate({ ...rentalRate, daily: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Weekly Rate (Optional)"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={rentalRate.weekly}
                  onChange={(e) =>
                    setRentalRate({ ...rentalRate, weekly: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Monthly Rate (Optional)"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={rentalRate.monthly}
                  onChange={(e) =>
                    setRentalRate({ ...rentalRate, monthly: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              multiline
              rows={4}
              required
              fullWidth
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel id="availability-label">Availability</InputLabel>
                  <Select
                    labelId="availability-label"
                    label="Availability"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Select availability</em>
                    </MenuItem>
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="Unavailable">Unavailable</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Quantity"
                  type="number"
                  required
                  fullWidth
                  variant="outlined"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Location"
              fullWidth
              required
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required variant="outlined">
              <InputLabel id="condition-label">Condition</InputLabel>
              <Select
                labelId="condition-label"
                label="Condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select Condition</em>
                </MenuItem>
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Used">Used</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required variant="outlined">
              <InputLabel id="insurance-label">Insurance Status</InputLabel>
              <Select
                labelId="insurance-label"
                label="Insurance Status"
                value={insuranceStatus}
                onChange={(e) => setInsurance(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select Insurance Status</em>
                </MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required variant="outlined">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select a category</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                backgroundColor: "#007bff",
                color: "#fff",
                textTransform: "none",
                "&:hover": { backgroundColor: "#0056b3" },
              }}
            >
              {productInfo ? "Edit Product" : "Create Product"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CreateProduct;
