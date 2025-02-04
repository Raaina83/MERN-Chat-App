import { IoMdAdd } from "react-icons/io";
import { FaUserGroup } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { FaBars } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import SearchDialog from '../specific/SearchDialog';
import { Backdrop, Badge, Box, IconButton, Tooltip } from '@mui/material';
import Notification from './Notification'
import NewGroup from './NewGroup';
import { setIsMobileMenu, setIsNotification, setIsSearch, setIsNewGroup } from '../../redux/reducers/misc';
import { useDispatch, useSelector } from 'react-redux';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { resetNotification } from '../../redux/reducers/chat';
import axios from 'axios';
import toast from 'react-hot-toast';
import { userNotExists } from '../../redux/reducers/auth';
import api from '../../redux/api/api';
import { Suspense } from "react";


function Header() {
  const {isSearch, isNotification} = useSelector((state) => state.misc)
  const { notificationsCount} = useSelector((state) => state.chat)
  const {isNewGroup} = useSelector((state) => state.misc)
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const logoutHandler = async() => {
    try {
      const {data} = await axios.get(`http://localhost:5000/api/v1/auth/logout`, {
        withCredentials: true
      })
      dispatch(userNotExists())
      dispatch(api.util.resetApiState())
      toast.success(data.message)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  }

  const openSearch = () => dispatch(setIsSearch(true))
 

  const openNotification = () => {
    dispatch(setIsNotification(true))
    dispatch(resetNotification())
  }

  const openNewGroup = () => {
    dispatch(setIsNewGroup(true))
  }
  const handleMobile = () => dispatch(setIsMobileMenu(true))
 

  const navigateToGroup = () => navigate("/group")


  return (
    <div className='h-[10vh] flex items-center justify-center w-[100%] bg-slate-300'>
      <div className='w-[50%] h-[10vh] text-xl hidden font-medium sm:flex items-center justify-start ms-8'>
        Chat App
      </div>

      <div className='flex sm:hidden justify-start w-[50%] h-[10vh] items-center px-4 '>
        <IconButton onClick={handleMobile}>
        <FaBars className=' size-6 cursor-pointer' />
        </IconButton>
      </div>

      <div className='w-[50%] h-[10vh]'>
        <div className='flex justify-end items-center h-[100%]'>
          <div className='px-4'>
            <FaSearch className='h-6 w-6 cursor-pointer' onClick={openSearch}/>
          </div>

          <div className='px-2'>
            <IconBtn 
            title={"Notifications"}
            icon={<NotificationsIcon/>}
            onClick={openNotification}
            value={notificationsCount}></IconBtn>
          </div>
          <div className='px-2'>
            <IconBtn 
            title={"New Group"}
            icon={<IoMdAdd/>}
            onClick={openNewGroup}></IconBtn>
          </div>
          <div className='px-2'>
            <IconBtn 
            title={"Groups"}
            icon={<FaUserGroup/>}
            onClick={navigateToGroup}></IconBtn>
          </div>
          <div className='px-2'>
            <IconBtn 
            title={"Logout"}
            icon={<FiLogOut/>}
            onClick={logoutHandler}></IconBtn>
          </div>
          {/* <div className='px-4'><IoMdAdd className='h-6 w-6 cursor-pointer' onClick={openNewGroup}/></div>
          <div className='px-4' ><FaUserGroup className='h-6 w-6 cursor-pointer' onClick={navigateToGroup}/></div>
          <div className='px-4' ><FiLogOut className='h-6 w-6 me-4 cursor-pointer' onClick={logoutHandler}/></div>  */}
        </div>
        </div>
        {isSearch && (
          <Suspense fallback={<Backdrop open/>}>
            <SearchDialog/>
          </Suspense>
        )}
        {isNotification && (
          <Suspense fallback={<Backdrop open/>}>
            <Notification/>
          </Suspense>
        )}
        {isNewGroup && (
          <Suspense fallback={<Backdrop open/>}>
            <NewGroup/>
          </Suspense>
        )}
    </div>
  )
}

const IconBtn = ({title, icon, onClick, value}) => {
  return (
    <Tooltip title={title}>
      <IconButton color='inherit' size='large' onClick={onClick}>
        {value ? (<Badge badgeContent={value} color='error'>{icon}</Badge>) : (icon)}
      </IconButton>
    </Tooltip>
  )
}

export default Header