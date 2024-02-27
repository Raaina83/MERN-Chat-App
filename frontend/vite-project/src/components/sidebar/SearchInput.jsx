import React from 'react'
import { FaSearch } from "react-icons/fa";

function SearchInput() {
  return (
    <form className='flex items-center justify-center gap-4 w-[100%] h-[100px]'>
        <input
        type='text'
        placeholder='Search'
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