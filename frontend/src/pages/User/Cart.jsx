import { useEffect, useState } from "react";
import {
  useGetCartItemsQuery,
  useDeleteFromCartMutation,
  useUpdateCartMutation,
} from "../../redux/api/cartApiSlice";
import { useAddProductToWishlistMutation } from "../../redux/api/wishlistApiSlice";
import "./Cart.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";

const Cart = () => {
  const navigate = useNavigate();
  const { _id: userId = "" } = useSelector((state) => state.auth.userInfo);
  const { data: cartItems = [], isLoading, refetch } = useGetCartItemsQuery();
  const [deleteFromCart] = useDeleteFromCartMutation();
  const [addProductToWishlist] = useAddProductToWishlistMutation();
  const [updateCart] = useUpdateCartMutation();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(14);
  const [quantityChange, setQuantityChange] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // Calculate the total price based on cart items
  useEffect(() => {
    if (!cartItems.length) return; // Return if cartItems is empty
    else {
      const price = cartItems.reduce((acc, item) => {
        const rentalRate =
          item.productId.rentalRate[item.rentalRate || "daily"] || 0; // Assuming rentalRate is an object with values
        const itemPrice = rentalRate * item.quantity;
        return acc + itemPrice;
      }, 0);
      setTotalPrice(price); // Update totalPrice state
    }
  }, [cartItems]); // Recalculate when cartItems change

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity > 0) {
      await updateCart({ id, quantity: newQuantity });
      refetch();
    } else {
      toast.error("Quantity cannot be less than 1");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await deleteFromCart({ productId });
      refetch();
      toast.success("Item removed from cart successfully");
    } catch (error) {
      toast.error("Failed to remove item from cart");
      console.error("Failed to remove item from cart", error);
    }
  };

  const handleWishlist = async (productId) => {
    try {
      await addProductToWishlist({ userId, productId });
      await deleteFromCart({ productId });
      refetch();
      toast.success("Product added to wishlist successfully");
    } catch (error) {
      toast.error("Failed to add product to wishlist");
      console.error("Failed to add product to wishlist", error);
    }
  };

  const checkoutHandler = () => {
    if (userId) {
      navigate("/order");
    } else navigate("/login?redirect=/order");
  };

  return (
    <div className="cart-container">
      <div className="cart-items">
        <h2>Your shopping cart</h2>
        {cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <img src={item.productId.images?.[0]} alt={item.productId.image} />
            <div className="item-details">
              <h4>{item.productId.name}</h4>
              <p>{item.productId.description}</p>
            </div>
            <div className="item-actions">
              <div className="quantity-control">
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity - 1)
                  }
                  disabled={item.quantity === 1} // Disable if quantity is 1
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
              <p>
                $
                {(
                  item.productId.rentalRate[item.rentalRate] * item.quantity
                ).toFixed(2)}
              </p>
              <button
                className="wishlist"
                onClick={() => handleWishlist(item.productId._id)}
              >
                &#10084;
              </button>
              <button
                className="remove"
                onClick={() => handleRemove(item.productId._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <p className="delivery">Free Delivery within 1-2 weeks</p>
      </div>

      <div className="cart-summary">
        <div className="coupon">
          <h4>Have coupon?</h4>
          <input
            type="text"
            placeholder="Coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button>Apply</button>
        </div>
        <div className="price-details">
          <p>
            Total price: <span>${totalPrice.toFixed(2)}</span>
          </p>
          <p>
            Discount: <span>-${discount.toFixed(2)}</span>
          </p>
          <p>
            TAX: <span>${tax.toFixed(2)}</span>
          </p>
          <p className="total">
            Total: <span>${(totalPrice - discount + tax).toFixed(2)}</span>
          </p>
          <button
            className="purchase"
            disabled={cartItems.length === 0}
            onClick={checkoutHandler}
          >
            Make Purchase
          </button>
          <button className="back-to-shop">Back to shop</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
