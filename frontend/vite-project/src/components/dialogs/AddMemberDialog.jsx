import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React, {useState} from 'react'
import { sampleData } from '../../constants/sampleData'
import UserItem from '../specific/UserItem'

function AddMemberDialog({addMember, isLoadingAddMember, chatId}) {
    const [members, setMembers] = useState(sampleData)
    const [selectedMembers, setSelectedMembers] = useState([])

    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) => prev.includes(id) ? 
        prev.filter((i) => i !== id ) : [...prev, id]) 
    } //can convert this into a hook that takes a setter function

    const addFriendHandler = (id) => {
        addMember(id, chatId)
    }

    const addMemberSubmithandler = () => {
        closeHandler()
    }

    const closeHandler = () => {
        setSelectedMembers([])
        setMembers([])
    }

  return (
    <Dialog open onClose={closeHandler}>
        <Stack width={"20rem"} padding={"1rem"}>
            <DialogTitle textAlign={"center"}>Add Member</DialogTitle>   
            <Stack spacing={"1rem"}>
                {sampleData.length > 0 ? (  sampleData.map((user) => (
                    <UserItem user={user} key={user._id} handler={selectMemberHandler}
                    isAdded={selectedMembers.includes(user._id)}/>
                ))) : (
                    <Typography textAlign={"center"}>No Friends</Typography>
                )}
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