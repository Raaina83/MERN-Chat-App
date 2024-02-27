import React from 'react'

function Header() {
  return (
    <div className='w-full bg-slate-100 sticky top-0 z-20 b-l-1'>
        <div className='w-full h-20 bg-slate-200 flex p-4 items-center' >
        <div className='avatar rounded-full w-[50px] h-[50px]'>
            <img src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=fa
            cearea&facepad=2&w=256&h=256&q=80" className='rounded-full'></img>
        </div>

        <div className='flex flex-1'>
            <div className='flex'>
                <p className='text-md ms-4'>Priya Jyot</p>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Header