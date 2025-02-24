import { useEffect } from "react";
import { FaHeart, FaRegHeart, FaVaadin } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddProductToWishlistMutation,
  useRemoveProductFromWishlistMutation,
  useGetProductFromWishlistQuery,
} from "../redux/api/wishlistApiSlice";
import "./HeartIcon.css";
import Loader from "./Loader";

const HeartIcon = ({ product }) => {
  const { _id: userId = "" } = useSelector((state) => state.auth.userInfo);
  const {
    data: wishList = [],
    isLoading: isFetchingWishlist,
    refetch,
  } = useGetProductFromWishlistQuery({ userId });

  const [addProductToWishlist, { isLoading: isAdding }] =
    useAddProductToWishlistMutation();

  const [removeProductFromWishlist, { isLoading: isRemoving }] =
    useRemoveProductFromWishlistMutation();

  const isProductInWishlist = wishList.some((item) => item._id === product._id);
  const isLoading = isFetchingWishlist || isAdding || isRemoving;

  const toggleWishList = async () => {
    if (isProductInWishlist) {
      await removeProductFromWishlist({ userId, productId: product._id });
    } else {
      await addProductToWishlist({ userId, productId: product._id });
    }
    refetch();
  };

  return (
    <div
      className="favorite-icon"
      onClick={toggleWishList}
      title={isAdding || isRemoving ? "Processing..." : "Toggle Wishlist"}
    >
      {isFetchingWishlist || isAdding || isRemoving ? (
        <Loader isLoading={isLoading} size={40} />
      ) : isProductInWishlist ? (
        <FaHeart className="icon heart-filled text-pink-500" />
      ) : (
        <FaRegHeart className="icon heart-outline text-white" />
      )}
    </div>
  );
};
export default HeartIcon;
