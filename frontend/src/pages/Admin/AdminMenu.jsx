import { Link } from "react-router-dom";
import "./Admin.css";
import "../Auth/Navigation.css";

const AdminMenu = () => {
  return (
    <li className="dropdown__item">
      <div className="nav__link">Admin</div>
      <ul className="dropdown__menu nav___link">
        <li>
          <Link to="/admin/categorylist" className="nav__link">
            Create Category
          </Link>
        </li>
        <li>
          <Link to="/admin/createproduct" className="nav__link">
            Create Product
          </Link>
        </li>
        <li>
          <Link to="/admin/allproductslist" className="nav__link">
            All Products
          </Link>
        </li>
        <li>
          <Link to="/admin/userlist" className="nav__link">
            Manage Users
          </Link>
        </li>
      </ul>
    </li>
  );
};
export default AdminMenu;
