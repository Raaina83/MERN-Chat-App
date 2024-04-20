import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({baseUrl: 'https://localhost:5000/api/v1/'}), //by default has the behaviour of caching hence we need to provide tags so later when we are just getting cached data we can refecth when changes in data occur
    tagTypes: ["Chat"],
    endpoints: (builder) => ({
        myChats: builder.query({
            query: () => ({
             url: "chat/my",
             credentials: 'include'  
            }),
            providesTags: ['Chat']
        }),
        invalidateTags: ['Chat']
    })
})

export default api;
export const {useMyChatsQuery} = api