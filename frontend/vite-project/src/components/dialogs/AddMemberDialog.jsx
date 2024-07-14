import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import React, {useState} from 'react'
import { sampleData } from '../../constants/sampleData'
import UserItem from '../specific/UserItem'
import { useAsyncMutationHook, useErrors } from '../../hooks/hooks'
import { useAddGroupMemberMutation, useAvailableFriendsQuery } from '../../redux/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMember } from '../../redux/reducers/misc'

function AddMemberDialog({ chatId }) {
    const {isAddMember} = useSelector((state) => state.misc)

    const {isLoading, data, isError, error} = useAvailableFriendsQuery(chatId)  
    console.log(data)

    const dispatch = useDispatch()

    // const [members, setMembers] = useState(sampleData)
    const [selectedMembers, setSelectedMembers] = useState([])

    const [addMember, isLoadingAddMember] = useAsyncMutationHook(useAddGroupMemberMutation)


    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) => prev.includes(id) ? 
        prev.filter((i) => i !== id ) : [...prev, id]) 
    } //can convert this into a hook that takes a setter function

    const addFriendHandler = (id) => {
        addMember(id, chatId)
    }

    const addMemberSubmithandler = () => {
        addMember("Adding Members...", { chatId, participants: selectedMembers})
        closeHandler()
    }

    const closeHandler = () => {
        dispatch(setIsAddMember(false))
    }

    useErrors([{isError, error}])

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
        <Stack width={"20rem"} padding={"1rem"}>
            <DialogTitle textAlign={"center"}>Add Member</DialogTitle>   
            <Stack spacing={"1rem"}>
                {isLoading? <Skeleton/> : (data?.availableFriends?.length > 0 ? (  data.availableFriends.map((user) => (
                    <UserItem user={user} key={user._id} handler={selectMemberHandler}
                    isAdded={selectedMembers.includes(user._id)}/>
                ))) : (
                    <Typography textAlign={"center"}>No Friends</Typography>
                ))}
            </Stack>

            <Stack direction={"row"} alignSelf={"center"} spacing={"2rem"} padding={"1rem"}>
                <Button variant='outlined' size='small' onClick={closeHandler}>Cancel</Button>
                <Button variant='contained' size='small' disabled={isLoadingAddMember}
                onClick={addMemberSubmithandler}>Add Member</Button>
            </Stack>
            
        </Stack>
    </Dialog>
  )
}

export default AddMemberDialog