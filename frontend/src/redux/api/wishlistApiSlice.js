import { apiSlice } from "./apiSlice";
import { WISHLIST_URL } from "../constants";

export const wishlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductFromWishlist: builder.query({
      query: ({ userId }) => ({
        url: `${WISHLIST_URL}/get/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, { userId }) => [
        { type: "Wishlist", id: userId },
      ],
    }),
    addProductToWishlist: builder.mutation({
      query: ({ userId, productId }) => ({
        url: `${WISHLIST_URL}/add`,
        method: "POST",
        body: { userId, productId },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "Wishlist", id: userId },
      ],
    }),
    removeProductFromWishlist: builder.mutation({
      query: ({ userId, productId }) => ({
        url: `${WISHLIST_URL}/remove`,
        method: "POST",
        body: { userId, productId },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "Wishlist", id: userId },
      ],
    }),
    
  }),
});

export const {
  useAddProductToWishlistMutation,
  useRemoveProductFromWishlistMutation,
  useGetProductFromWishlistQuery,
} = wishlistApiSlice;
