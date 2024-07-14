import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../lib/features";
import { NEW_MESSAGE_ALERT } from "../../constants/events";

const initialState = {
    notificationsCount: 0,
    newMessagesAlert: getOrSaveFromStorage({key: NEW_MESSAGE_ALERT, get: true}) || [{
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
        },
        removeNewMessagesAlert: (state, action) => {
            state.newMessagesAlert = state.newMessagesAlert.filter((item) => item.chatId !== action.payload)
        }

    
    }
})

export default chatSlice
export const {
    incrementNotification,
    resetNotification,
    setNewMessagesAlert,
    removeNewMessagesAlert
} = chatSlice.actions