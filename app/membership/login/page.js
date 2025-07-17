'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Toast from '@/app/components/Toast'
import Cookies from 'js-cookie'

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
      const res = await axios.post(`${base_url}/api/customer/login`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

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

      Toast.fire({
        icon: 'error',
        title: 'Oopsss1!',
        text: msg,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-white px-6 py-12 max-w-md mx-auto font-plusSansJakarta">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#FF6200]">
        Masuk Member IKUZO
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full border rounded-md px-4 py-2"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded-md px-4 py-2"
            required
          />
        </div>

        {/* Submit */}
        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#FF6200] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition disabled:opacity-50"
          >
            {loading ? 'Sedang Masuk...' : 'Masuk Sekarang'}
          </button>
        </div>
      </form>

      <p className="text-sm text-center mt-6">
        Belum join member?{' '}
        <a
          href="/membership/join"
          className="text-[#FF6200] font-medium hover:underline"
        >
          Join Sekarang
        </a>
      </p>
    </section>
  )
}
