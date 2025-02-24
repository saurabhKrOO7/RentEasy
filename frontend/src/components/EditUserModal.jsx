import { useState } from "react";
import "../pages/Admin/UserList.css";

const EditUserModal = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user.role);

  const handleSave = () => {
    const updatedUser = { ...user, name, email, password, role };
    onSave(updatedUser);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit User</h2>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Admin">Admin</option>
            {user.role !== "admin" && (
              <>
                <option value="seller">Seller</option>
                <option value="buyer">Buyer</option>
              </>
            )}
          </select>
        </label>
        <div className="modal-actions">
          <button onClick={handleSave} className="save-btn">
            Save Changes
          </button>
          <button onClick={onClose} className="close-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditUserModal;
