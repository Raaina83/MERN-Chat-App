import React, { useState } from 'react'
import { FaSearch } from "react-icons/fa";
import useConversation from '../../zustand/useConversation';
// import {useGetConversations} from '../../hooks/useGetConversations.js'
import toast from 'react-hot-toast';

function SearchInput() {
  const [search, setSearch] = useState("");
  // const {setSelectedConversation} = useConversation()
  // const { conversations } = useGetConversations()

  const handleSubmit = async(e) =>{
    e.preventDefault()
    if(!search) return
    if(search.length < 3) {
      return toast.error("Search term must be atleast 3 characters long")
    }

    
  }

  return (
    <form onSubmit={handleSubmit} 
    className='flex items-center justify-center gap-4 w-[100%] h-[15%]'>
        <input
        type='text'
        placeholder='Search'
        value={search}
        onChange={(e) =>{ setSearch(e.target.value) }}
        className=' rounded-md p-2 w-[70%]'/>
        <div className=' rounded-full bg-white h-[40px] w-[40px] flex items-center justify-center'>
        <button
        type='submit'>
        <FaSearch/></button>
        </div>
    </form>
  )
}

export default SearchInput