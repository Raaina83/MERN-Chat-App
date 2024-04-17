import React, { useState } from 'react'
import { Dialog, Stack, DialogTitle, Typography, Button, TextField} from '@mui/material'
import { sampleData } from '../../constants/sampleData'
import UserItem from '../specific/UserItem'

function NewGroup() {
    const [open, setOpen] = useState(false)
    const [members, setMembers] = useState(sampleData)
    const [selectedMembers, setSelectedMembers] = useState([])

    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) => prev.includes(id) ? prev.filter((i) => i !== id ) : [...prev, id]) 
    }
    console.log(selectedMembers)

    const submithandler = () =>{

    }
    const closeGroup = () => {
        setOpen(false)
    }

  return (
    <Dialog open onClose={closeGroup}>
        <Stack width={"25rem"} p={{xs: "1rem", sm: "2rem"}}>
            <DialogTitle textAlign={"center"}>New Group</DialogTitle>

            <TextField id="outlined-basic" label="Group Name" variant="outlined"/>

            <Typography variant='body1' sx={{p: "1rem" }}>Members</Typography>

            <Stack>
            {members.map((user) => (
            <UserItem user={user} key={user._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(user._id)}/>
            ))}
            </Stack>

            <Stack direction={"row"} justifyContent={"space-evenly"} sx={{mt: "1rem"}}>
                <Button variant='outlined' color='error' onClick={closeGroup}>Cancel </Button>
                <Button variant='contained' onClick={submithandler}>Create</Button>
            </Stack>
        </Stack>
    </Dialog>
  )
}

export default NewGroup