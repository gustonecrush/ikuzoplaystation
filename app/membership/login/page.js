'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Toast from '@/app/components/Toast'
import Cookies from 'js-cookie'
import { Eye, EyeOff } from 'lucide-react'

const base_url = 'https://api.ikuzoplaystation.com' // adjust if needed

export default function LoginPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    const formData = new FormData()
    formData.append('username', form.username)
    formData.append('password', form.password)

    try {
      const res = await axios.post(`${base_url}/api/customer/login`, formData)

      Toast.fire({
        icon: 'success',
        title: 'Yeayyy!',
        text: 'Login berhasil!',
      })

      Cookies.set('XSRF_CUST', res.data.access_token)

      // Redirect user after login
      setTimeout(() => {
        router.push('/membership/dashboard') // or /membership/choose
      }, 1000)
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        'Gagal login. Periksa kembali akun Anda.'
      console.log({ err })
      Toast.fire({
        icon: 'error',
        title: 'Oopsss!',
        text: msg,
      })
    } finally {
      setLoading(false)
    }
  }

  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <section className="min-h-screen px-6 py-12 max-w-md mx-auto font-plusSansJakarta flex items-center justify-center bg-gradient-to-br from-[rgb(246,205,164)] via-[#f7a54e] to-[#ff6a00]">
      <div className="w-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#FF6200]">
          Masuk Member IKUZO
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 text-orange">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-orange">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full rounded-md px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-orange"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-orange">
              Password
            </label>
            <div className="relative w-full">
              <input
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full rounded-md px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-orange"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
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
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#FF6200] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition disabled:opacity-50 w-full"
            >
              {loading ? 'Sedang Masuk...' : 'Masuk Sekarang'}
            </button>
          </div>
        </form>

        <p className="text-sm text-center mt-6 text-white/80">
          Belum join member?{' '}
          <a
            href="/membership/join"
            className="text-[#FF6200] font-medium hover:underline"
          >
            Join Sekarang
          </a>
        </p>
      </div>
    </section>
  )
}
