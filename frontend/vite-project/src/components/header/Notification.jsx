import { Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React from 'react'
import { sampleNotification } from '../../constants/sampleData'
import NotificationItem from '../specific/NotificationItem'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api'
import { useErrors } from '../../hooks/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { setIsNotification } from '../../redux/reducers/misc'
import toast from 'react-hot-toast'

function Notification() {
  const {isNotification} = useSelector((state) => state.misc)

  const {isLoading, data, error, isError} = useGetNotificationsQuery()
  const [acceptRequest] = useAcceptFriendRequestMutation()

  const dispatch = useDispatch()

  const friendRequesthandler = async({_id, accept}) => {
    dispatch(setIsNotification(false))

    try {
      const res = await acceptRequest({requestId: _id, accept : accept})
      if(res.data?.success){
        console.log("Socket here")
        toast.success(res.data.message)
      } else toast.error(res.data?.error || "Something went wrong")
    } catch (error) {
      toast.error("Something went wrong")
      console.log(error)
    }
  }

  const notificationClose = () => {
    dispatch(setIsNotification(false))
  }

    useErrors([{isError, error}])

  return (
    <Dialog open={isNotification} onClose={notificationClose}>
        <Stack width={"20rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {isLoading ? <span className=' loading loading-spinner'></span> : data?.requests.length > 0 ? (data?.requests?.map((notification) => (
            <NotificationItem sender={notification.senderId} _id={notification._id} 
            handler={friendRequesthandler} key={notification._id}/>
        ))) : <Typography textAlign={"center"}>No Notification</Typography>}
        </Stack>
    </Dialog>
  )
}

export default Notification