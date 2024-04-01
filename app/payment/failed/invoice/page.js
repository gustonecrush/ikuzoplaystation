import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4 px-10">
      <Image
        src={'/error.png'}
        alt="Failed Pay"
        title={'Failed Pay'}
        width={0}
        height={0}
        className="w-[300px] h-fit object-contain"
      />
      <div className="flex flex-col gap-1 items-center mt-7 text-center">
        <h1 className="text-xl font-semibold">Invoice Tidak Ditemukan!</h1>
        <p className="text-sm text-gray-400">
          Pembayaran kamu belum selesai, harap selesaikan terlebih dahulu
          pembayaran untuk dapat mengakses invoice!
        </p>
      </div>
    </div>
  )
}

export default page
