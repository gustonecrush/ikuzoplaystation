'use client'

import React, { useRef, useState } from 'react'

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

import { EffectCoverflow, Pagination } from 'swiper/modules'

import './styles2.css'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { AiOutlineDelete } from 'react-icons/ai'

const SwiperContentFacilities = ({ children }) => {
  return (
    <>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        initialSlide={4}
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
        <SwiperSlide className="w-[700px]">
          <div className="relative">
            <form action="" method="post" className="absolute top-4 right-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="ml-auto border border-red-500 bg-red-500 hover:bg-red-300 bg-opacity-10 hover:text-red-500 text-base text-red-500"
                  >
                    <AiOutlineDelete className="h-7 w-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </form>
            <img
              className="rounded-md"
              src="https://i.ibb.co/2FCP3dS/regular-plus.png"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide className="w-[700px]">
          <img
            className="rounded-lg w-[700px]"
            src="https://i.ibb.co/rQznhYC/ps2.png"
          />
        </SwiperSlide>
        <SwiperSlide className="w-[700px]">
          <img
            className="rounded-lg w-[700px]"
            src="https://i.ibb.co/khhvvWY/vip-plus.png"
          />
        </SwiperSlide>
        <SwiperSlide className="w-[700px]">
          <img
            className="rounded-lg w-[700px]"
            src="https://i.ibb.co/mC9q8X2/regular.png"
          />
        </SwiperSlide>
        <SwiperSlide className="w-[700px]">
          <img
            className="rounded-lg w-[700px]"
            src="https://i.ibb.co/Wyf3KvL/simulator.png"
          />
        </SwiperSlide>
      </Swiper>
    </>
  )
}

export default SwiperContentFacilities
