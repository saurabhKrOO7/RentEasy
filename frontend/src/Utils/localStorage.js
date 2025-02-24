// Add product to a local storage
export const addWishListToLocalStorage = (product) => {
  const wishList = getWishListFromLocalStorage();
  if (!wishList.some((item) => item.id === product._id)) {
    wishList.push(product);
    localStorage.setItem("wishList", JSON.stringify(wishList));
  }
};

// Remove product from a local storage
export const removeWishListFromLocalStorage = (productId) => {
  const wishList = getWishListFromLocalStorage();
  const newWishList = wishList.filter((item) => item._id !== productId);
  localStorage.setItem("wishList", JSON.stringify(newWishList));
};

// Get watchList from a local storage
export const getWishListFromLocalStorage = () => {
  const wishList = localStorage.getItem("wishList");
  return wishList ? JSON.parse(wishList) : [];
};

// Remove all from wishlist
export const removeAllProductFromLocalStorage = () => {
  return [];
};
