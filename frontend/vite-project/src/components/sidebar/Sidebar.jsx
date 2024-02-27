import React from 'react'
import SearchInput from './SearchInput'
import ConversationBox from './ConversationBox'
import LogoutBtn from './LogoutBtn'

function Sidebar() {
  return (
    <div className='h-[100%] w-[30%] bg-gray-200 overflow-auto' id='sidebar'>
        <SearchInput/>
        <ConversationBox/>
        <LogoutBtn/>
    </div>
  )
}

export default Sidebar