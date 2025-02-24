import { createSlice } from "@reduxjs/toolkit";

const wishListSlice = createSlice({
  name: "wishList",
  initialState: [],
  reducers: {
    addToWishList: (state, action) => {
      // Checkif the product is not already watchList
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
      }
    },
    removeFromWishList: (state, action) => {
      // Remove the product with the matching ID
      return state.filter((product) => product._id !== action.payload._id);
    },
    setWishList: (state, action) => {
      // Set the favorites from localStorage
      return action.payload;
    },
    clearWishList: () => {
      return [];
    },
  },
});

// export const { addToWishList, removeFromWishList, setWishList, clearWishlist } =
//   wishListSlice.actions;
// export const selectWishListProduct = (state) => state.wishList;
// export default wishListSlice.reducer;
