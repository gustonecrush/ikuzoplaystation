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
import Sidebar from '@/app/components/Admin/Sidebar'

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
      <Sidebar />
      <section className="flex flex-col pt-3 w-10/12 bg-white h-full overflow-y-scroll">
        {children}
      </section>
    </main>
  )
}

export default Layout
