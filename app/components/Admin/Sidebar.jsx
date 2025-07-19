'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  IoGameController,
  IoLaptopSharp,
  IoTime,
  IoBook,
  IoCalendarClear,
  IoLogOut,
} from 'react-icons/io5'
import { BsStars } from 'react-icons/bs'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    console.log('Logging out...')
    router.push('/admin/login')
  }

  const navItems = [
    {
      href: '/admin/dashboard/reservations',
      icon: <IoGameController className="text-4xl" />,
    },
    {
      href: '/admin/dashboard/contents',
      icon: <IoLaptopSharp className="text-4xl" />,
    },
    {
      href: '/admin/dashboard/times',
      icon: <IoTime className="text-4xl" />,
    },
    {
      href: '/admin/dashboard/catalogs',
      icon: <IoBook className="text-4xl" />,
    },
    {
      href: '/admin/dashboard/dates',
      icon: <IoCalendarClear className="text-4xl" />,
    },
    {
      href: '/admin/dashboard/membership',
      icon: <BsStars className="text-4xl" />,
    },
    {
      icon: <IoLogOut className="text-4xl" />,
      onClick: handleLogout,
      isLogout: true,
    },
  ]

  return (
    <section className="flex h-full flex-col w-2/12 pt-8 bg-white shadow-md rounded-l-3xl">
      <div className="mx-auto p-4 rounded-2xl text-white">
        <Image
          src="/logo-orange.png"
          alt="Ikuzo Playstation Logo"
          width={150}
          height={0}
          className="w-[150px] h-auto"
        />
      </div>

      <nav className="relative flex flex-col py-4 items-center">
        {navItems.map((item, idx) => {
          const isActive = item.href && pathname === item.href
          const isLogout = item.isLogout

          return (
            <a
              key={idx}
              href={item.href || '#'}
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault()
                  item.onClick()
                }
              }}
              className={`w-16 h-16 p-4 flex items-center justify-center rounded-2xl mb-4 transition-colors duration-200 ${
                isLogout
                  ? 'mt-10'
                  : isActive
                  ? 'bg-yellow-100 text-orange'
                  : 'border text-gray-400 hover:bg-gray-100'
              }`}
            >
              {item.icon}
            </a>
          )
        })}
      </nav>
    </section>
  )
}
