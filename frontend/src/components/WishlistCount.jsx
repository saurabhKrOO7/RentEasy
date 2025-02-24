import React from "react";
import { FaHeart } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import "./WishlistCount.css";

const WishlistCount = ({ count, name }) => {
  return (
    <div className="wishlist-count-container">
      {name === "cart" ? (
        <FaCartShopping className="wishlist-icon" />
      ) : (
        <FaHeart className="wishlist-icon" />
      )}
      {count > 0 && <span className="wishlist-count">{count}</span>}
    </div>
  );
};

export default WishlistCount;
