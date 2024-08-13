import React from 'react'
import Card from './Card'
import { IoEye, IoEyeOff, IoGameController } from 'react-icons/io5'
import { MdAttachMoney } from 'react-icons/md'
import { FaCircleCheck } from 'react-icons/fa6'
import { RiCloseCircleFill } from 'react-icons/ri'
import { IoMdEyeOff } from 'react-icons/io'

export const Statistics = (total) => {
  const [hideAmount, setHideAmount] = React.useState(true)
  return (
    <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 px-7">
      <Card extra="mt-6 px-3 py-5 items-center text-base bg-white shadow-md rounded-lg flex !flex-row w-full">
        <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
          <IoGameController className="w-20 text-2xl" />
        </div>
        <div>
          <span className="block text-2xl font-bold">
            {total.total.reservations}
          </span>
          <span className="block text-gray-500 text-sm">Reservations</span>
        </div>
      </Card>
      <Card extra="mt-6 px-3 py-5 items-center text-base bg-white shadow-md rounded-lg flex !flex-row w-full">
        <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
          <FaCircleCheck className="w-20 text-2xl" />
        </div>
        <div>
          <span className="block text-2xl font-bold">
            {total.total.success_payment}
          </span>
          <span className="block text-gray-500 text-sm">Success Payment</span>
        </div>
      </Card>
      <Card extra="mt-6 px-3 py-5 items-center text-base bg-white shadow-md rounded-lg flex !flex-row w-full">
        <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
          <RiCloseCircleFill className="w-20 text-3xl" />
        </div>
        <div>
          <span className="inline-block text-2xl font-bold">
            {' '}
            {total.total.pending_payment}
          </span>
          <span className="block text-gray-500 text-sm">
            Pending & Expire Payment
          </span>
        </div>
      </Card>
      <Card extra="mt-6 px-3 py-5 items-center text-base bg-white shadow-md rounded-lg flex !flex-row w-full">
        <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
          <MdAttachMoney className="w-20 text-4xl" />
        </div>
        <div>
          <span className="block text-2xl font-bold">
       {
        hideAmount ? <span className='flex items-center gap-1 text-3xo cursor-pointer' onClick={(e) => setHideAmount(!hideAmount)}>
          
         -
        </span> : <span className='flex flex-col gap-1'>{'IDR ' + (total.total.prices).toLocaleString('ID')} </span>
       }
          </span>
          {
            hideAmount ?  <span onClick={(e) => setHideAmount(!hideAmount)} className="flex gap-1 text-gray-500 text-sm items-center cursor-pointer">
            <IoEye />  Unhide Amount Payment
           
          </span> :<span className='flex gap-1 text-gray-500 text-sm items-center cursor-pointer' onClick={(e) => setHideAmount(!hideAmount)}> <IoEyeOff /> Hide Amount Payment  </span>
          }
         
        </div>
      </Card>
    </section>
  )
}
