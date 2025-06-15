import React from 'react'
import { SidebarData } from '../Data/Data'

const Coursedash = () => {
  return (
    <div className='bg-gray-200 grid grid-cols-4 h-full'>
        <div className='w-[290px] h-[480px] bg-white rounded-xl  p-2 ml-4 pt-3 my-2 flex flex-col gap-3 '>
          {SidebarData.map((item,index)=>{
            return(
              <div className='flex p-2 items-center hover:cursor-pointer hover:bg-blue-400 rounded-lg h-10 relative gap-2 text-xl'>
                <item.icon/>
                <span>
                  {item.heading}
                </span>
              </div>
            )
          }
          )
          }
        </div>
        <div className='w-auto flex col-span-2 gap-2'>
          <div className='mt-2 h-32 w-80 bg-red-300 rounded'></div>
          <div className='mt-2 h-32 w-80 bg-pink-300 rounded'></div>

          
        </div>
        <div className=''></div>
    </div>
  )
}

export default Coursedash