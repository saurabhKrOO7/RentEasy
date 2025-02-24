import { useEffect, useState } from "react";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice.js";
import { TbSortAscendingLetters } from "react-icons/tb";

import { toast } from "react-toastify";
import "./CategoryList.css"; // Import the CSS file for styling
import CategoryForm from "../../components/CategoryForm.jsx";
import CategoryModal from "../../components/CategoryModal.jsx";

const CategoryList = () => {
  const {
    data: categoriesData,
    isLoading,
    isError,
    refetch,
  } = useFetchCategoriesQuery();

  const [sortOrder, setSortOrder] = useState("asc");

  const categories = categoriesData
    ? [...categoriesData].sort((a, b) =>
        sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      )
    : [];

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };
  const handleCloseModal = () => {
    setSelectedCategory(null); // Close the modal
  };

  return (
    <div className="category-container">
      <h1 className="category-title">Categories</h1>
      {isLoading && <h1 className="category-loading">Loading...</h1>}
      {isError && <h1 className="category-error">Error...</h1>}
      <button className="sort-button" onClick={toggleSortOrder}>
        <TbSortAscendingLetters />
      </button>
      <div className="category-form">
        <CategoryForm onCategoryCreated={refetch} />
      </div>
      {categories && (
        <ul className="category-list">
          {categories.map((category) => (
            <li
              key={category._id}
              className="category-item"
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
            </li>
          ))}
        </ul>
      )}
      {selectedCategory && (
        <CategoryModal
          category={selectedCategory}
          onClose={handleCloseModal}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default CategoryList;
