import React from 'react'
import SearchInput from './SearchInput'
import ConversationBox from './ConversationBox'
import LogoutBtn from './LogoutBtn'

function Sidebar() {
  return (
    <div className=' w-[25%] h-[100%] bg-gray-200 ' id='sidebar'>
        {/* <SearchInput/> */}
        <ConversationBox/>
        {/* <LogoutBtn/> */}
    </div>
  )
}

export default Sidebar