import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { InputAdornment, List, ListItem, ListItemText, Stack, TextField } from '@mui/material';
import { FaSearch } from "react-icons/fa";
import UserItem from './UserItem';
import { sampleData } from '../../constants/sampleData';

export default function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("")
  const [users, setUsers] = React.useState(sampleData)
  const addFriendHandler = (id) => {
    console.log(id)
  }
  const isLoadingFriendReq = false

  return (
    <>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        open
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Stack direction={'column'} spacing={2} padding={'2rem'} width={'25rem'}>
        <DialogTitle id="alert-dialog-title" className='text-center'>
          Find People
        </DialogTitle>
        <TextField
        label="" 
        value={search}
        variant='outlined'
        size='small'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <FaSearch/>
            </InputAdornment>
          )
        }}
        />

        <List>
          {users.map((user) => (
           <UserItem user={user} key={user._id} handler={addFriendHandler} handlerIsLoading={isLoadingFriendReq}/>
          ))}
        </List>
        </Stack>
      </Dialog>
    </>
  );
}
