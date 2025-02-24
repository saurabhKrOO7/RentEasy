import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateProduct.css";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
  useUpdateProductDetailsMutation,
} from "../../redux/api/productApiSlice";
import { toast } from "react-toastify";

const CreateProduct = ({ productInfo, onClose }) => {
  const BASE_URL = "http://localhost:5000";
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
          console.log(data);

          if (data?.error) {
            toast.error(data.error, {
              autoClose: 2000,
            });
          } else {
            onClose();
            toast.success(`Product successfully updated`, {
              autoClose: 2000,
            });
            navigate("/admin/allproductslist");
          }
        } else {
          const data = await createProduct(productData).unwrap();
          console.log(data);

          if (data.error) {
            toast.error("Product creation failed. Try again! ");
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
    <div className="create-product">
      <h2>{productInfo ? "Edit Product" : "Create Product"}</h2>
      <form onSubmit={handleSubmit} className="category-forms">
        <div className="category-form-group full-width">
          <label htmlFor="photo">Upload Photo</label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={uploadFileHandler}
          />
          {photo && (
            <img src={photo} alt="Uploaded Preview" className="preview" />
          )}
        </div>

        <div className="category-form-group full-width">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="category-form-group full-width">
          <label>Rental Rate</label>
          <div className="rental-rate-fields">
            <input
              type="number"
              placeholder="Daily Rate"
              value={rentalRate.daily}
              onChange={(e) =>
                setRentalRate({ ...rentalRate, daily: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Weekly Rate (Optional)"
              value={rentalRate.weekly}
              onChange={(e) =>
                setRentalRate({ ...rentalRate, weekly: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Monthly Rate (Optional)"
              value={rentalRate.monthly}
              onChange={(e) =>
                setRentalRate({ ...rentalRate, monthly: e.target.value })
              }
            />
          </div>
        </div>

        <div className="category-form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="category-form-group">
          <label htmlFor="availability">Availability</label>
          <select
            id="availability"
            name="availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            required
          >
            <option value="" disabled>
              Select availability
            </option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
          <div>
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="category-form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="category-form-group">
          <label htmlFor="condition">Condition</label>
          <select
            id="condition"
            name="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Condition status
            </option>
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
        </div>

        <div className="category-form-group">
          <label htmlFor="insurance">Insurance Status</label>
          <select
            id="insuranceStatus"
            name="insuranceStatus"
            value={insuranceStatus}
            onChange={(e) => setInsurance(e.target.value)}
            required
          >
            <option value="" disabled>
              Select insurance status
            </option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="category-form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories &&
              categories?.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        <button type="submit" className="submit-btn full-width">
          {productInfo ? "Edit Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
};
export default CreateProduct;
