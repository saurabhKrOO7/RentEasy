import { PRODUCT_URL, REVIEW_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCT_URL}`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    fetchAllProducts: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/allproducts`,
        method: "GET",
      }),
    }),
    updateProductDetails: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "PUT",
        body: formData,
      }),
    }),
    removeProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
      providesTags: ["Product"],
    }),
    fetchProductAccordingToPage: builder.query({
      query: ({
        page,
        pageSize,
        keyword,
        category,
        location,
        sortOrder,
        sortField,
      }) => ({
        url: `${PRODUCT_URL}?page=${page}&pageSize=${pageSize}&keyword=${keyword}&category=${category}&location=${location}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
      }),
    }),
    fetchProductById: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "GET",
      }),
    }),
    addProductReview: builder.mutation({
      query: ({ productId, rating, comment }) => ({
        url: `${PRODUCT_URL}/${productId}/reviews`,
        method: "POST",
        body: { rating, comment },
      }),
    }),
    getReviews: builder.query({
      query: (productId) => ({
        url: `${REVIEW_URL}/${productId}`,
        method: "GET",
      }),
    }),
    fetchProductByUserId: builder.query({
      query: (userId) => ({
        url: `${PRODUCT_URL}/seller/${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateProductMutation,
  useUploadProductImageMutation,
  useFetchAllProductsQuery,
  useUpdateProductDetailsMutation,
  useRemoveProductMutation,
  useFetchProductAccordingToPageQuery,
  useFetchProductByIdQuery,
  useAddProductReviewMutation,
  useGetReviewsQuery,
  useFetchProductByUserIdQuery,
} = productApiSlice;
