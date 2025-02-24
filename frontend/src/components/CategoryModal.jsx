import { useState } from "react";
import {
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import "../pages/Admin/CategoryList.css";

const CategoryModal = ({ category, onClose, refetch }) => {
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [newName, setNewName] = useState(category.name);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!category.name) {
      toast.error("Category name is required");
      return;
    }
    try {
      const result = await updateCategory({
        categoryId: category._id,
        updatedCategory: {
          name: newName,
        },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated to ${newName}`);
        refetch();
        onClose();
      }
    } catch (error) {
      toast.error("Error updating category");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const result = await deleteCategory({
        categoryId: category._id,
      }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted succesfully`);
        refetch();
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error deleting category");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Category</h2>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="modal-input"
        />
        <div className="modal-actions">
          <button onClick={handleUpdate} className="modal-button update">
            Update
          </button>
          <button onClick={handleDelete} className="modal-button delete">
            Delete
          </button>
          <button onClick={onClose} className="modal-button close">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
