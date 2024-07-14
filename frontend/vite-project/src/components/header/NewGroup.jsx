import React, { useState } from 'react'
import { Dialog, Stack, DialogTitle, Typography, Button, TextField, Skeleton} from '@mui/material'
import { sampleData } from '../../constants/sampleData'
import UserItem from '../specific/UserItem'
import { useDispatch, useSelector } from 'react-redux';
import {useAsyncMutationHook, useErrors} from '../../hooks/hooks'
import { useAvailableFriendsQuery, useNewGroupMutation } from "../../redux/api/api";
import {setIsNewGroup} from '../../redux/reducers/misc'
import toast from 'react-hot-toast';

function NewGroup() {
    const dispatch = useDispatch()

    const {isNewGroup} = useSelector((state) => state.misc)

    const {isError, isLoading, error, data} = useAvailableFriendsQuery()
    const [newGroup, newGroupLoading] = useAsyncMutationHook(useNewGroupMutation)

    const [selectedMembers, setSelectedMembers] = useState([])
    const [groupName, setGroupName] = useState("")

    useErrors([{isError, error}])

    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) => prev.includes(id) ? prev.filter((i) => i !== id ) : [...prev, id]) 
    }
    // console.log(selectedMembers)

    const submithandler = () =>{
        if(!groupName) return toast.error("Please enter the group name")

        if(selectedMembers.length < 2 ) return toast.error("Please select at least 3 members")

        console.log("new group--", selectedMembers, groupName)

        newGroup("Creating New Group",{ name: groupName, participants: selectedMembers})
        closeGroup()
    }
    const closeGroup = () => {
        dispatch(setIsNewGroup(false))
    }

    const groupNameHandler = (e) => {
        setGroupName(e.target.value)
    }

  return (
    <Dialog onClose={closeGroup} open={isNewGroup}>
        <Stack width={"25rem"} p={{xs: "1rem", sm: "2rem"}}>
            <DialogTitle 
            textAlign={"center"}
            >New Group</DialogTitle>

            <TextField 
                id="outlined-basic" 
                label="Group Name" 
                variant="outlined"
                value={groupName}
                onChange={groupNameHandler}/>

            <Typography variant='body1' sx={{p: "1rem" }}>Members</Typography>

            <Stack>
            {isLoading ? <Skeleton/> : (data?.friends?.map((user) => (
            <UserItem user={user} key={user._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(user._id)}/>
            ))) }
            </Stack>

            <Stack direction={"row"} justifyContent={"space-evenly"} sx={{mt: "1rem"}}>
                <Button variant='outlined' color='error' onClick={closeGroup}>Cancel </Button>
                <Button variant='contained' onClick={submithandler} disabled={newGroupLoading}>Create</Button>
            </Stack>
        </Stack>
    </Dialog>
  )
}

export default NewGroup