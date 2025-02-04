import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isNewGroup: false,
    isAddMember: false,
    isNotification: false,
    isMobileMenu: false,
    isSearch: false,
    isDeleteMenu: false,
    isFileMenu: false,
    selectedDeleteChat: {
        chatId: "",
        groupChat: false
    },
    uploadingLoader: false,
    inComingCall: null,
    isCallActive: false,
    callId: null,
    iscallAccepted: false,
    isEndCall: false,
    kitToken: undefined
}

const miscSlice = createSlice({
    name: "misc",
    initialState,
    reducers: {
        setIsNewGroup: (state, action) => {
            state.isNewGroup = action.payload
        },
        setIsAddMember: (state, action) => {
            state.isAddMember = action.payload
        },
        setIsNotification: (state, action) => {
            state.isNotification = action.payload
        },
        setIsMobileMenu: (state, action) => {
            state.isMobileMenu = action.payload
        },
        setIsSearch: (state, action) => {
            state.isSearch = action.payload
        },
        setIsDeleteMenu: (state, action) => {
            state.isDeleteMenu = action.payload
        },
        setIsSelectedDeleteChat: (state, action) => {
            state.selectedDeleteChat = action.payload
        },
        setIsFileMenu: (state, action) => {
            state.isFileMenu = action.payload
        },
        setUploadingLoader: (state, action) => {
            state.uploadingLoader = action.payload
        },
        setInComingCall: (state, action) => {
            state.inComingCall = action.payload
        },
        setIsCallActive: (state, action) => {
            state.isCallActive = action.payload
        },
        setCallId: (state, action) => {
            state.callId = action.payload
        },
        setIsCallAccepted: (state, action) => {
            state.iscallAccepted = action.payload
        },
        setIsEndCall: (state, action) => {
            state.isEndCall = action.payload;
        },
        setToken: (state, action) => {
            state.kitToken = action.payload;
        },
    }
})


export default miscSlice
export const {
    setIsAddMember,
    setIsDeleteMenu,
    setIsMobileMenu,
    setIsNewGroup,
    setIsNotification,
    setIsSearch,
    setIsSelectedDeleteChat,
    setIsFileMenu,
    setUploadingLoader,
    setInComingCall,
    setIsCallActive,
    setCallId,
    setIsCallAccepted,
    setIsEndCall,
    setToken
}  = miscSlice.actions