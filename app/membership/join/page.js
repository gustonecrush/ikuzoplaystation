'use client'

import { useState } from 'react'
import axios from 'axios'
import { apiBaseUrl } from '@/utils/urls'
import Toast from '@/app/components/Toast'
import { useRouter } from 'next/navigation'

export default function JoinMembershipPage() {
  const [form, setForm] = useState({
    full_name: '',
    phone_number: '62',
    whatsapp_number: '62',
    username: '',
    birth_date: '',
    password: '',
    awareness_source: [],
    other_awareness: '',
  })

  const router = useRouter()

  const [sameAsPhone, setSameAsPhone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [passwordError, setPasswordError] = useState('')

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

  const validatePassword = (password) => {
    if (password.length < 6) return 'Minimal 6 karakter'
    if (!/\d/.test(password)) return 'Harus mengandung angka'
    if (!/[a-zA-Z]/.test(password)) return 'Harus mengandung huruf'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const err = validatePassword(form.password)
    if (err) {
      setPasswordError(err)
      return
    }

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
      const res = await axios.post(
        `${apiBaseUrl}/customer/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

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

      Toast.fire({
        icon: 'error',
        title: 'Oopsss!',
        text: msg,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="min-h-screen px-6 py-12 max-w-xl mx-auto font-plusSansJakarta flex items-center justify-center bg-gradient-to-br from-[rgb(246,205,164)] via-[#f7a54e] to-[#ff6a00]0">
      <div className="w-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-orange text-center">
          🚀 <br />
          JOIN IKUZO MEMBERSHIP
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 text-white placeholder:text-gray-400"
        >
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-1 text-orange">
              Nomor Telepon
            </label>
            <input
              type="text"
              value={form.phone_number}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, '')
                if (!val.startsWith('62')) val = '62' + val
                setForm((prev) => ({
                  ...prev,
                  phone_number: val,
                  ...(sameAsPhone ? { whatsapp_number: val } : {}),
                }))
              }}
              className="w-full rounded-md px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-white placeholder:text-gray-400"
              placeholder="628xxxxxxxxxx"
            />
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-sm font-medium mb-1 text-orange">
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
              className="w-full rounded-md px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-white placeholder:text-gray-400"
              placeholder="628xxxxxxxxxx"
              disabled={sameAsPhone}
            />
            <label className="flex items-center gap-2 mt-2 text-sm">
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
            <label className="block text-sm font-medium mb-1 text-orange">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full rounded-md px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 placeholder-white/70"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1 text-orange">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full rounded-md px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 placeholder-white/70"
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium mb-1 text-orange">
              Tanggal Lahir
            </label>
            <input
              type="date"
              value={form.birth_date}
              onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
              className="w-full rounded-md px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 placeholder-white/70"
            />
          </div>

          {/* Awareness Source */}
          <div>
            <label className="block text-sm font-medium mb-2 text-orange">
              Dari mana kamu tahu IKUZO?
            </label>
            <div className="flex flex-wrap gap-3 text-white placeholder:text-gray-400/90">
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

            {/* Conditionally show textarea for 'Lainnya' */}
            {isOtherSelected && (
              <textarea
                value={form.other_awareness}
                onChange={(e) =>
                  setForm({ ...form, other_awareness: e.target.value })
                }
                placeholder="Tulis sumber lainnya di sini..."
                className="mt-4 w-full rounded-md px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 placeholder-white/70"
              />
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-orange">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value })
                setPasswordError(validatePassword(e.target.value))
              }}
              className="w-full rounded-md px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 placeholder-white/70"
            />
            {passwordError && (
              <p className="text-red-600 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 justify-center px-7 py-3 rounded-full bg-orange hover:bg-orange text-white placeholder:text-gray-400 font-semibold text-lg shadow-md transition-transform hover:scale-105 w-full"
            >
              {submitting ? 'Mendaftar...' : 'Join Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
