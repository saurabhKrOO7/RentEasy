import { apiSlice } from "./apiSlice";
import {
  PAYPAL_URL,
  ORDERS_URL,
  SEND_EMAIL_URL,
  CONTACT_URL,
} from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}`,
        method: "GET",
      }),
    }),
    getUserOrders: builder.query({
      query: () => ({
        url: `/${ORDERS_URL}/mine`,
        method: "GET",
      }),
    }),
    getOrderById: builder.query({
      query: (id) => ({
        url: `/${ORDERS_URL}/${id}`,
        method: "GET",
      }),
    }),
    markOrderAsPaid: builder.mutation({
      query: (id) => ({
        url: `/${ORDERS_URL}/${id}/pay`,
        method: "PUT",
      }),
    }),
    markOrderAsDelivered: builder.mutation({
      query: (id) => ({
        url: `/${ORDERS_URL}/${id}/deliver`,
        method: "PUT",
      }),
    }),
    countTotalOrders: builder.query({
      query: () => ({
        url: `/${ORDERS_URL}/total-orders`,
        method: "GET",
      }),
    }),
    countTotalSales: builder.query({
      query: () => ({
        url: `/${ORDERS_URL}/total-sales`,
        method: "GET",
      }),
    }),
    calculateTotalSalesById: builder.query({
      query: (startDate, endDate) => ({
        url: `/${ORDERS_URL}/total-sales-by-date?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
    }),
    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
    }),

    sendEmail: builder.mutation({
      query: (data) => ({
        url: `${SEND_EMAIL_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    contactMessage: builder.mutation({
      query: (data) => ({
        url: `${CONTACT_URL}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useMarkOrderAsPaidMutation,
  useMarkOrderAsDeliveredMutation,
  useCountTotalOrdersQuery,
  useCountTotalSalesQuery,
  useCalculateTotalSalesByIdQuery,
  useGetPaypalClientIdQuery,
  useSendEmailMutation,
  useContactMessageMutation,
} = orderApiSlice;
