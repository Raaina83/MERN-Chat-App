import React, { Suspense, useState } from 'react'
import { IoMdNotifications } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { FaUserGroup } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import useLogout from '../../hooks/useLogout';
import { FaBars } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import SearchDialog from '../specific/SearchDialog';
import { Backdrop } from '@mui/material';
import Notification from './Notification'
import NewGroup from './NewGroup';


function Header() {
  const {loading, logout}  = useLogout()
  const navigate = useNavigate()
  const [isSearch, setIsSearch] = useState(false)
  const [isNotification, setIsNotification] = useState(false)
  const [isNewGroup, setIsNewGroup] = useState(false)

  const openSearch = () => {
    setIsSearch((prev) => !prev)
  }

  const openNotification = () => {
    setIsNotification((prev) => !prev)
  }

  const openNewGroup = () => {
    setIsNewGroup((prev) => !prev)
  }

  const navigateToGroup = () => navigate("/group")

  return (
    <div className='h-[10vh] flex items-center justify-center '>
      <div className='w-[50%] h-[10vh] text-xl hidden font-medium sm:flex items-center justify-start ms-8'>
      Chat App
      </div>
      <div className='flex sm:hidden justify-start w-[50%] h-[10vh] items-center px-4'>
        <FaBars className=' size-6 cursor-pointer'/>
      </div>
      <div className='w-[50%] h-[10vh]'>
        <div className='flex justify-end items-center h-[100%]'>
           <div className='px-4'><FaSearch className='h-6 w-6 cursor-pointer' onClick={openSearch}/></div>
          <div className='px-4 '> <IoMdNotifications className='h-6 w-6 cursor-pointer' onClick={openNotification} /></div>
          <div className='px-4'><IoMdAdd className='h-6 w-6 cursor-pointer' onClick={openNewGroup}/></div>
          <div className='px-4' ><FaUserGroup className='h-6 w-6 cursor-pointer' onClick={navigateToGroup}/></div>
          <div className='px-4' ><FiLogOut className='h-6 w-6 me-4 cursor-pointer' onClick={logout}/></div> 
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

export default Header