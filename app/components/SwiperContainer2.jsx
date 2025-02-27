'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

import { EffectCoverflow, Pagination } from 'swiper/modules'

import '../admin/dashboard/components/styles2.css'

import Image from 'next/image'
import Toast from './Toast'
import axios from 'axios'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { InfoIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import getDocument from '@/firebase/firestore/getData'
import { getSpaceCategory } from '@/utils/text'

export default function SwiperContainer2() {
  const [facilities, setFacilities] = React.useState([])

  const fetchContents = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/content-facilities`,
      )
      if (response.status == 200) {
        const jsonData = await response.data
        setFacilities(jsonData.data)
      } else {
        console.error({ error })
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      console.error({ error })
      if (error.code == 'ERR_NETWORK') {
        Toast.fire({
          icon: 'error',
          title: `Data tidak dapat ditampilkan. Koneksi anda terputus, cek jaringan anda!`,
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: `Internal server sedang error, coba lagi nanti!`,
        })
      }
    }
  }

  React.useEffect(() => {
    fetchContents()
  }, [])

  return (
    <section className="-mt-4 px-8 md:px-0">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        initialSlide={2}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination]}
        className="mySwiper mx-10"
      >
        {facilities.map((facility, index) => (
          <SwiperSlide key={index} className="md:!w-[700px] relative">
            <DrawerInfoFacility facility={facility} />
            <Image
              alt={facility.name}
              width={0}
              height={0}
              className="rounded-lg"
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${facility.pict}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

function DrawerInfoFacility({ facility }) {
  const [privateSpaceData, setPrivateSpaceData] = React.useState(null)
  const [regularSpaceData, setRegularSpaceData] = React.useState(null)
  const [premiumSpaceData, setPremiumSpaceData] = React.useState(null)

  async function fetchDataTimes() {
    try {
      const responses = await Promise.all([
        getDocument('space-setting-times', 'private-space-doc'), // Index 0
        getDocument('space-setting-times', 'premium-space-doc'), // Index 1
        getDocument('space-setting-times', 'regular-space-doc'), // Index 2
      ])

      // Extract data from responses
      const privateData = responses[0]?.data
      const premiumData = responses[1]?.data
      const regularData = responses[2]?.data

      // Set state with extracted values
      setPrivateSpaceData(privateData)
      setPremiumSpaceData(premiumData)
      setRegularSpaceData(regularData)
    } catch (error) {
      console.error('Error fetching space settings:', error)
    }
  }

  React.useEffect(() => {
    fetchDataTimes()
  }, [])
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="absolute right-0 m-5 top-0 rounded-full w-12 h-12 flex items-center justify-center bg-orange text-white">
          <InfoIcon className="w-6 h-6" />
        </div>
      </DrawerTrigger>

      <DrawerContent className="active:border-none z-[1200] border-none outline-none md:max-w-3xl md:mx-auto">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-xl">{facility.name}</DrawerTitle>
          <DrawerDescription>
            IDR {facility.price}/hour and can only accomodate{' '}
            {facility.capacity} person.
          </DrawerDescription>
          {privateSpaceData == null ||
          premiumSpaceData == null ||
          regularSpaceData == null ? (
            <></>
          ) : (
            <DrawerDescription className="flex flex-col gap-0 mt-0 pt-0">
              <span>Available on : </span>
              {(getSpaceCategory(facility.name) === 'regular-space' &&
                regularSpaceData.times) ||
              (getSpaceCategory(facility.name) === 'private-space' &&
                privateSpaceData.times) ||
              (getSpaceCategory(facility.name) === 'premium-space' &&
                premiumSpaceData.times)
                ? (getSpaceCategory(facility.name) === 'regular-space'
                    ? regularSpaceData.times
                    : getSpaceCategory(facility.name) === 'private-space'
                    ? privateSpaceData.times
                    : premiumSpaceData.times
                  ).map((time, index) => (
                    <span key={index}>
                      • {time['time-day']} - {time['time-set']['start-time']} -{' '}
                      {time['time-set']['end-time']}
                    </span>
                  ))
                : null}
            </DrawerDescription>
          )}
        </DrawerHeader>

        <div className="flex-relative w-full h-fit px-4">
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${facility.pict}`}
              useMap="#image-map"
              alt={facility.name}
              width={0}
              height={0}
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
        </div>

        <div
          className="prose-sm prose-li:list-disc px-4 prose-li:m-0 prose-li:p-0 "
          dangerouslySetInnerHTML={{
            __html: facility && facility.benefits,
          }}
        ></div>

        <DrawerFooter className="pt-2">
          <Link href={'/reservation'} className="w-full">
            <Button
              variant="outline"
              className={`bg-orange w-full text-white border-orange py-5`}
            >
              Reserve Now
            </Button>
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
