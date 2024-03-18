import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
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
        <h1 className="text-3xl font-semibold font-montserrat">
          404 Not Found!
        </h1>
        <p className="text-sm text-gray-400">
          The page or resource you are looking for is not available on this
          website!
        </p>
      </div>
      <Link href={'/'} className="!rounded-full text-sm !w-fit ">
        <Button className="bg-orange rounded-full px-24 mt-2 py-6 text-sm font-jakarta hover:bg-orange w-full">
          Back to Home
        </Button>
      </Link>
    </div>
  )
}

export default NotFound
