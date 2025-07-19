'use client'

import Image from 'next/image'
import React from 'react'

import { Fade } from 'react-awesome-reveal'
import Layout from '../components/Layout'
import MembershipTiers from '../components/Membership/MembershipTiers'
import MembershipCustomers from '../components/Membership/MembershipCustomers'
import MembershipCustomerTransactions from '../components/Membership/MembershipCustomerTransactions'

function page() {
  const features = [
    {
      id: 'customers',
      name: 'Customers',
      desc: 'Checking memberships',
      img: '/membership.png',
    },
    {
      id: 'memberships',
      name: 'Transactions',
      desc: 'Checking transactions',
      img: '/payment.png',
    },
    {
      id: 'tiers',
      name: 'Tiers',
      desc: 'Custom membership tiers',
      img: '/tier.png',
    },
  ]
  const [selectedFeature, setSelectedFeature] = React.useState('customers')

  return (
    <Layout>
      <section className="flex flex-col pt-3 w-full bg-white h-full overflow-y-scroll">
        <>
          <div className=" w-fit py-5 px-7 text-black bg-white rounded-lg  flex flex-row gap-3 items-center">
            <Fade>
              <Image
                src={'/reserve.png'}
                width={0}
                height={0}
                alt={'Reservation'}
                className="w-20"
              />
            </Fade>

            <Fade>
              <div className="flex flex-col">
                <h1 className="text-4xl font-semibold">Membership </h1>
                <p className="text-base font-normal text-gray-400">
                  Monitoring layanan membership Ikuzo Playstation
                </p>
              </div>
            </Fade>

            <div className="flex flex-row gap-4 w-full">
              {features.map((feature, index) => (
                <div
                  key={index}
                  onClick={(e) => {
                    setSelectedFeature(feature.id)
                    fetchContents()
                  }}
                  className={`flex w-full hover:scale-110 duration-1000 cursor-pointer items-center px-2 py-3 justify-center ${
                    selectedFeature == feature.id
                      ? 'bg-orange bg-opacity-5'
                      : 'bg-white'
                  } rounded-lg shadow-md`}
                >
                  <div className="flex flex-row items-center gap-3 justify-center">
                    <Image
                      src={feature.img}
                      alt={'Content Games'}
                      width={0}
                      height={0}
                      className="w-[55px] py-4"
                    />

                    <div className="flex flex-col justify-start items-start">
                      <h1 className="text-lg font-semibold leading-none">
                        {feature.name}
                      </h1>
                      <p className={`text-base font-normal text-gray-400`}>
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedFeature == 'customers' && <MembershipCustomers />}
          {selectedFeature == 'memberships' && (
            <MembershipCustomerTransactions />
          )}

          {selectedFeature == 'tiers' && <MembershipTiers />}
        </>
      </section>
    </Layout>
  )
}

export default page
