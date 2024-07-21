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
        }
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
}  = miscSlice.actions