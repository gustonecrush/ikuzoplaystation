'use client'

import { useState, useTransition } from 'react'
import axios from 'axios'
import { apiBaseUrl } from '@/utils/urls'
import Toast from '@/app/components/Toast'
import { Eye, EyeOff } from 'lucide-react'
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
  onOpenChange,
  onSuccess,
}) {
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

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev)

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
      onOpenChange(false)
    } catch (err) {
      const msg =
        err?.response?.data?.message || 'Terjadi kesalahan saat mendaftar'
      Toast.fire({ icon: 'error', title: 'Oopsss!', text: msg })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-orange text-center">
            🚀 Join IKUZO Membership
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground text-center">
            Daftar untuk bergabung dengan komunitas IKUZO sekarang juga.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 text-orange">
          {/* Phone */}
          <div>
            <label className="text-sm font-medium">Nomor Telepon</label>
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
              className="input-style"
              placeholder="628xxxxxxxxxx"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="text-sm font-medium">Nomor WhatsApp</label>
            <input
              type="text"
              value={form.whatsapp_number}
              onChange={(e) =>
                setForm({
                  ...form,
                  whatsapp_number: e.target.value.replace(/\D/g, ''),
                })
              }
              className="input-style"
              placeholder="628xxxxxxxxxx"
              disabled={sameAsPhone}
            />
            <label className="flex items-center gap-2 mt-1 text-sm">
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
              />
              Sama dengan nomor telepon
            </label>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-sm font-medium">Nama Lengkap</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="input-style"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="input-style"
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="text-sm font-medium">Tanggal Lahir</label>
            <input
              type="date"
              value={form.birth_date}
              onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
              className="input-style"
            />
          </div>

          {/* Awareness Source */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Dari mana tahu IKUZO?
            </label>
            <div className="flex flex-wrap gap-3 text-sm">
              {awarenessOptions.map((opt) => (
                <label key={opt} className="flex items-center gap-2">
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
                placeholder="Tulis sumber lainnya..."
                className="mt-2 w-full rounded-md px-3 py-2 border bg-white/20 backdrop-blur border-white/30"
              />
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-style pr-10"
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

          <AlertDialogFooter className="pt-4">
            <AlertDialogCancel type="button">Batal</AlertDialogCancel>
            <button
              type="submit"
              disabled={submitting}
              className="bg-orange text-white font-semibold rounded-md px-6 py-2 shadow hover:brightness-110 transition"
            >
              {submitting ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
