import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import MessageContainer from '../../components/messages/MessageContainer'

function Home() {
  return (
    <div className='flex w-[80%] h-[695px] m-auto'>
        <div className='w-[95%] h-[90%] bg-white m-auto flex'>
        <Sidebar/>
        <MessageContainer/>
        </div>
    </div>
  )
}

export default Home