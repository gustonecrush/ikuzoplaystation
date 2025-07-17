import React from 'react'
import { useFetchMembershipTier } from '@/hooks/membership/useFetchMembershipTier'

export default function MembershipCards() {
  const { data, loading, error } = useFetchMembershipTier()

  if (loading) return <p className="text-center">Loading...</p>
  if (error) return <p className="text-center text-red-500">Error: {error}</p>

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {Array.isArray(data) &&
        data.map((tier, index) => (
          <div
            key={tier.id}
            className={`rounded-2xl p-6 shadow-md hover:shadow-xl transition border ${
              index === 0 ? 'bg-white' : 'bg-orange-50 border-[#FF6200]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-[#FF6200]">
                {tier.icon} {tier.full_name}
              </h2>
              <span className="text-sm font-semibold text-gray-700">
                Rp {Number(tier.price).toLocaleString()}
              </span>
            </div>
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: tier.benefits }}
            />
          </div>
        ))}
    </div>
  )
}
