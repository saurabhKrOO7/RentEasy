import { apiSlice } from "./apiSlice";
import { CART_URL } from "../constants";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCartItems: builder.query({
      query: () => ({
        url: `${CART_URL}`,
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: ({ productId, quantity, rentalRate }) => ({
        url: `${CART_URL}`,
        method: "POST",
        body: { productId, quantity, rentalRate },
      }),
      invalidatesTags: ["Cart"],
    }),
    deleteFromCart: builder.mutation({
      query: ({ productId }) => ({
        url: `${CART_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCart: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `${CART_URL}/${id}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartItemsQuery,
  useAddToCartMutation,
  useDeleteFromCartMutation,
  useUpdateCartMutation,
} = cartApiSlice;
