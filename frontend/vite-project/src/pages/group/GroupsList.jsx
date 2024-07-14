import React from 'react'
import { Stack, Typography } from '@mui/material'
import GroupListItem from './GroupListItem'

function GroupsList({w = "100%", myGroups = []}, chatId) {
  return (
    <Stack width={w}>
    {myGroups.length > 0 ? (
      myGroups.map((group) => (<GroupListItem group={group} chatId={chatId} key={group._id}/>))
    ) : (
    <Typography>No Groups Created</Typography>
    )}
  </Stack>
  )
}

export default GroupsList