import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:5000/api/v1/'}), //by default has the behaviour of caching hence we need to provide tags so later when we are just getting cached data we can refecth when changes in data occur
    tagTypes: ["Chat", "User"],
    endpoints: (builder) => ({
        myChats: builder.query({
            query: () => ({
             url: "chat/my",
             credentials: 'include'  
            }),
            providesTags: ['Chat']
        }), 
        searchUser: builder.query({
            query: (name) => ({
                url: `users/search?name=${name}`,
                credentials: "include"
            }),
            providesTags: ['User']
        }),
        sendFriendRequest: builder.mutation({
            query: (data) => ({
                url: `users/sendrequest`,
                method: "PUT",
                credentials: 'include',
                body: data
            }),
            invalidatesTags: ["User"]
        }),
        getNotifications: builder.query({
            query: () => ({
                url: `users/notifications`,
                credentials: "include"
            }),
            keepUnusedDataFor: 0
        }),
        acceptFriendRequest: builder.mutation({
            query: (data) => ({
                url: `users/acceptrequest`,
                method: "PUT",
                credentials: 'include',
                body: data
            }),
            invalidatesTags: ["Chat"]
        }),
        chatDetails: builder.query({
            query: ({chatId, populate = false}) => {
                let url = `/chat/${chatId}`
                if(populate) url += '?populate=true'

                return {
                    url,
                    credentials: "include"
                }
            },
            providesTags: ["Chat"]
        }),
        // invalidateTags: ['Chat']
    }),
})

export default api;
export const {
    useMyChatsQuery, 
    useLazySearchUserQuery, 
    useSendFriendRequestMutation, 
    useGetNotificationsQuery, 
    useAcceptFriendRequestMutation,
    useChatDetailsQuery
} = api