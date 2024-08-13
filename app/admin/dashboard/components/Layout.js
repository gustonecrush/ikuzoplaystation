'use client'

import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import axios from 'axios'
import Toast from '@/app/components/Toast'
import {
  IoBook,
  IoCalendarClear,
  IoGameController,
  IoLaptopSharp,
  IoLogOut,
  IoTime,
} from 'react-icons/io5'

function Layout({ children }) {
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const token = Cookies.get('token')

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${baseUrl}/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status == 200) {
        Cookies.remove('token')
        Toast.fire({
          icon: 'success',
          title: `Berhasil logout dari dashboard!`,
        })
        console.log({ response })

        router.replace('/admin/login')
      } else {
        Toast.fire({
          icon: 'error',
          title: `Gagal logout dari dashboard!`,
        })
        console.log({ response })
      }
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: `Gagal logout dari dashboard!`,
      })
      console.error({ error })
    }
  }
  return (
    <main className="flex w-full h-screen rounded-3xl">
      <section className="flex h-full flex-col w-2/12 pt-8 bg-white shadow-md rounded-l-3xl">
        <div className="mx-auto p-4  rounded-2xl text-white">
          <Image
            src={'/logo-orange.png'}
            alt="Ikuzo Playstation Logo"
            width={0}
            height={0}
            className="w-[150px]"
          />
        </div>
        <nav className="relative flex flex-col py-4 items-center">
          <a
            href="/admin/dashboard/reservations"
            className="w-16 h-16 p-4 border text-gray-400 flex items-center justify-center rounded-2xl mb-4"
          >
            <IoGameController className="text-4xl" />
          </a>
          <a
            href="/admin/dashboard/contents"
            className="relative w-16 h-16 p-4 flex items-center justify-center bg-yellow-100 text-orange rounded-2xl mb-4 "
          >
            <IoLaptopSharp className="text-4xl" />
          </a>
          <a
            href="/admin/dashboard/times"
            className="w-16 h-16 p-4 border text-gray-400 flex items-center justify-center rounded-2xl mb-4"
          >
            <IoTime className="text-4xl" />
          </a>
          <a
            href="/admin/dashboard/catalogs"
            className="w-16 h-16 p-4 border text-gray-400 flex items-center justify-center rounded-2xl mb-4"
          >
            <IoBook className="text-4xl" />
          </a>
          <a
            href="/admin/dashboard/dates"
            className="w-16 h-16 p-4 border text-gray-400 flex items-center justify-center rounded-2xl mb-4"
          >
            <IoCalendarClear className="text-4xl" />
          </a>
          <a
            href="#"
            onClick={() => handleLogout()}
            className="w-16 h-16 p-4 mt-10 border text-gray-400 rounded-2xl"
          >
            <IoLogOut className="text-4xl" />
          </a>
        </nav>
      </section>
      <section className="flex flex-col pt-3 w-10/12 bg-white h-full overflow-y-scroll">
        {children}
      </section>
    </main>
  )
}

export default Layout
