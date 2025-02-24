import { useState, useEffect } from "react";
import "./UserList.css"; // Import the CSS file for styling
import { useAllUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useUpdateUserByIdMutation,
  useDeleteUserByIdMutation,
} from "../../redux/api/usersApiSlice";
import EditUserModal from "../../components/EditUserModal";

const UserList = () => {
  const { data: users = [], refetch } = useAllUsersQuery();
  const [updateUser] = useUpdateUserByIdMutation();
  const [deleteUser] = useDeleteUserByIdMutation();

  const [selectedUser, setSelectedUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const sortedUsers = [...users].sort((a, b) => {
    const key = sortConfig.key;
    const valA = a[key]?.toString().toLowerCase() || "";
    const valB = b[key]?.toString().toLowerCase() || "";
    if (sortConfig.direction === "asc") {
      return valA.localeCompare(valB);
    } else {
      return valB.localeCompare(valA);
    }
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(userId);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
  };
  const handleCloseModal = () => {
    setSelectedUser(null);
  };
  const handleSaveChanges = async (data) => {
    try {
      const result = await updateUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      setSelectedUser(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error.error);
      console.log(error);
    }
  };

  return (
    <div className="user-list">
      <h1>User List</h1>
      <table className="user-table">
        <thead className="table-header">
          <tr className="special">
            <th>Serial No.</th>
            <th onClick={() => handleSort("name")} className="sortable">
              Name
            </th>
            <th onClick={() => handleSort("email")} className="sortable">
              Email
            </th>
            <th onClick={() => handleSort("role")} className="sortable">
              Role
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(user)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={handleCloseModal}
          onSave={handleSaveChanges}
        />
      )}
    </div>
  );
};

export default UserList;
