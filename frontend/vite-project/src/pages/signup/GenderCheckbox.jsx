import React from 'react'

function GenderCheckbox({onCheckBoxchange, selectedGender}) {
  return (
    <div className='flex items-center'>
        <div className='me-4'>
        <label htmlFor='male' className=' text-md font-medium text-gray-900 me-2'>Male</label>
        <input 
        type='checkbox'
        id='male'
        checked={selectedGender==='male'}
        onChange={() => onCheckBoxchange("male")}
        className='cursor-pointer'
        />
        </div>

        <div>
        <label htmlFor='female'  className='text-md font-medium text-gray-900 me-2'>Female</label>
        <input 
        type='checkbox'
        id='female'
        checked={selectedGender==='female'}
        onChange={() => onCheckBoxchange("female")}
        className='cursor-pointer'/>
        </div>
    </div>
  )
}

export default GenderCheckbox