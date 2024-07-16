import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:5000/api/v1/'}), //by default has the behaviour of caching hence we need to provide tags so later when we are just getting cached data we can refecth when changes in data occur
    tagTypes: ["Chat", "User", "Message"],
    endpoints: (builder) => ({
        myChats: builder.query({
            query: () => ({
             url: "chat/my",
             credentials: 'include'  
            }),
            providesTags: ["Chat"]
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
        getAllMessages: builder.query({
            query: ({chatId, page}) => (
                {
                    url: `/chat/message/${chatId}?page=${page}`,
                    credentials: "include"
                }
            ),
            keepUnusedDataFor: 0
        }),
        myGroups: builder.query({
            query: () => ({
             url: "chat/my/groups",
             credentials: 'include'  
            }),
            providesTags: ['Chat']
        }), 
        availableFriends: builder.query({
            query: (chatId) => {
                let url = `users/friends`

                if(chatId) url += `?chatId=${chatId}`

                return {
                    url,
                    credentials: 'include'
                }
            },
            providesTags: ['Chat']
        }), 
        newGroup: builder.mutation({
            query: ({name, participants}) => ({
                url: `chat/new`,
                method: "POST",
                credentials: 'include',
                body: {name, participants}
            }),
            invalidatesTags: ["Chat"]
        }),
        renameGroup: builder.mutation({
            query: ({chatId, name}) => ({
                url: `chat/${chatId}`,
                method: "PUT",
                credentials: 'include',
                body: {name}
            }),
            invalidatesTags: ["Chat"]
        }),
        removeGroupMember: builder.mutation({
            query: ({chatId, userId}) => ({
                url: `chat/removeMember`,
                method: "PUT",
                credentials: 'include',
                body: {chatId, userId}
            }),
            invalidatesTags: ["Chat"]
        }),
        addGroupMember: builder.mutation({
            query: ({chatId, participants}) => ({
                url: `chat/addMembers`,
                method: "PUT",
                credentials: 'include',
                body: {chatId, participants}
            }),
            invalidatesTags: ["Chat"]
        }),
        deleteGroup: builder.mutation({
            query: (chatId) => ({
                url: `chat/${chatId}`,
                method: "DELETE",
                credentials: 'include',
            }),
            invalidatesTags: ["Chat"]
        }),
        leaveGroup: builder.mutation({
            query: (chatId) => ({
                url: `chat/leave/${chatId}`,
                method: "DELETE",
                credentials: 'include',
            }),
            invalidatesTags: ["Chat"]
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
    useChatDetailsQuery,
    useGetAllMessagesQuery,
    useMyGroupsQuery,
    useAvailableFriendsQuery,
    useNewGroupMutation,
    useRenameGroupMutation,
    useRemoveGroupMemberMutation,
    useAddGroupMemberMutation,
    useDeleteGroupMutation,
    useLeaveGroupMutation
} = api