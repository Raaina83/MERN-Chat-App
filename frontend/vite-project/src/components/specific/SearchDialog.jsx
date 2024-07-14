import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { InputAdornment, List, ListItem, ListItemText, Stack, TextField } from '@mui/material';
import { FaSearch } from "react-icons/fa";
import UserItem from './UserItem';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSearch } from '../../redux/reducers/misc';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api';
import { useEffect } from 'react';
import {toast} from 'react-hot-toast'
import { useAsyncMutationHook } from '../../hooks/hooks';

export default function SearchDialog() {
  const {isSearch} = useSelector((state) => state.misc)
  const [searchUser] = useLazySearchUserQuery()
  const [sendFriendRequest, isLoadingFriendReq, data] = useAsyncMutationHook(useSendFriendRequestMutation)

  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("")
  const [users, setUsers] = React.useState([])
  const dispatch = useDispatch()
  const addFriendHandler = async(id) => {
    await sendFriendRequest("Sending Friend Request", { userId: id })
    
  }
  const searchInputHandler =(e) => {setSearch(e.target.value)}
  const searchCloseHandler = () => dispatch(setIsSearch(false))

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search)
        .then(({data}) => setUsers(data.users))
        .catch((e) => console.log(e))
    }, 1000)

    return () => {
      clearTimeout(timeOutId)
    }
  }, [search])

  return (
    <>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        open={isSearch}
        onClose={searchCloseHandler}
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
        onChange={searchInputHandler}
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
