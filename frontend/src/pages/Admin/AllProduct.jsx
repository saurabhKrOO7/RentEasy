import { useEffect, useState } from "react";
import {
  useFetchProductAccordingToPageQuery,
  useRemoveProductMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import "./AllProduct.css";
import { Link, useNavigate } from "react-router-dom";
import CreateProduct from "./CreateProduct";
import { toast } from "react-toastify";
import { PRODUCT_URL } from "../../redux/constants";
import ProductDetails from "../Products/productDetails";

const AllProduct = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");
  const [sortField, setSortField] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [location, setLocation] = useState("");

  const handlePreview = (productId) => {
    navigate(`/productdetails/${productId}`);
  };

  const [removeProduct] = useRemoveProductMutation();

  const {
    data: { products = [], page, pages, hasMore } = {},
    isLoading,
    isError,
    refetch,
  } = useFetchProductAccordingToPageQuery({
    page: currentPage,
    pageSize: productsPerPage,
    keyword: searchTerm,
    category: filterCategory,
    location,
    sortOrder: sortOrder,
    sortField: sortField,
  });

  console.log(products);

  const { data: categories = [] } = useFetchCategoriesQuery();

  if (isLoading) {
    return <p>Loading products...</p>;
  }

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
      navigate("/admin/allproductslist");
    } catch (error) {
      toast.error("Delete failed. Try again.", { autoClose: 2000 });
    }
  };

  const totalPages = pages || 1;

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleProductsPerPageChange = (e) => {
    setProductsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  const handleSort = (field) => {
    // Toggle the sort order (ascending <-> descending)
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc"); // Reset to ascending when a new column is clicked
    }
  };

  if (isError) {
    return <p>Something went wrong while fetching products!</p>;
  }

  return (
    <div className="all-product-container">
      {/* Filter and Search */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-select"
        >
          <option value="none">Default</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
        <select
          value={productsPerPage}
          onChange={handleProductsPerPageChange}
          className="pagination-select "
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={15}>15 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>

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
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
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

      {/* Pagination */}
      <div className="pagination-container">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`pagination-btn ${page === currentPage ? "active" : ""}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

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

export default AllProduct;
