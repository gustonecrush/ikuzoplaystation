'use client'

import Link from 'next/link'
import React from 'react'
import MembershipCards from '../components/Membership/MembershipCards'

function MembershipPage() {
  const isMember = false

  return (
    <section className="min-h-screen font-plusSansJakarta bg-gradient-to-br from-[rgb(246,205,164)] via-[#f9a143] to-[#ff6a00] text-[#111827] px-6 py-14">
      <div className="max-w-4xl mx-auto space-y-1 text-center">
        <div className="p-[2px] rounded-2xl  shadow-lg hover:shadow-2xl transition hover:scale-[1.02] ">
          <div className="flex flex-col p-6 mx-auto max-w-screen-xl text-center text-gray-900 rounded-[14px] bg-white/10 backdrop-blur-md dark:text-white">
            <h1 className="text-5xl  font-extrabold text-orange drop-shadow-sm animate-fade-in font-dynaPuff">
              🚀 IKUZO Membership
            </h1>
            <p className="text-base text-neutral-100 max-w-xl mx-auto animate-fade-in delay-100 mt-4">
              Pilih paket terbaik dan nikmati berbagai keuntungan saat bermain
              di <strong>IKUZO</strong> – lebih hemat, lebih seru, lebih banyak
              bonus!
            </p>
          </div>
        </div>

        <div className="animate-fade-in delay-200">
          <MembershipCards />
        </div>

        <div className=" animate-fade-in delay-300">
          <Link
            href={isMember ? '/login' : '/membership/join'}
            className="inline-flex items-center gap-2 justify-center px-7 py-3 rounded-full bg-orange hover:bg-orange text-white font-semibold text-lg shadow-md transition-transform hover:scale-105"
          >
            {isMember ? '🔐 Log In to Membership' : '🔥 Join Membership Now'}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default MembershipPage
