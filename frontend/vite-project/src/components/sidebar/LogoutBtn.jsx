import React from 'react'
import { BiLogOut } from "react-icons/bi";
import { useAuthContext } from '../../context/AuthContext';
import useLogout from '../../hooks/useLogout';


function LogoutBtn() {
  return (
    <div className='ms-2 h-[15%] flex items-center'>
      {!loading ? ( 
      <BiLogOut className='h-8 w-8 hover:cursor-pointer' onClick={logout}/> 
      ) :
      ( 
      <span className='loading loading-spinner'></span> 
      ) 
      }
    </div>
  )
}

export default LogoutBtn