import { useSelector } from "react-redux";
import { useFetchProductByUserIdQuery } from "../../redux/api/productApiSlice";
import { useRemoveProductBySellerMutation } from "../../redux/api/sellerApiSlice";
import { useUpdateProductDetailsMutation } from "../../redux/api/productApiSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import CreateProduct from "../Admin/CreateProduct";
import "../Admin/AllProduct.css";

const SettingPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userId = userInfo?._id || null;
  const { data: products = [], refetch } = useFetchProductByUserIdQuery(userId);
  const [removeProduct] = useRemoveProductBySellerMutation();
  const [updateProduct] = useUpdateProductDetailsMutation();
  const [sortField, setSortField] = useState("name"); // Default sort by name
  const [sortOrder, setSortOrder] = useState("asc"); // Default order is ascending

  // Sorting handler
  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle order if the same field is clicked
    } else {
      setSortField(field); // Set new field for sorting
      setSortOrder("asc"); // Default to ascending order
    }
  };

  // Utility function to get nested field values (for cases like rentalRate.daily)
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  // Sorting function for array of products
  const sortedProducts = [...products].sort((a, b) => {
    const aValue = getNestedValue(a, sortField);
    const bValue = getNestedValue(b, sortField);

    // Handle different types of fields (e.g., text, numbers, booleans)
    if (typeof aValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    } else if (typeof aValue === "boolean") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }
    return 0; // Fallback for unknown field types
  });

  const handlePreview = (productId) => {
    navigate(`/productdetails/${productId}`);
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setProductToEdit(null);
    setIsModalOpen(false);
    refetch();
  };

  const handleDelete = async (id) => {
    try {
      const answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;
      const { data } = await removeProduct(id);
      toast.success(`"${data.name}" is deleted`, { autoClose: 2000 });
      refetch();
      // navigate("/admin/allproductslist");
    } catch (error) {
      toast.error("Delete failed. Try again.", { autoClose: 2000 });
    }
  };

  return (
    <div className="all-product-container">
      {/* Product Table */}
      <table className="product-table">
        {/* Table Headers */}
        <thead>
          <tr>
            <th>ID</th>
            <th>Thumbnail</th>
            <th onClick={() => handleSort("name")} className="sortable">
              Name
            </th>
            <th onClick={() => handleSort("category")} className="sortable">
              Category
            </th>
            <th>Description</th>
            <th
              onClick={() => handleSort("rentalRate.daily")}
              className="sortable"
            >
              Daily Rate
            </th>
            <th
              onClick={() => handleSort("rentalRate.weekly")}
              className="sortable"
            >
              Weekly Rate
            </th>
            <th
              onClick={() => handleSort("rentalRate.monthly")}
              className="sortable"
            >
              Monthly Rate
            </th>
            <th onClick={() => handleSort("availability")} className="sortable">
              Availability
            </th>
            <th onClick={() => handleSort("location")} className="sortable">
              Location
            </th>
            <th onClick={() => handleSort("condition")} className="sortable">
              Condition
            </th>
            <th
              onClick={() => handleSort("insuranceStatus")}
              className="sortable"
            >
              Insurance
            </th>
            <th>Preview</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="product-thumbnail"
                />
              </td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.description}</td>
              <td>${product.rentalRate.daily}</td>
              <td>${product.rentalRate.weekly || "N/A"}</td>
              <td>${product.rentalRate.monthly || "N/A"}</td>
              <td>{product.availability ? "Available" : "Unavailable"}</td>
              <td>{product.location}</td>
              <td>{product.condition}</td>
              <td>{product.insuranceStatus ? "Yes" : "No"}</td>
              <td>
                <button
                  className="preview-btn"
                  onClick={() => handlePreview(product._id)}
                  target="_blank"
                >
                  Preview
                </button>
              </td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => handleEditClick(product)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Product Editing */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* <button className="close-btn-allproduct" onClick={handleCloseModal}>
              X
            </button> */}
            <CreateProduct
              productInfo={productToEdit}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingPage;
