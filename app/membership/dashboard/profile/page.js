'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Toast from '@/app/components/Toast'
import { apiBaseUrl } from '@/utils/urls'
import LoaderHome from '@/app/components/LoaderHome'

export default function EditProfilePage() {
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    phone_number: '',
    whatsapp_number: '',
    username: '',
    birth_date: '',
    awareness_source: '',
  })

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/customer/profile`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('XSRF_CUST')}`,
        },
      })
      console.log({ res })
      setUser(res.data)
      setForm({
        full_name: res.data.full_name || '',
        phone_number: res.data.phone_number || '',
        whatsapp_number: res.data.whatsapp_number || '',
        username: res.data.username || '',
        birth_date: res.data.birth_date || '',
        awareness_source: res.data.awareness_source || '',
      })
    } catch (err) {
      console.error({ err })
      Toast.fire({
        icon: 'error',
        title: 'Gagal memuat data profil',
      })
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.put(`${apiBaseUrl}/customer/profile`, form, {
        headers: {
          Authorization: `Bearer ${Cookies.get('XSRF_CUST')}`,
          'Content-Type': 'application/json',
        },
      })

      Toast.fire({
        icon: 'success',
        title: 'Profil berhasil diperbarui!',
      })

      setEditing(false)
      fetchProfile() // refresh data
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: err?.response?.data?.message || 'Gagal menyimpan profil',
      })
    }
  }

  if (!user) return <LoaderHome />

  return (
    <section className="max-w-xl mx-auto py-12 px-6 font-plusSansJakarta">
      <h1 className="text-3xl font-bold mb-6 text-[#FF6200] text-center">
        Profil Anggota
      </h1>

      {!editing ? (
        <div className="space-y-4 text-sm">
          <p>
            <strong>Nama Lengkap:</strong> {user.full_name}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Nomor Telepon:</strong> {user.phone_number}
          </p>
          <p>
            <strong>Nomor WhatsApp:</strong> {user.whatsapp_number}
          </p>
          <p>
            <strong>Tanggal Lahir:</strong> {user.birth_date}
          </p>
          <p>
            <strong>Sumber Info:</strong> {user.awareness_source}
          </p>
          <button
            onClick={() => setEditing(true)}
            className="mt-6 bg-[#FF6200] hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-full"
          >
            Edit Profil
          </button>{' '}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full border rounded-md px-4 py-2"
              required
            />
          </div>

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

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nomor Telepon
            </label>
            <input
              type="text"
              value={form.phone_number}
              onChange={(e) =>
                setForm({ ...form, phone_number: e.target.value })
              }
              className="w-full border rounded-md px-4 py-2"
              required
            />
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nomor WhatsApp
            </label>
            <input
              type="text"
              value={form.whatsapp_number}
              onChange={(e) =>
                setForm({ ...form, whatsapp_number: e.target.value })
              }
              className="w-full border rounded-md px-4 py-2"
              required
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tanggal Lahir
            </label>
            <input
              type="date"
              value={form.birth_date}
              onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
              className="w-full border rounded-md px-4 py-2"
              required
            />
          </div>

          {/* Awareness Source */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Dari Mana Tahu IKUZO
            </label>
            <input
              type="text"
              value={form.awareness_source}
              onChange={(e) =>
                setForm({ ...form, awareness_source: e.target.value })
              }
              className="w-full border rounded-md px-4 py-2"
              required
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="border px-4 py-2 rounded-md text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-[#FF6200] text-white px-6 py-2 rounded-md text-sm hover:bg-orange-600"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
