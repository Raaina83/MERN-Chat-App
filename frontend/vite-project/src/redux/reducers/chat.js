import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notificationsCount: 0
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        incrementNotification: (state, action) => {
            state.notificationsCount = state.notificationsCount + 1
        },
        resetNotification: (state, action) => {
            state.notificationsCount = 0
        }
    }
})

export default chatSlice
export const {
    incrementNotification,
    resetNotification
} = chatSlice.actions