'use client'

import { useState } from 'react'
import axios from 'axios'
import { apiBaseUrl } from '@/utils/urls'
import Toast from '@/app/components/Toast'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

export default function MembershipFormRegistration({
  open,
  setOpen,
  onSuccess,
}) {
  const [form, setForm] = useState({
    full_name: '',
    phone_number: '',
    whatsapp_number: '',
    username: '',
    birth_date: '',
    password: '',
    awareness_source: [],
    other_awareness: '',
  })

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
      current.has(value) ? current.delete(value) : current.add(value)
      return { ...prev, awareness_source: Array.from(current) }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData()
    Object.entries(form).forEach(([key, val]) => {
      if (key === 'awareness_source') return
      formData.append(key, val)
    })

    formData.append(
      'awareness_source',
      isOtherSelected && form.other_awareness.trim()
        ? [
            ...form.awareness_source.filter((item) => item !== 'Lainnya'),
            form.other_awareness.trim(),
          ].join('.')
        : form.awareness_source.join('.'),
    )

    try {
      await axios.post(`${apiBaseUrl}/customer/register`, formData)
      Toast.fire({
        icon: 'success',
        title: 'Yeayyy!',
        text: 'Pendaftaran berhasil!',
      })
      onSuccess?.()
      setOpen(false)
    } catch (err) {
      const msg =
        err?.response?.data?.message || 'Terjadi kesalahan saat mendaftar'
      Toast.fire({ icon: 'error', title: 'Oopsss!', text: msg })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader className="space-y-3 pb-4 border-b">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-orange" />
            <AlertDialogTitle className="text-2xl font-bold text-orange">
              Join IKUZO Membership
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-center">
            Daftar sekarang dan nikmati berbagai keuntungan eksklusif
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Contact Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange/10 text-orange flex items-center justify-center text-xs">
                1
              </span>
              Informasi Kontak
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  value={form.phone_number}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '')
                    setForm((prev) => ({
                      ...prev,
                      phone_number: val,
                      ...(sameAsPhone ? { whatsapp_number: val } : {}),
                    }))
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange/20 focus:border-orange transition"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange/20 focus:border-orange transition disabled:bg-gray-50"
                  placeholder="08xxxxxxxxxx"
                  disabled={sameAsPhone}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={sameAsPhone}
                onChange={() => {
                  const checked = !sameAsPhone
                  setSameAsPhone(checked)
                  if (checked)
                    setForm((prev) => ({
                      ...prev,
                      whatsapp_number: prev.phone_number,
                    }))
                }}
                className="w-4 h-4 rounded border-gray-300 text-orange focus:ring-orange/20"
              />
              Sama dengan nomor telepon
            </label>
          </div>

          {/* Personal Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange/10 text-orange flex items-center justify-center text-xs">
                2
              </span>
              Informasi Pribadi
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange/20 focus:border-orange transition"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={form.birth_date}
                  onChange={(e) =>
                    setForm({ ...form, birth_date: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange/20 focus:border-orange transition"
                />
              </div>
            </div>
          </div>

          {/* Account Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange/10 text-orange flex items-center justify-center text-xs">
                3
              </span>
              Informasi Akun
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Username
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange/20 focus:border-orange transition"
                  placeholder="Pilih username unik"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange/20 focus:border-orange transition"
                    placeholder="Buat password kuat"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Awareness Source Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange/10 text-orange flex items-center justify-center text-xs">
                4
              </span>
              Dari mana tahu IKUZO?
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {awarenessOptions.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition has-[:checked]:border-orange has-[:checked]:bg-orange/5"
                >
                  <input
                    type="checkbox"
                    checked={form.awareness_source.includes(opt)}
                    onChange={() => handleCheckboxChange(opt)}
                    className="w-4 h-4 rounded border-gray-300 text-orange focus:ring-orange/20"
                  />
                  <span className="text-sm font-medium">{opt}</span>
                </label>
              ))}
            </div>

            {isOtherSelected && (
              <textarea
                value={form.other_awareness}
                onChange={(e) =>
                  setForm({ ...form, other_awareness: e.target.value })
                }
                placeholder="Ceritakan dari mana kamu tahu IKUZO..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange/20 focus:border-orange transition resize-none"
              />
            )}
          </div>

          <AlertDialogFooter className="pt-6 border-t gap-3">
            <AlertDialogCancel
              type="button"
              className="px-6"
              onClick={() => setOpen(false)}
            >
              Batal
            </AlertDialogCancel>
            <button
              type="submit"
              disabled={submitting}
              className="bg-orange text-white font-semibold rounded-lg px-8 py-2.5 shadow-lg shadow-orange/25 hover:shadow-xl hover:shadow-orange/30 hover:brightness-110 transition disabled:opacity-50"
            >
              {submitting ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
