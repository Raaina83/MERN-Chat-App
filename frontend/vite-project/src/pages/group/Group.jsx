import { Grid, IconButton, Tooltip, Box, Drawer, Stack, Typography, AvatarGroup, Avatar, TextField, Button, CircularProgress } from '@mui/material'
import React, { Suspense, useEffect, useState } from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {useNavigate, useSearchParams } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { sampleChats, sampleData } from '../../constants/sampleData';
import GroupsList from './GroupsList';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import ConfirmDeleteDialog from '../../components/dialogs/ConfirmDeleteDialog';
import AddMemberDialog from '../../components/dialogs/AddMemberDialog';
import UserItem from '../../components/specific/UserItem';
import { useAddGroupMemberMutation, useChatDetailsQuery, useDeleteGroupMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../../redux/api/api';
import {useAsyncMutationHook, useErrors} from '../../hooks/hooks'
import {LayoutLoader} from '../../components/layout/Layout'
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../../redux/reducers/misc';

function Group() {
  const chatId = useSearchParams()[0].get("group")

  const dispatch = useDispatch()


  const {isAddMember}= useSelector((state) => state.misc)

  const myGroups = useMyGroupsQuery("")

  const groupDetails  = useChatDetailsQuery({chatId, populate: true}, {skip: !chatId})

  const [updateGroup, isLoadingGroupName] = useAsyncMutationHook(useRenameGroupMutation)

  const [removeMember, isLoadingRemoveMember] = useAsyncMutationHook(useRemoveGroupMemberMutation)

  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutationHook(useDeleteGroupMutation)

  const error = [
    {
      isError: myGroups.isError,
      error: myGroups.error
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error
     },
    //{
    //   isError: removeMember.isError
    // }
]

  useErrors(error)

  useEffect(() => {
    if(groupDetails.data){
      setGroupName(groupDetails.data.chat.name)
      setUpdatedGroupName()
      setUsers(groupDetails.data.chat.participants)
    }

    return () => {
      setGroupName("")
      setUpdatedGroupName("")
      setUsers([])
      setIsEdit(false)
    }
  }, [groupDetails.data])

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [updatedGroupName, setUpdatedGroupName] = useState("") 
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)

  const [users, setUsers] = useState([])

  const navigate = useNavigate()
  const navigateBack = () => {
    navigate("/")
  }
  
  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const handleMobileClose = () => {
    setIsMobileMenuOpen(false)
  }

  const updateGroupName = () => {
    setIsEdit(false)
    updateGroup("Updating Group Name...", {
      chatId,
      name: updatedGroupName
    })
  }

  const removeMemberHandler = (userId) => {
    console.log(userId)
    removeMember("Remove Member", {chatId, userId})
  }

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true)
  }

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false)
  }

  const openAddMember = () => {
    dispatch(setIsAddMember(true))
  }

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId)
    closeConfirmDeleteHandler()
  }

  const IconBtns = <>
  <Box sx={{
    display: {
      sm: "none",
      xs: "block"
    },
    position: "fixed",
    top: "1rem",
    right: "1rem",
    borderRadius: "50%",
    bgcolor: "rgba(0,0,0,0.8)",
      
      ":hover": {
        bgcolor: "black"
      }
  }}>
    <IconButton onClick={handleMobile}>
      <MenuIcon sx={{
        color: "white",
      }}/>
    </IconButton>
  </Box>

  <Tooltip>
    <IconButton sx={{
      position: "absolute",
      top: "2rem",
      left: "2rem",
      bgcolor: "rgba(0,0,0,0.8)",
      color: "white",
      ":hover": {
        bgcolor: "black"
      }
    }}
    onClick={navigateBack}>
      <KeyboardBackspaceIcon/>
    </IconButton>
  </Tooltip>
  </>

  const GroupName = 
  <Stack direction={"row"} alignItems={"center"} spacing={'1rem'}>

    {isEdit ? (
      <>
        <TextField value={updatedGroupName} onChange={(e) => setUpdatedGroupName(e.target.value)}></TextField>
        <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}><DoneIcon/></IconButton>
      </>
    ) : (
      <>
        <Typography variant='h4'>{groupName}</Typography>
        <IconButton onClick={() => setIsEdit(true)} disabled={isLoadingGroupName}><EditIcon/></IconButton>
      </>
    )}

  </Stack>

  const ButtonGroup = 
  <Stack
  direction={{
    xs: "column-reverse",
    sm: "row"
  }}
  spacing={"1rem"}
  padding={{
    sm: "1rem",
    xs: '0rem',
    md: "1rem 4rem"
  }}>
    <Button color='error' variant='outlined' 
    onClick={openConfirmDeleteHandler}
    >Delete Group</Button>

    <Button variant='contained' onClick={openAddMember}>Add Member</Button>
  </Stack>

  return myGroups.isLoading ? <LayoutLoader/> :  (
    <Grid container height={"100vh"}>
      <Grid item
      sx={{
        display: {
          xs: "none",
          sm: "block"
        }
      }}
      sm={4}
      bgcolor={"bisque"}
      ><GroupsList myGroups={myGroups?.data?.groups} chatId={chatId}/></Grid>

      <Grid
      item
      xs={12}
      sm={8}
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "1rem 3rem",
        alignItems: "center",
        position: "relative"
      }}
      >
        {IconBtns}

        {groupName && (
          <>
            {GroupName}
            <Typography
            margin={"2rem"}
            alignSelf={"flex-start"}>Members</Typography>

            <Stack maxWidth={"45rem"}
            width={"100%"}
            boxSizing={"border-box"}
            // bgcolor={"white"}
            padding={{
              sm: "0rem",
              xs: "0rem",
              md: "1rem 4rem"
            }}
            spacing={"2rem"}
            height={"50vh"}
            overflow={"auto"}
            >{isLoadingRemoveMember? <CircularProgress/> : groupDetails?.data?.chat?.participants.map((user) => (
                <UserItem 
                  user={user} 
                  isAdded 
                  styling={{
                    boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                    padding: "1rem 2rem",
                    borderRadius: "1rem"
                  }}
                  handler={removeMemberHandler}
                  key={user._id}
                />
              ))}

            </Stack>

            {ButtonGroup}
          </>
        )}


      </Grid>

      {isAddMember && (
        <Suspense>
          <AddMemberDialog chatId={chatId}/>
        </Suspense>
      )}

      {confirmDeleteDialog && ( 
        <Suspense fallback={<div>Loading...</div>}>
          <ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler} deleteHandler={deleteHandler}/>
        </Suspense>
      )}

      <Drawer open= {isMobileMenuOpen} onClose={handleMobileClose}
      sx={{
        display: {
          xs: "block",
          sm: "none"
        }
      }}>
        <GroupsList myGroups={myGroups?.data?.groups} w={'50vw'} chatId={chatId}/>
      </Drawer>
    </Grid>
  )
}


export default Group