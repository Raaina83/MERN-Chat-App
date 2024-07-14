import React from 'react'
import { Stack, Typography, Avatar, AvatarGroup, Box, } from '@mui/material';
import { Link } from 'react-router-dom';

function GroupListItem({group, chatId}) {
    const {name, profile, _id} = group

  return (
  <Link to={`?group=${_id}`} 
  onClick={(e) => {
    if(chatId === _id ) e.preventDefault();
  }}>
    <Stack direction={"row"} 
    spacing={1} padding={"1rem"} 
    sx={{":hover": 
    {bgcolor: "lightgray"}
    }} 
    alignItems={"center"}>
    <Stack direction={"row"} spacing={0.5}>
      <AvatarGroup
        sx={{
          position: "relative",
        }}
      >
        <Box width={"5rem"} height={"3rem"}>
          {[profile].map((i, index) => (
            <Avatar
              key={Math.random() * 100}
              src={i}
              alt={`Avatar ${index}`}
              sx={{
                width: "3rem",
                height: "3rem",
                position: "absolute",
                left: {
                  xs: `${0.5 + index}rem`,
                  sm: `${index}rem`,
                },
              }}
            />
          ))}
        </Box>
      </AvatarGroup>
    </Stack>
    <Typography>{name}</Typography>
    </Stack>
  </Link>
  )
}

export default GroupListItem