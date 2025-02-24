import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./WishList.css";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import {
  useRemoveProductFromWishlistMutation,
  useGetProductFromWishlistQuery,
} from "../../redux/api/wishlistApiSlice";
import { useAddToCartMutation } from "../../redux/api/cartApiSlice";

const WishList = () => {
  const { _id: userId = "" } = useSelector((state) => state.auth.userInfo);
  const {
    data: wishList = [],
    isLoading,
    refetch,
  } = useGetProductFromWishlistQuery({ userId });

  const [removeProductFromWishlist] = useRemoveProductFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();

  const moveToCart = async (_id) => {
    await addToCart({
      productId: _id,
      quantity: 1,
      rentalRate: "daily",
    });
    await removeProductFromWishlist({ userId, productId: _id });
    refetch();
  };

  const removeFromWishlist = async (product) => {
    await removeProductFromWishlist({ userId, productId: product._id });
    refetch();
  };
  return (
    <div className="wishlist-container">
      <h1>My Wishlist</h1>
      <table className="wishlist-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Stock Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {wishList.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="product-image"
                />
              </td>
              <td>{item.name}</td>
              <td>
                <div>
                  <p>Daily: ${item.rentalRate.daily}</p>
                  <p>Weekly: ${item.rentalRate.weekly}</p>
                  <p>Monthly: ${item.rentalRate.monthly}</p>
                </div>
              </td>
              <td className={item.availability ? "in-stock" : "out-of-stock"}>
                {item.availability ? "In Stock" : "Out of Stock"}
              </td>
              <td>
                <div className="action-btns-wishlist">
                  <button
                    onClick={() => moveToCart(item._id)}
                    className="move-to-cart-btn"
                  >
                    <FiShoppingCart />
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item)}
                    className="remove-btn"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WishList;
