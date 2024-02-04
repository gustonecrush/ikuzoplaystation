import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4 px-14">
      <Image
        src={'success.png'}
        alt="Successfully Pay"
        title={'Successfully Pay'}
        width={0}
        height={0}
        className="w-[300px] h-fit object-contain"
      />
      <div className="flex flex-col gap-1 items-center mt-7 text-center">
        <h1 className="text-xl font-semibold">Pembayaran Berhasil!</h1>
        <p className="text-sm text-gray-400">
          Terima kasih telah melakukan pembayaran, kami tunggu di Ikuzo
          Playstation!
        </p>
      </div>
      <Button className="bg-orange rounded-full px-5 mt-2 py-6 text-sm font-jakarta hover:bg-orange w-full">
        Lihat Struk Pembayaran
      </Button>
      <Link href={'/'} className="!rounded-full text-sm !w-full -mt-2">
        <Button
          variant="outline"
          className="!rounded-full px-5 py-6 text-sm !w-full"
        >
          Kembali
        </Button>
      </Link>
    </div>
  )
}

export default page
