import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import { BiCategory, BiPhoneCall } from "react-icons/bi";
import { IoCloudUploadSharp, IoLogInOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";
import "./Navigation.css";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import AdminMenu from "../Admin/AdminMenu";
import { useGetProductFromWishlistQuery } from "../../redux/api/wishlistApiSlice";
import { useGetCartItemsQuery } from "../../redux/api/cartApiSlice";
import WishlistCount from "../../components/WishlistCount";

const Navigation = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userId = userInfo?._id || null; // Safely access `_id`
  const { data: categories = [] } = useGetProductFromWishlistQuery({
    userId,
  });
  const { data: cartItems = [] } = useGetCartItemsQuery();
  const [countWishlist, setCountWishList] = useState(0);
  const [countCart, setCountCart] = useState(0);

  const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId);

    toggle.addEventListener("click", () => {
      nav.classList.toggle("show-menu");
      toggle.classList.toggle("show-icon");
    });
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    showMenu("nav-toggle", "nav-menu");
    setCountWishList(categories.length);
    setCountCart(cartItems.length);
  }, [setCountWishList, categories.length, cartItems.length, setCountCart]);

  const [logoutApiCall] = useLogoutMutation();
  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      setCountWishList(0);
      setCountCart(0);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // Header
    <header className="header">
      <nav className="nav container">
        <div className="nav__data">
          <Link to="/" className="nav__logo">
            <img src="../../../images/logo.png" alt="Logo" />
          </Link>

          <div className="nav__toggle" id="nav-toggle">
            <GiHamburgerMenu className="ri-menu-line nav__burger" />
            <MdClose className="ri-close-line nav__close" />
          </div>
        </div>

        {/*  --=============== NAV MENU ===============- */}
        <div className="nav__menu" id="nav-menu">
          <ul className="nav__list">
            {/* <!--=============== DROPDOWN 1 ===============--> */}
            {userInfo && userInfo.role === "admin" ? <AdminMenu /> : null}
            {/* <li className="dropdown__item">
              <div className="nav__link">
                <BiCategory className="ri-arrow-down-s-line dropdown__arrow" />
                Categories{" "}
              </div>

              <ul className="dropdown__menu category__menu">
                {categories.map((category) => (
                  <li key={category._id}>
                    <Link
                      to={`/category/${category._id}`}
                      className="dropdown__link"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li> */}
            {userInfo && userInfo.role === "seller" ? (
              <li>
                <Link to="/renter/createproduct" className="nav__link">
                  <IoCloudUploadSharp />
                  Post Ad
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/become-seller" className="nav__link">
                  <IoCloudUploadSharp />
                  Become seller
                </Link>
              </li>
            )}
            <li>
              <Link to="/allproducts" className="nav__link">
                <BiCategory />
                Products
              </Link>
            </li>
            <li>
              <div className="nav__link">
                {!userInfo ? (
                  <Link to="/login" className="nav__logo">
                    <IoLogInOutline className="ri-planet-line" />
                    Log In
                  </Link>
                ) : (
                  <div className="dropdown__item">
                    <div className="nav__link">
                      <CgProfile className="ri-arrow-down-s-line dropdown__arrow" />
                      Profile
                    </div>
                    <ul className="dropdown__menu">
                      {(userInfo && userInfo.role === "seller") ||
                      (userInfo && userInfo.role === "admin") ? (
                        <>
                          <li>
                            <Link
                              to="/renter/dashboard"
                              className="dropdown__link"
                            >
                              Dashboard
                            </Link>
                          </li>

                          <li>
                            <a href="#" className="dropdown__link">
                              MyRental
                            </a>
                          </li>
                        </>
                      ) : (
                        <></>
                      )}

                      <li>
                        <a href="#" className="dropdown__link">
                          MyLending
                        </a>
                      </li>

                      <li>
                        <Link to="/renter/setting" className="dropdown__link">
                          Setting
                        </Link>
                      </li>

                      <li>
                        <div
                          className="btn dropdown__link "
                          onClick={handleLogout}
                        >
                          Log Out
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </li>

            {/* <!--=============== DROPDOWN 1 ===============--> */}

            <li>
              <Link to="/wishlists" className="nav__link">
                {/* <FiHeart className="ri-planet-line" /> */}
                <div className="counting-top-right">
                  <WishlistCount count={countWishlist} name="wishlist" />
                  WishList
                </div>
              </Link>
            </li>

            <li>
              <Link to="/cart" className="nav__link">
                <div className="counting-top-right">
                  <WishlistCount count={countCart} name="cart" />
                  Cart
                </div>
              </Link>
            </li>

            <li>
              <Link to="/contact" className="nav__link">
                <BiPhoneCall />
                Contact
              </Link>
            </li>
          </ul>
        </div>
        {/* {userInfo && userInfo.role === "admin" ? <AdminMenu /> : null} */}
      </nav>
    </header>
  );
};

export default Navigation;
