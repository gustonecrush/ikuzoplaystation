'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FaUserFriends, FaIdCard } from 'react-icons/fa'
import { Video } from '@/app/components/Home'
import Navbar from '@/app/components/Navbar'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export default function ReservationChoice() {
  const router = useRouter()

  const reservationOptions = [
    {
      id: 'member',
      icon: <FaIdCard className="text-5xl text-[#FF6200]" />,
      title: 'Membership',
      description:
        'Unlock exclusive perks, faster booking, and special discounts.',
      buttonLabel: 'Reserve as Member',
      href: '/reservation',
    },
    {
      id: 'guest',
      icon: <FaUserFriends className="text-5xl text-[#FF6200]" />,
      title: 'Guest',
      description: 'Book quickly without signing up, no strings attached.',
      buttonLabel: 'Continue as Guest',
      href: '/reservation',
    },
  ]

  const handleClick = (option) => {
    Cookies.set('doReservation', option.id)

    const isLoggedIn = Cookies.get('isLoggedIn')

    if (option.id === 'member' && !isLoggedIn) {
      router.push('/membership/login')
    } else {
      router.push(option.href)
    }
  }

  return (
    <section className="flex flex-col h-full w-full scroll-smooth overflow-x-hidden relative">
      {/* Navbar */}
      <Navbar />

      {/* Video background */}
      <div className="absolute inset-0 -z-10">
        <Video />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Overlay Container */}
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-orange/40 to-black/60 backdrop-blur-2xl w-full p-6 pt-36 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl rounded-2xl shadow-2xl  p-10 flex flex-col gap-8 items-center"
        >
          <h1 className="text-3xl leading-none font-bold text-white drop-shadow-md text-center">
            Make a Reservation
          </h1>
          <p className="text-white/70 max-w-md text-center">
            Choose whether you’d like to reserve as a <strong>member</strong>{' '}
            with benefits or continue as a <strong>guest</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {reservationOptions.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer bg-white/20 border border-white/30 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-lg hover:shadow-orange-500/30 transition-all"
              >
                {option.icon}
                <h2 className="text-xl font-semibold text-white">
                  {option.title}
                </h2>
                <p className="text-sm text-white/70 text-center">
                  {option.description}
                </p>

                <button
                  onClick={() => handleClick(option)}
                  className="mt-4 px-6 py-2 rounded-xl bg-[#FF6200] text-white font-semibold shadow-lg hover:bg-orange-600 transition"
                >
                  {option.buttonLabel}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
