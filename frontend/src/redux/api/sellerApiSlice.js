import { apiSlice } from "./apiSlice.js";
import { SELLERS_URL } from "../constants";

export const sellerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSellerEarnings: builder.query({
      query: () => ({
        url: `${SELLERS_URL}`,
        method: "GET",
      }),
    }),

    getSellerEarningsByDate: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `${SELLERS_URL}/date?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
    }),

    getSellerEarningsByMonth: builder.query({
      query: (year) => ({
        url: `${SELLERS_URL}/month/${year}`,
        method: "GET",
      }),
    }),

    showAllOrdersOfSeller: builder.query({
      query: () => ({
        url: `${SELLERS_URL}/orders`,
        method: "GET",
      }),
    }),

    approveOrder: builder.mutation({
      query: (orderId) => ({
        url: `${SELLERS_URL}/orders/${orderId}/approve`,
        method: "PUT",
      }),
    }),

    rejectOrder: builder.mutation({
      query: (orderId) => ({
        url: `${SELLERS_URL}/orders/${orderId}/reject`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useGetSellerEarningsQuery,
  useGetSellerEarningsByDateQuery,
  useGetSellerEarningsByMonthQuery,
  useShowAllOrdersOfSellerQuery,
  useApproveOrderMutation,
  useRejectOrderMutation,
} = sellerApiSlice;
