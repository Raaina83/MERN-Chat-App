import { Menu, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { setIsDeleteMenu } from '../../redux/reducers/misc'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useAsyncMutationHook } from '../../hooks/hooks';
import { useDeleteGroupMutation, useLeaveGroupMutation } from '../../redux/api/api';

function DeleteChatMenu({ dispatch, deleteOptionAnchor}) {
    const navigate = useNavigate()

    const [deleteChat, _, deleteChatData] = useAsyncMutationHook(useDeleteGroupMutation)
    const [leaveGroup, __,leaveGroupData] = useAsyncMutationHook(useLeaveGroupMutation)

    const {isDeleteMenu, selectedDeleteChat} = useSelector((state) => state.misc)

    const isGroup = selectedDeleteChat.groupChat

    const deleteChatHandler = () => {
        closeHandler()
        deleteChat("Deleting Chat...", selectedDeleteChat.chatId)
        deleteOptionAnchor.current = null
    }
    const leaveGroupHandler = () => {
        closeHandler()
        leaveGroup("Leaving group...", selectedDeleteChat.chatId)
        deleteOptionAnchor.current = null
    }

    const closeHandler = () => {
        dispatch(setIsDeleteMenu(false))
    }

    useEffect(() => {
        if(deleteChatData || leaveGroupData) navigate("/")
    }, [deleteChatData, leaveGroupData])

  return (
    <Menu 
        open={isDeleteMenu} 
        onClose={closeHandler} 
        anchorEl={deleteOptionAnchor.current}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
        }}
        transformOrigin={{
            vertical: "center",
            horizontal: "center"
        }}>
        
        <Stack 
        sx={{
            width: "10rem",
            padding: "0.5rem",
            cursor: "pointer"
        }}
        direction={"row"}
        alignItems={"center"}
        spacing={"0.5rem"}
        onClick={isGroup ? leaveGroupHandler : deleteChatHandler}>

            {isGroup ? (
                <>
                <ExitToAppIcon/>
                <Typography>Leave Group</Typography>
                </>
                ) : (
                    <>
                <DeleteIcon/>
                <Typography>Delete Chat</Typography>
                </> 
            )
            }
        </Stack>
    </Menu>
  )
}

export default DeleteChatMenu