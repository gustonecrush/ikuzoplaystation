'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Toast from '@/app/components/Toast'
import { apiBaseUrl } from '@/utils/urls'
import { useFetchMembershipTier } from '@/hooks/membership/useFetchMembershipTier'
import Cookies from 'js-cookie'
import LoaderHome from '@/app/components/LoaderHome'
import MembershipCheckout from '@/app/components/Membership/MembershipCheckout'
import { motion } from 'framer-motion'
import { Video } from '@/app/components/Home'
import NavbarMembership from '@/app/components/NavbarMembership'

export default function CustomerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [currentTier, setCurrentTier] = useState(null)
  const [loading, setLoading] = useState(true)
  const { data: allTiers } = useFetchMembershipTier()

  const handleLogout = async () => {
    try {
      await axios.post(`${apiBaseUrl}/customer/logout`, null, {
        headers: {
          Authorization: `Bearer ${Cookies.get('XSRF_CUST')}`,
        },
      })

      Toast.fire({ icon: 'success', title: 'Berhasil logout' })
      Cookies.remove('XSRF_CUST')

      setTimeout(() => router.push('/membership/login'), 1000)
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: err?.response?.data?.message || 'Gagal logout',
      })
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/customer/profile`, {
          headers: { Authorization: `Bearer ${Cookies.get('XSRF_CUST')}` },
        })
        setUser(res.data)

        if (res.data.membership_tier_id) {
          const tierRes = await axios.get(
            `${apiBaseUrl}/membership-tiers/${res.data.id}`,
          )
          setCurrentTier(tierRes.data)
        }
      } catch (err) {
        Toast.fire({ icon: 'error', title: 'Gagal memuat data pengguna' })
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
    document.body.appendChild(script)

    return () => document.body.removeChild(script)
  }, [])

  if (loading) return <LoaderHome />

  return (
    <section className="flex flex-col h-full w-full relative overflow-x-hidden">
      {/* Navbar */}
      <NavbarMembership />

      {/* Video background */}
      <div className="absolute inset-0 -z-10">
        <Video />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="min-h-screen w-full bg-gradient-to-br from-orange/40 to-black/60 backdrop-blur-2xl p-6 pt-36 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto rounded-2xl shadow-2xl bg-white/20 border border-white/30 p-8"
        >
          <h1 className="text-3xl font-bold mb-6 text-white drop-shadow-md text-center">
            Dashboard Member IKUZO
          </h1>

          {/* Active Membership */}
          {/* {currentTier ? (
            <div className="bg-white/20 border border-white/30 rounded-2xl p-6 shadow-lg mb-10 text-white">
              <h2 className="text-xl font-semibold mb-2 text-[#FF6200]">
                Keanggotaan Aktif: {currentTier.icon} {currentTier.full_name}
              </h2>
              <div
                className="prose prose-sm text-white/80"
                dangerouslySetInnerHTML={{ __html: currentTier.benefits }}
              />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4 text-white">
                Pilih Membership
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {allTiers?.map((tier) => (
                  <motion.div
                    key={tier.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="cursor-pointer bg-white/20 border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-orange-500/30 transition-all text-white"
                  >
                    <h2 className="text-xl font-semibold mb-2">
                      {tier.icon} {tier.full_name}
                    </h2>
                    <p className="text-sm text-white/70 mb-4">
                      Rp {Number(tier.price).toLocaleString()}
                    </p>
                    <div
                      className="prose text-sm text-white/70 prose-li:mb-0"
                      dangerouslySetInnerHTML={{ __html: tier.benefits }}
                    />
                    {user && <MembershipCheckout tier={tier} user={user} />}
                  </motion.div>
                ))}
              </div>
            </>
          )} */}

          <div className="flex flex-col justify-center items-center min-h-screen gap-4 px-10">
            <Image
              src={'/error.png'}
              alt="Failed Pay"
              title={'Failed Pay'}
              width={0}
              height={0}
              className="w-[300px] h-fit object-contain"
            />
            <div className="flex flex-col gap-1 items-center mt-7 text-center">
              <h1 className="text-xl font-semibold">
                Benefits and Save Time Not Available!
              </h1>
              <p className="text-sm text-gray-400">
                This features are in development right now, you can utilize
                these feature after development proccess
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
