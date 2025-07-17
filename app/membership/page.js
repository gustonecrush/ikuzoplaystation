'use client'

import Link from 'next/link'
import React from 'react'
import MembershipCards from '../components/Membership/MembershipCards'

function MembershipPage() {
  const isMember = false

  return (
    <section className="min-h-screen font-plusSansJakarta bg-white text-[#111827] px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold text-center text-[#FF6200]">
          IKUZO Membership
        </h1>
        <p className="text-center text-sm text-gray-600">
          Pilih paket terbaik dan nikmati berbagai keuntungan saat bermain di
          IKUZO!
        </p>

        <MembershipCards />

        <div className="text-center pt-8">
          <Link
            href={isMember ? '/login' : '/membership/join'}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#FF6200] text-white font-semibold hover:bg-orange-600 transition"
          >
            {isMember ? 'Log In to Membership' : 'Join Membership Now'}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default MembershipPage
