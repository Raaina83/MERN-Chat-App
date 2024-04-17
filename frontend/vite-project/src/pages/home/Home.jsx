import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import MessageContainer from '../../components/messages/MessageContainer'
import Header from '../../components/header/Header'

function Home() {
  return (
    <div className='w-[100vw] h-[100vh] flex flex-col relative'>
      <div className='w-[100vw] h-[10vh] bg-slate-300 static top-0'>
        <Header></Header>
      </div>
      <div className='w-[100vw] h-[90vh] bg-white flex'>
        <Sidebar/>
        <MessageContainer/>
      </div>
    </div>
  )
}

export default Home