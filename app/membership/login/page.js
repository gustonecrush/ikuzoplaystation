'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Toast from '@/app/components/Toast'
import Cookies from 'js-cookie'
import { Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { Video } from '@/app/components/Home'
import Navbar from '@/app/components/Navbar'
import { apiBaseUrl } from '@/utils/urls'

export default function LoginPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('username', form.username)
    formData.append('password', form.password)

    try {
      const res = await axios.post(`${apiBaseUrl}/customer/login`, formData)

      Toast.fire({
        icon: 'success',
        title: 'Yeayyy!',
        text: 'Login berhasil!',
      })

      Cookies.set('XSRF_CUST', res.data.access_token)
      Cookies.set('isLoggedIn', true) // so ReservationChoice knows

      setTimeout(() => {
        router.push('/membership/dashboard')
      }, 1000)
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        'Gagal login. Periksa kembali akun Anda.'
      console.error(err)
      Toast.fire({
        icon: 'error',
        title: 'Oopsss!',
        text: msg,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex flex-col h-full  w-full relative overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Video background */}
      <div className="absolute inset-0 -z-10">
        <Video />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Overlay */}
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-orange/40 to-black/60 backdrop-blur-2xl w-full p-6 pt-36 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md rounded-2xl shadow-2xl p-8 flex flex-col gap-6 items-center bg-white/20 backdrop-blur-2xl border border-white/30"
        >
          <h1 className="text-3xl leading-none font-bold text-white drop-shadow-md text-center">
            Masuk Member <span className="text-[#FF6200]">IKUZO</span>
          </h1>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-white/90">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full rounded-md px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-[#FF6200]"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-white/90">
                Password
              </label>
              <div className="relative w-full">
                <input
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full rounded-md px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-[#FF6200]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF6200] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition disabled:opacity-50"
              >
                {loading ? 'Sedang Masuk...' : 'Masuk Sekarang'}
              </button>
            </div>
          </form>

          <p className="text-sm text-center mt-2 text-white/80">
            Belum join member?{' '}
            <a
              href="/membership/join"
              className="text-[#FF6200] font-medium hover:underline"
            >
              Join Sekarang
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
