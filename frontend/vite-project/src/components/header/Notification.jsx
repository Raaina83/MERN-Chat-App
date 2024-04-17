import { Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React from 'react'
import { sampleNotification } from '../../constants/sampleData'
import NotificationItem from '../specific/NotificationItem'

function Notification() {
    const friendRequesthandler = (_id, accept) => {

    }
  return (
    <Dialog open>
        <Stack width={"20rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {sampleNotification.length > 0 ? (sampleNotification.map((notification) => (
            <NotificationItem sender={notification.sender} _id={notification._id} 
            handler={friendRequesthandler} key={notification._id}/>
        ))) : <Typography textAlign={"center"}>No Notification</Typography>}
        </Stack>
    </Dialog>
  )
}

export default Notification