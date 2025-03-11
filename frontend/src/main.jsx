import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Admin Route
import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import CategoryList from "./pages/Admin/CategoryList.jsx";
import CreateProduct from "./pages/Admin/CreateProduct.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import AllProduct from "./pages/Admin/AllProduct.jsx";

// Renter Route
import RenterRoute from "./pages/Renter/RenterRoute.jsx";
import Dashboard from "./pages/Renter/Dashboard.jsx";
import ViewOrders from "./pages/Renter/ViewOrders.jsx";

// Private Route
import PrivateRoute from "./pages/Auth/PrivateRoute.jsx";
import WishList from "./pages/Products/WishList.jsx";
import Cart from "./pages/User/Cart.jsx";
import SettingPage from "./pages/User/SettingPage.jsx";

// Auth
import Register from "./pages/Auth/Register.jsx";
import Login from "./pages/Auth/Login.jsx";

// Public Route
import ProductDetails from "./pages/Products/productDetails.jsx";
import Home from "./pages/Home.jsx";
import Order from "./pages/Order/Order.jsx";
import Contact from "./components/Contact.jsx";
import AllProducts from "./pages/Products/AllProducts.jsx";
import SellerChat from "./pages/Renter/SellerChat.jsx";
import SellerMessages from "./pages/Renter/SellerMessages.jsx";
import BecomeSeller from "./components/BecomeSeller.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/productdetails/:_id" element={<ProductDetails />} />
      <Route path="/wishlists" element={<WishList />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/allproducts" element={<AllProducts />} />
      <Route path='/become-seller' element={<BecomeSeller />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/order" element={<Order />} />
      </Route>

      <Route path="/admin" element={<AdminRoute />}>
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="createproduct" element={<CreateProduct />} />
        <Route path="userlist" element={<UserList />} />
        <Route path="allproductslist" element={<AllProduct />} />
      </Route>

      <Route path="/renter" element={<RenterRoute />}>
        <Route path="createproduct" element={<CreateProduct />} />
        <Route path="setting" element={<SettingPage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="vieworders" element={<ViewOrders />} />
        <Route
          path="seller-chats/:buyerId/:productId"
          element={<SellerChat />}
        />
        <Route path="messages" element={<SellerMessages />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PayPalScriptProvider>
      <RouterProvider router={router} />
    </PayPalScriptProvider>
  </Provider>
);
