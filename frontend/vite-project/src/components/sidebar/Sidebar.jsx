import React from 'react'
import SearchInput from './SearchInput'
import ConversationBox from './ConversationBox'
import LogoutBtn from './LogoutBtn'

function Sidebar() {
  return (
    <div className='hidden sm:w-[25%] sm:h-[100%] bg-gray-200 sm:block' id='sidebar'>
        {/* <SearchInput/> */}
        <ConversationBox />
        {/* <LogoutBtn/> */}
    </div>
  )
}

export default Sidebar