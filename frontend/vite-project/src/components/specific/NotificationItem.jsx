import { Avatar, Button, ListItem, Stack, Typography } from '@mui/material'
import React from 'react'
// import AddIcon from '@mui/icons-material/Add';

function NotificationItem({sender, _id, handler}) {
  return (
    <ListItem>
        <Stack direction={"row"} spacing={"1rem"} width={"100%"} alignItems={"center"}>
            <Avatar src={sender.profile} sizes='small'/>

            <Typography
            variant='body1'
            sx={{
                flexGlow: 1,
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%"
            }}
            >{sender.fullName} sent you a friend request</Typography>

            <Stack direction={{
                xs: "column",
                sm: "row"
            }}>
                <Button onClick={() => handler({_id, accept: true})}>Accept </Button>
                <Button color='error' onClick={() => handler({_id, accept: false})}>Reject</Button>
            </Stack>
        </Stack>
    </ListItem>
  )
}

export default NotificationItem