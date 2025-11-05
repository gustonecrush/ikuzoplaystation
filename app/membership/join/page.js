'use client'

import { useState } from 'react'
import axios from 'axios'
import { apiBaseUrl } from '@/utils/urls'
import Toast from '@/app/components/Toast'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { Video } from '@/app/components/Home'
import Navbar from '@/app/components/Navbar'

export default function JoinMembershipPage() {
  const [form, setForm] = useState({
    full_name: '',
    phone_number: '08',
    whatsapp_number: '08',
    username: '',
    birth_date: '',
    password: '',
    awareness_source: [],
    other_awareness: '',
  })

  const router = useRouter()
  const [sameAsPhone, setSameAsPhone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const awarenessOptions = [
    'Teman',
    'Instagram',
    'Tiktok',
    'Google',
    'Datang Langsung',
    'Lainnya',
  ]
  const isOtherSelected = form.awareness_source.includes('Lainnya')

  const handleCheckboxChange = (value) => {
    setForm((prev) => {
      const current = new Set(prev.awareness_source)
      if (current.has(value)) current.delete(value)
      else current.add(value)
      return { ...prev, awareness_source: Array.from(current) }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData()
    formData.append('full_name', form.full_name)
    formData.append('phone_number', form.phone_number)
    formData.append('whatsapp_number', form.whatsapp_number)
    formData.append('username', form.username)
    formData.append('birth_date', form.birth_date)
    formData.append('password', form.password)
    if (isOtherSelected && form.other_awareness.trim()) {
      formData.append(
        'awareness_source',
        [
          ...form.awareness_source.filter((item) => item !== 'Lainnya'),
          form.other_awareness.trim(),
        ].join('.'),
      )
    } else {
      formData.append('awareness_source', form.awareness_source.join('.'))
    }

    try {
      await axios.post(`${apiBaseUrl}/customer/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      Toast.fire({
        icon: 'success',
        title: 'Yeayyy!',
        text: 'Pendaftaran berhasil, silahkan login dan lanjutkan payment!',
      })

      setTimeout(() => {
        router.push('/membership/login')
      }, 1000)
    } catch (err) {
      const msg =
        err?.response?.data?.message || 'Terjadi kesalahan saat mendaftar'
      Toast.fire({ icon: 'error', title: 'Oopsss!', text: msg })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="flex flex-col h-full w-full relative overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Video background */}
      <div className="absolute inset-0 -z-10">
        <Video />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Form container */}
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-orange/40 to-black/60 backdrop-blur-2xl w-full p-6 pt-36 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl rounded-2xl shadow-2xl p-8 flex flex-col gap-6 items-center bg-white/20 backdrop-blur-2xl border border-white/30"
        >
          <h1 className="text-3xl leading-none font-bold text-white drop-shadow-md text-center">
            🚀 JOIN <span className="text-[#FF6200]">IKUZO</span> MEMBERSHIP
          </h1>

          <form onSubmit={handleSubmit} className="w-full space-y-6 text-white">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Nomor Telepon
              </label>
              <input
                type="text"
                value={form.phone_number}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, '')
                  // Pastikan selalu diawali 0
                  if (val && !val.startsWith('08')) {
                    val = '08' + val
                  }
                  setForm((prev) => ({
                    ...prev,
                    phone_number: val,
                    ...(sameAsPhone ? { whatsapp_number: val } : {}),
                  }))
                }}
                placeholder="08xxxxxxxxxx"
                className="w-full rounded-md px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-[#FF6200]"
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Nomor WhatsApp
              </label>
              <input
                type="text"
                value={form.whatsapp_number}
                onChange={(e) =>
                  setForm({
                    ...form,
                    whatsapp_number: e.target.value.replace(/\D/g, ''),
                  })
                }
                placeholder="08xxxxxxxxxx"
                disabled={sameAsPhone}
                className="w-full rounded-md px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-white disabled:opacity-70"
              />
              <label className="flex items-center gap-2 mt-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={sameAsPhone}
                  onChange={() => {
                    const checked = !sameAsPhone
                    setSameAsPhone(checked)
                    if (checked) {
                      setForm((prev) => ({
                        ...prev,
                        whatsapp_number: prev.phone_number,
                      }))
                    }
                  }}
                />
                Sama dengan nomor telepon
              </label>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
                className="w-full rounded-md px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full rounded-md px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70"
              />
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={form.birth_date}
                onChange={(e) =>
                  setForm({ ...form, birth_date: e.target.value })
                }
                className="w-full rounded-md px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70"
              />
            </div>

            {/* Awareness */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Dari mana kamu tahu IKUZO?
              </label>
              <div className="flex flex-wrap gap-3">
                {awarenessOptions.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.awareness_source.includes(opt)}
                      onChange={() => handleCheckboxChange(opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {isOtherSelected && (
                <textarea
                  value={form.other_awareness}
                  onChange={(e) =>
                    setForm({ ...form, other_awareness: e.target.value })
                  }
                  placeholder="Tulis sumber lainnya di sini..."
                  className="mt-4 w-full rounded-md px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70"
                />
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-1">
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
                  className="w-full rounded-md px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70"
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
                disabled={submitting}
                className="w-full bg-[#FF6200] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition disabled:opacity-50"
              >
                {submitting ? 'Mendaftar...' : 'Join Sekarang'}
              </button>
            </div>
          </form>

          <p className="text-sm text-center mt-2 text-white/80">
            Sudah join member?{' '}
            <a
              href="/membership/login"
              className="text-[#FF6200] font-medium hover:underline"
            >
              Login Sekarang
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
