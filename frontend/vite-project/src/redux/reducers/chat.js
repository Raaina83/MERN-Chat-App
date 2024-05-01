import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notificationsCount: 0,
    newMessagesAlert: [{
        chatId: "",
        count: 0
    }]
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        incrementNotification: (state, action) => {
            state.notificationsCount += 1
        },
        resetNotification: (state, action) => {
            state.notificationsCount = 0
        },
        setNewMessagesAlert: (state, action) => {
            const index = state.newMessagesAlert.findIndex((item) => 
                item.chatId === action.payload.chatId
            )

            if(index !== -1) {
                state.newMessagesAlert[index].count += 1
            } else{
                state.newMessagesAlert.push({
                    chatId: action.payload.chatId,
                    count: 1
                })
            }
        }

    
    }
})

export default chatSlice
export const {
    incrementNotification,
    resetNotification,
    setNewMessagesAlert
} = chatSlice.actions