'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Toast from '@/app/components/Toast'
import { apiBaseUrl } from '@/utils/urls'
import LoaderHome from '@/app/components/LoaderHome'
import { useRouter } from 'next/navigation'
import NavbarMembership from '@/app/components/NavbarMembership'
import { Video } from '@/app/components/Home'

export default function EditProfilePage() {
  const router = useRouter()
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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Button */}
            <button
              onClick={() => router.push('/membership/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <span>←</span> Kembali ke Dashboard
            </button>

            <h1 className="text-4xl font-bold text-white drop-shadow-2xl text-center">
              Profil Anggota
            </h1>

            <div className="p-[2px] rounded-2xl bg-gradient-to-br from-white/40 via-white/20 to-transparent shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex flex-col p-8 text-center text-gray-900 rounded-[14px] bg-white/10 backdrop-blur-md">
                {!editing ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4 text-left">
                      <div className="p-5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-md hover:bg-white/25 transition-all">
                        <p className="text-sm font-medium text-orange mb-1">
                          Nama Lengkap
                        </p>
                        <p className="text-white font-semibold text-lg">
                          {user.full_name}
                        </p>
                      </div>

                      <div className="p-5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-md hover:bg-white/25 transition-all">
                        <p className="text-sm font-medium text-orange mb-1">
                          Username
                        </p>
                        <p className="text-white font-semibold text-lg">
                          {user.username}
                        </p>
                      </div>

                      <div className="p-5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-md hover:bg-white/25 transition-all">
                        <p className="text-sm font-medium text-orange mb-1">
                          Nomor Telepon
                        </p>
                        <p className="text-white font-semibold text-lg">
                          {user.phone_number}
                        </p>
                      </div>

                      <div className="p-5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-md hover:bg-white/25 transition-all">
                        <p className="text-sm font-medium text-orange mb-1">
                          Nomor WhatsApp
                        </p>
                        <p className="text-white font-semibold text-lg">
                          {user.whatsapp_number}
                        </p>
                      </div>

                      <div className="p-5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-md hover:bg-white/25 transition-all">
                        <p className="text-sm font-medium text-orange mb-1">
                          Tanggal Lahir
                        </p>
                        <p className="text-white font-semibold text-lg">
                          {user.birth_date}
                        </p>
                      </div>

                      <div className="p-5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-md hover:bg-white/25 transition-all">
                        <p className="text-sm font-medium text-orange mb-1">
                          Sumber Info
                        </p>
                        <p className="text-white font-semibold text-lg">
                          {user.awareness_source}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setEditing(true)}
                      className="mt-8 w-full md:w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      ✏️ Edit Profil
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 text-left">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-white">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={form.full_name}
                          onChange={(e) =>
                            setForm({ ...form, full_name: e.target.value })
                          }
                          className="w-full rounded-xl px-4 py-3 bg-white/30 backdrop-blur-sm border-2 border-white/40 placeholder-white/70 text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white/40 transition-all"
                          placeholder="Masukkan nama lengkap"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 text-white">
                          Username
                        </label>
                        <input
                          type="text"
                          value={form.username}
                          onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                          }
                          className="w-full rounded-xl px-4 py-3 bg-white/30 backdrop-blur-sm border-2 border-white/40 placeholder-white/70 text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white/40 transition-all"
                          placeholder="Masukkan username"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 text-white">
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
                          className="w-full rounded-xl px-4 py-3 bg-white/30 backdrop-blur-sm border-2 border-white/40 placeholder-white/70 text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white/40 transition-all"
                          placeholder="08xxxxxxxxxx"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 text-white">
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
                          className="w-full rounded-xl px-4 py-3 bg-white/30 backdrop-blur-sm border-2 border-white/40 placeholder-white/70 text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white/40 transition-all"
                          placeholder="08xxxxxxxxxx"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 text-white">
                          Dari Mana Tahu IKUZO
                        </label>
                        <input
                          type="text"
                          value={form.awareness_source}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              awareness_source: e.target.value,
                            })
                          }
                          className="w-full rounded-xl px-4 py-3 bg-white/30 backdrop-blur-sm border-2 border-white/40 placeholder-white/70 text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white/40 transition-all"
                          placeholder="Instagram, Teman, dll"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl border-2 border-white/40 transition-all duration-300 hover:scale-105 shadow-lg"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold px-6 py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                      >
                        💾 Simpan
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
