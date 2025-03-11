import { apiSlice } from "./apiSlice";
import { CHAT_URL, SELLERS_URL } from "../constants";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChatMessages: builder.query({
      query: (productId) => `${CHAT_URL}/${productId}`,
      providesTags: ["Chat"],
      transformResponse: (response) => response.messages || [],
    }),
    saveChatMessage: builder.mutation({
      query: (message) => ({
        url: CHAT_URL,
        method: "POST",
        body: message,
      }),
      invalidatesTags: ["Chat"],
    }),
    updateSeenStatus: builder.mutation({
      query: ({ productId, userId }) => ({
        url: `${CHAT_URL}/${productId}/seen`,
        method: "PUT",
        body: { userId },
      }),
      invalidatesTags: ["Chat"],
    }),

    getSellerChats: builder.query({
      query: ({ buyerId, productId }) => ({
        url: `${SELLERS_URL}/chats/${buyerId}/${productId}`,
        method: "GET",
      }),
    }),

    getUnseenMessages: builder.query({
      query: () => ({
        url: `${SELLERS_URL}/unseen-chats`,
        method: "GET",
      }),
    }),

    saveChatMessageFromSeller: builder.mutation({
      query: (message) => ({
        url: `${SELLERS_URL}/save-chat`,
        method: "POST",
        body: message,
      }),
    }),

    updateSeenStatusForSeller: builder.mutation({
      query: ({ productId }) => ({
        url: `${CHAT_URL}/${productId}/seen/seller`,
        method: "PUT",
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const {
  useGetChatMessagesQuery,
  useSaveChatMessageMutation,
  useUpdateSeenStatusMutation,
  useGetSellerChatsQuery,
  useGetUnseenMessagesQuery,
  useSaveChatMessageFromSellerMutation,
  useUpdateSeenStatusForSellerMutation,
} = chatApiSlice;
