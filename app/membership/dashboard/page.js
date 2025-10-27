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
    { id: 'playtime', label: 'Reservations', icon: FaClock },
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
            <h1 className="mt-5 text-3xl sm:text-4xl font-bold leading-none text-white drop-shadow-md mb-2">
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
              <p className="text-gray-200 text-xs">Username</p>
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
              <p className="text-gray-200 text-xs">Birth Date</p>
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
              <p className="text-gray-200 text-xs">WhatsApp</p>
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
              <p className="text-gray-200 text-xs">Phone</p>
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

// Replace the PlaytimeTab component with this updated version

// Replace the PlaytimeTab component with this enhanced version

function PlaytimeTab({ user }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [formData, setFormData] = useState({
    date_saving: '',
    start_time_saving: '',
    end_time_saving: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reservations = user?.reservations || []

  const handleAddSavingTime = (reservation) => {
    setSelectedReservation(reservation)
    setFormData({
      date_saving: reservation.reserve_date,
      start_time_saving: reservation.reserve_start_time,
      end_time_saving: reservation.reserve_end_time,
    })
    setShowAddModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await axios.post(
        `${apiBaseUrl}/reservation-saving-times`,
        {
          id_reservation: selectedReservation.id,
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('XSRF_CUST')}`,
          },
        },
      )

      Toast.fire({
        icon: 'success',
        title: 'Saving time berhasil ditambahkan!',
      })

      setShowAddModal(false)
      window.location.reload()
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title:
          error?.response?.data?.message || 'Gagal menambahkan saving time',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (reservations.length === 0) {
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
            No Reservations Yet
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            You haven't made any reservations. Start booking your gaming
            sessions!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange/50 scrollbar-track-white/10">
      {/* Header with Stats */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaClock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                My Reservations
              </h3>
              <p className="text-xs sm:text-sm text-gray-300">
                {reservations.length} active booking
                {reservations.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-200">Total Spent</p>
              <p className="text-white font-bold">
                Rp{' '}
                {reservations
                  .reduce((sum, r) => sum + parseInt(r.price), 0)
                  .toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reservations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {reservations.map((reservation, index) => (
          <motion.div
            key={reservation.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, type: 'spring' }}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-orange/50 transition-all group"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-orange/20 via-orange/10 to-transparent p-4 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-2xl">
                      {reservation.location?.includes('PS4')
                        ? '🎮'
                        : reservation.location?.includes('PS5')
                        ? '🎯'
                        : '🖥️'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">
                      {reservation.location}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-300 bg-white/10 px-2 py-0.5 rounded-full">
                        Pos {reservation.position}
                      </span>
                      <div
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                          reservation.status_reserve === 'settlement'
                            ? 'bg-green-500/30 text-green-200'
                            : reservation.status_reserve === 'pending'
                            ? 'bg-yellow-500/30 text-yellow-200'
                            : 'bg-red-500/30 text-red-200'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                        {reservation.status_reserve}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
              {/* Date & Time Info */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                  <div className="w-8 h-8 bg-orange/20 rounded-lg flex items-center justify-center">
                    <HiOutlineCalendar className="w-4 h-4 text-orange" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-200 text-xs">Date</p>
                    <p className="text-white text-sm font-semibold">
                      {new Date(reservation.reserve_date).toLocaleDateString(
                        'id-ID',
                        {
                          day: 'numeric',
                          month: 'short',
                        },
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                  <div className="w-8 h-8 bg-orange/20 rounded-lg flex items-center justify-center">
                    <FaClock className="w-4 h-4 text-orange" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-200 text-xs">Duration</p>
                    <p className="text-white text-sm font-semibold">
                      {reservation.reserve_start_time.slice(0, 5)} -{' '}
                      {reservation.reserve_end_time.slice(0, 5)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-gradient-to-r from-orange/15 via-orange/10 to-orange/5 border border-orange/30 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    <span className="text-gray-300 text-sm font-medium">
                      Total
                    </span>
                  </div>
                  <span className="text-white text-xl font-bold">
                    Rp {parseInt(reservation.price).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Saving Times Section */}
              <div className="pt-3 border-t border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange/20 rounded-lg flex items-center justify-center">
                      <span className="text-xs">⏱️</span>
                    </div>
                    <h5 className="text-white font-semibold text-sm">
                      Saved Times
                    </h5>
                  </div>

                  {(!reservation.saving_times ||
                    reservation.saving_times.length === 0) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddSavingTime(reservation)}
                      className="text-xs text-gray-200 bg-orange/20 hover:bg-orange/30 font-semibold px-3 py-1.5 rounded-lg border border-orange/40 transition-all flex items-center gap-1"
                    >
                      <span>+</span> Add
                    </motion.button>
                  )}
                </div>

                {reservation.saving_times &&
                reservation.saving_times.length > 0 ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-orange/30 scrollbar-track-white/5">
                    {reservation.saving_times.map((saveTime) => (
                      <motion.div
                        key={saveTime.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-white/10 to-white/5 border border-white/10 rounded-lg hover:border-orange/30 transition-all"
                      >
                        <div className="w-8 h-8 bg-orange/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaClock className="w-3 h-3 text-orange" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium">
                            {new Date(saveTime.date_saving).toLocaleDateString(
                              'id-ID',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              },
                            )}
                          </p>
                          <p className="text-gray-200 text-xs">
                            {saveTime.start_time_saving.slice(0, 5)} -{' '}
                            {saveTime.end_time_saving.slice(0, 5)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 px-3 bg-white/5 rounded-lg border border-dashed border-white/20">
                    <p className="text-gray-200 text-xs">No saved times yet</p>
                  </div>
                )}
              </div>

              {/* Invoice Button */}
              {reservation.invoice && (
                <motion.a
                  href={`${apiBaseUrl}/storage/${reservation.invoice}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange to-orange-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-orange/50 transition-all"
                >
                  <span>📄</span>
                  View Invoice
                </motion.a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Saving Time Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border border-white/30 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange to-orange-600 rounded-xl flex items-center justify-center">
                    <FaClock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Add Saving Time
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-all"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date_saving}
                    onChange={(e) =>
                      setFormData({ ...formData, date_saving: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-orange focus:ring-2 focus:ring-orange/50 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.start_time_saving}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          start_time_saving: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-orange focus:ring-2 focus:ring-orange/50 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.end_time_saving}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          end_time_saving: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-orange focus:ring-2 focus:ring-orange/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-orange/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Time'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
