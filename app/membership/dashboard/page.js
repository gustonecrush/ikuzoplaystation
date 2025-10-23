'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Toast from '@/app/components/Toast'
import { apiBaseUrl } from '@/utils/urls'
import Cookies from 'js-cookie'
import LoaderHome from '@/app/components/LoaderHome'
import { motion, AnimatePresence } from 'framer-motion'
import { Video } from '@/app/components/Home'
import NavbarMembership from '@/app/components/NavbarMembership'

import { FaGift, FaWhatsapp, FaClock, FaUser } from 'react-icons/fa'
import { BsPerson, BsTelephone } from 'react-icons/bs'
import { HiOutlineCalendar } from 'react-icons/hi'

export default function CustomerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('info')

  const handleLogout = async () => {
    try {
      await axios.post(`${apiBaseUrl}/customer/logout`, null, {
        headers: {
          Authorization: `Bearer ${Cookies.get('XSRF_CUST')}`,
        },
      })

      Toast.fire({ icon: 'success', title: 'Berhasil logout' })
      Cookies.remove('XSRF_CUST')

      setTimeout(() => router.push('/membership/login'), 1000)
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: err?.response?.data?.message || 'Gagal logout',
      })
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/customer/profile`, {
          headers: { Authorization: `Bearer ${Cookies.get('XSRF_CUST')}` },
        })
        setUser(res.data)
      } catch (err) {
        Toast.fire({ icon: 'error', title: 'Gagal memuat data pengguna' })
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const snapScript = 'https://app.midtrans.com/snap/snap.js'
    const clientKey = process.env.NEXT_PUBLIC_CLIENT
    const script = document.createElement('script')
    script.src = snapScript
    script.setAttribute('data-client-key', clientKey)
    script.async = true
    document.body.appendChild(script)

    return () => document.body.removeChild(script)
  }, [])

  if (loading) return <LoaderHome />

  const tabs = [
    { id: 'info', label: 'Member Info', icon: FaUser },
    { id: 'benefits', label: 'Benefits', icon: FaGift },
    { id: 'playtime', label: 'Save Playing Time', icon: FaClock },
  ]

  return (
    <section className="flex flex-col h-full w-full relative overflow-x-hidden">
      <NavbarMembership />

      <div className="absolute inset-0 -z-10">
        <Video />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="min-h-screen w-full bg-gradient-to-br from-orange/40 to-black/60 backdrop-blur-2xl p-3 sm:p-6 pt-24 sm:pt-36 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto rounded-2xl shadow-2xl bg-white/20 border border-white/30 p-4 sm:p-8 mt-10"
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="mt-5 text-2xl sm:text-4xl font-bold leading-none text-white drop-shadow-md mb-2">
              <span className="text-orange">Ikuzo</span>
              <br /> Member Area
            </h1>
            <p className="text-gray-200 text-xs sm:text-sm">
              Welcome back,{' '}
              <span className="font-semibold">{user?.full_name}</span> ✨
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-6 sm:mb-8 overflow-x-auto">
            <div className="inline-flex bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 sm:p-2 gap-1 sm:gap-2 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                      isActive
                        ? 'text-white shadow-lg'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-orange via-orange-500 to-orange-600 rounded-xl"
                        transition={{ type: 'spring', duration: 0.6 }}
                      />
                    )}
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                    <span className="relative z-10 hidden sm:inline">
                      {tab.label}
                    </span>
                    <span className="relative z-10 sm:hidden">
                      {tab.label.split(' ')[0]}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'info' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[300px] sm:min-h-[400px]"
              >
                <MemberInfoTab user={user} />
              </motion.div>
            )}

            {activeTab === 'benefits' && (
              <motion.div
                key="benefits"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[300px] sm:min-h-[400px]"
              >
                <BenefitsTab user={user} />
              </motion.div>
            )}

            {activeTab === 'playtime' && (
              <motion.div
                key="playtime"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[300px] sm:min-h-[400px]"
              >
                <PlaytimeTab user={user} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

// Member Info Tab Component
function MemberInfoTab({ user }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border border-white/30 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/20">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
          <BsPerson className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white">
          Member Information
        </h3>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 text-sm">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
            <div className="w-8 h-8 bg-orange/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <BsPerson className="w-4 h-4 text-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-xs">Username</p>
              <p className="text-white font-semibold truncate">
                @{user?.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
            <div className="w-8 h-8 bg-orange/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <HiOutlineCalendar className="w-4 h-4 text-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-xs">Birth Date</p>
              <p className="text-white font-semibold">{user?.birth_date}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaWhatsapp className="w-4 h-4 text-green-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-xs">WhatsApp</p>
              <p className="text-white font-semibold truncate">
                {user?.whatsapp_number}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
            <div className="w-8 h-8 bg-orange/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <BsTelephone className="w-4 h-4 text-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-xs">Phone</p>
              <p className="text-white font-semibold truncate">
                {user?.phone_number}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Awareness Source Tags */}
      {user?.awareness_source && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-orange/20 rounded-lg flex items-center justify-center">
              <span className="text-orange text-xs">📍</span>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm font-medium">
              How you found us
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.awareness_source.split('.').map((source, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-orange/10 border border-orange/50 text-gray-200 text-xs font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-orange/20 transition-all shadow-lg"
              >
                {source}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// Benefits Tab Component
function BenefitsTab({ user }) {
  if (!user?.benefits) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] px-4">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <Image
            src="/error.png"
            alt="No Benefits"
            width={250}
            height={250}
            className="relative w-[180px] sm:w-[250px] h-auto object-contain drop-shadow-2xl"
          />
        </div>
        <div className="text-center max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            No Benefits Available Yet!
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
            Contact our admin team to unlock your exclusive membership benefits
            🎁
          </p>
          <motion.a
            href="https://wa.me/6282123104079?text=Hi%20Admin%2C%20I%20want%20to%20unlock%20my%20membership%20benefits"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange to-orange-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-orange/50 transition-all"
          >
            <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" />
            Contact Admin
          </motion.a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-orange via-orange to-orange/80 rounded-full blur-xl opacity-40 animate-pulse"></div>
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange via-orange-600 to-orange-700 rounded-full shadow-2xl flex items-center justify-center">
            <FaGift className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-white via-orange-100 to-orange-200 bg-clip-text text-transparent mb-2">
          Your Exclusive Benefits
        </h2>
        <p className="text-gray-200 text-xs sm:text-sm">
          Enjoy your premium membership perks ✨
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto">
        {user.benefits.split('.').map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="group relative bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl border border-white/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xl hover:shadow-2xl hover:border-white/50 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange/0 via-orange/5 to-orange/0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative flex items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-orange via-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange/50 transition-shadow">
                <span className="text-white font-bold text-base sm:text-lg">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-white font-medium leading-relaxed text-sm sm:text-base">
                  {benefit}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Playtime Tab Component
function PlaytimeTab({ user }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] px-4">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-orange via-orange-500 to-orange-600 rounded-full shadow-2xl flex items-center justify-center">
          <FaClock className="w-12 h-12 sm:w-16 sm:h-16 text-white drop-shadow-lg" />
        </div>
      </div>
      <div className="text-center max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Save Playing Time
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          This feature is coming soon! Track and save your gaming sessions here.
        </p>
      </div>
    </div>
  )
}
