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
      fetchProfile()
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: err?.response?.data?.message || 'Gagal menyimpan profil',
      })
    }
  }

  if (!user) return <LoaderHome />

  return (
    <section className="min-h-screen py-12 px-6 font-plusSansJakarta bg-gradient-to-br from-orange-500 via-[#FF6200] to-orange-700">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white text-center drop-shadow-lg">
          Profil Anggota
        </h1>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          {!editing ? (
            <div className="space-y-4 text-white">
              <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <strong className="text-orange-200">Nama Lengkap:</strong>
                <p className="mt-1">{user.full_name}</p>
              </div>
              <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <strong className="text-orange-200">Username:</strong>
                <p className="mt-1">{user.username}</p>
              </div>
              <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <strong className="text-orange-200">Nomor Telepon:</strong>
                <p className="mt-1">{user.phone_number}</p>
              </div>
              <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <strong className="text-orange-200">Nomor WhatsApp:</strong>
                <p className="mt-1">{user.whatsapp_number}</p>
              </div>
              <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <strong className="text-orange-200">Tanggal Lahir:</strong>
                <p className="mt-1">{user.birth_date}</p>
              </div>
              <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <strong className="text-orange-200">Sumber Info:</strong>
                <p className="mt-1">{user.awareness_source}</p>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="mt-6 w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-4 py-3 rounded-xl border border-white/30 transition-all duration-300 hover:scale-105"
              >
                Edit Profil
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-white/90">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/25 transition-all"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/90">
                  Username
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/25 transition-all"
                  placeholder="Masukkan username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/90">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  value={form.phone_number}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '')
                    if (val && !val.startsWith('0')) val = '0' + val
                    setForm({ ...form, phone_number: val })
                  }}
                  className="w-full rounded-xl px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/25 transition-all"
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/90">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  value={form.whatsapp_number}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '')
                    if (val && !val.startsWith('0')) val = '0' + val
                    setForm({ ...form, whatsapp_number: val })
                  }}
                  className="w-full rounded-xl px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/25 transition-all"
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </div>


              <div>
                <label className="block text-sm font-medium mb-2 text-white/90">
                  Dari Mana Tahu IKUZO
                </label>
                <input
                  type="text"
                  value={form.awareness_source}
                  onChange={(e) => setForm({ ...form, awareness_source: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/25 transition-all"
                  placeholder="Instagram, Teman, dll"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-white/30 transition-all duration-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-white/30 hover:bg-white/40 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl border border-white/40 transition-all duration-300 hover:scale-105"
                >
                  Simpan
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}