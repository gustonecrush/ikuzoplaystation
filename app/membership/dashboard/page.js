'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Toast from '@/app/components/Toast'
import { apiBaseUrl } from '@/utils/urls'
import { useFetchMembershipTier } from '@/hooks/membership/useFetchMembershipTier'
import Cookies from 'js-cookie'
import { HashLoader } from 'react-spinners'
import LoaderHome from '@/app/components/LoaderHome'
import MembershipCheckout from '@/app/components/Membership/MembershipCheckout'

export default function CustomerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [currentTier, setCurrentTier] = useState(null)
  const [loading, setLoading] = useState(true)
  const { data: allTiers } = useFetchMembershipTier()

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${apiBaseUrl}/customer/logout`, null, {
        headers: {
          Authorization: `Bearer ${Cookies.get('XSRF_CUST')}`,
        },
      })

      Toast.fire({
        icon: 'success',
        title: 'Berhasil logout',
      })

      // Clear token (optional, if needed)
      Cookies.remove('XSRF_CUST')

      setTimeout(() => {
        router.push('/membership/login')
      }, 1000)
      console.log({ res })
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: err?.response?.data?.message || 'Gagal logout',
      })

      console.error({ err })
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/customer/profile`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('XSRF_CUST')}`,
          },
        })
        console.log({ res })
        setUser(res.data)
        if (res.data.membership_tier_id) {
          const tierRes = await axios.get(
            `${apiBaseUrl}/membership-tiers/${res.data.id}`,
          )
          setCurrentTier(tierRes.data)
        }
      } catch (err) {
        Toast.fire({
          icon: 'error',
          title: 'Gagal memuat data pengguna',
        })
        console.error({ err })
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    const snapScript = 'https://app.midtrans.com/snap/snap.js'
    const clientKey = process.env.NEXT_PUBLIC_CLIENT

    const script = document.createElement('script')
    script.src = snapScript
    script.setAttribute('data-client-key', clientKey)
    script.async = true

    // ✅ Append to <head> or <body>
    document.body.appendChild(script)

    return () => {
      // Optional cleanup if user navigates away
      document.body.removeChild(script)
    }
  }, [])

  if (loading) return <LoaderHome />

  return (
    <section className="min-h-screen px-6 py-12 max-w-5xl mx-auto font-plusSansJakarta">
      <h1 className="text-3xl font-bold mb-6 text-[#FF6200] text-center">
        Dashboard Member IKUZO
      </h1>

      <div className="flex justify-end gap-4 mb-8">
        <button
          onClick={() => router.push('/membership/dashboard/profile')}
          className="text-sm border px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Edit Profil
        </button>
        <button
          onClick={() =>
            router.push('/membership/dashboard/profile/reset-password')
          }
          className="text-sm border px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Reset Password
        </button>
        <button
          onClick={handleLogout}
          className="text-sm border px-4 py-2 rounded hover:bg-red-50 transition text-red-500 border-red-300"
        >
          Logout
        </button>
      </div>

      {/* Active Membership */}
      {currentTier ? (
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-xl font-semibold mb-2 text-[#FF6200]">
            Keanggotaan Aktif: {currentTier.icon} {currentTier.full_name}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Rp {Number(currentTier.price).toLocaleString()}
          </p>
          <div
            className="prose prose-sm text-sm"
            dangerouslySetInnerHTML={{ __html: currentTier.benefits }}
          />
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Pilih Membership</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {allTiers?.map((tier) => (
              <div
                key={tier.id}
                className="border rounded-xl p-6 shadow-md hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {tier.icon} {tier.full_name}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Rp {Number(tier.price).toLocaleString()}
                </p>
                <div
                  className="prose text-sm space-y-1"
                  dangerouslySetInnerHTML={{ __html: tier.benefits }}
                />

                {/* Checkout button here */}
                {user && <MembershipCheckout tier={tier} user={user} />}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
