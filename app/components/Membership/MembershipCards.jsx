import React from 'react'
import { useFetchMembershipTier } from '@/hooks/membership/useFetchMembershipTier'

export default function MembershipCards() {
  const { data, loading, error } = useFetchMembershipTier()

  if (loading) return <p className="text-center">Loading...</p>
  if (error) return <p className="text-center text-red-500">Error: {error}</p>

  return (
    <section className="">
      <div className="py-12  mx-auto max-w-screen-xl lg:py-20">
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          {Array.isArray(data) &&
            data.map((tier) => (
              <div className="p-[2px] rounded-2xl  shadow-lg hover:shadow-2xl transition hover:scale-[1.02]">
                <div
                  key={tier.id}
                  className="flex flex-col p-6 mx-auto  text-center text-gray-900 rounded-[14px] bg-white/10 backdrop-blur-md dark:text-white"
                >
                  <h3 className="text-[1.3rem] font-bold flex justify-center items-center gap-2 text-orange">
                    <span>{tier.icon}</span> {tier.full_name}
                  </h3>
                  <div className="flex justify-center items-baseline my-4">
                    <span className="mr-2 text-[2.5rem] font-extrabold text-orange drop-shadow-sm">
                      Rp {Number(tier.price).toLocaleString()}
                    </span>
                    <span className="text-neutral-100 text-sm">/month</span>
                  </div>

                  <ul
                    role="list"
                    className="mb-8 space-y-4 text-left text-neutral-100"
                  >
                    {tier.benefits &&
                      tier.benefits.split('</li>').map((benefit, index) => {
                        const cleaned = benefit
                          .replace(/<li>/i, '')
                          .replace(/<\/?[^>]+(>|$)/g, '')
                          .trim()

                        if (!cleaned) return null

                        return (
                          <li
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <svg
                              className="flex-shrink-0 w-5 h-5 text-orange"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{cleaned}</span>
                          </li>
                        )
                      })}
                  </ul>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}
