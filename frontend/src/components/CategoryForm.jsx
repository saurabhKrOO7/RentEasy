import { useState } from "react";
import "../pages/Admin/CategoryList.css";
import { useCreateCategoryMutation } from "../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const CategoryForm = ({ onCategoryCreated }) => {
  const [createCategory] = useCreateCategoryMutation();
  const [name, setName] = useState("");

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setName("");
      onCategoryCreated();
      toast.success("Category created successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error creating category");
    }
  };
  return (
    <form className="category-form-container">
      <input
        type="text"
        placeholder="Category name"
        className="category-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="category-button" onClick={handleCategorySubmit}>
        Create
      </button>
    </form>
  );
};
export default CategoryForm;
