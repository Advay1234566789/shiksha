import React from 'react'
import { SidebarData } from '../MyPages/Data'

export default function Sidebar() {
  return (

    //   <div className='bg-gray-200 grid grid-cols-4 h-full'>
        <div className='w-[290px] h-[480px] bg-white rounded-xl  p-2 ml-4 pt-3 my-2 flex flex-col gap-3 col-span-1 '>
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
        // </div>

  )
}
