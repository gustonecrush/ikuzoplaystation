'use client'

import React, { useRef, useState } from 'react'

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

import { EffectCoverflow, Pagination } from 'swiper/modules'

import './styles.css'
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

const SwiperContentGames = ({ children }) => {
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
        className="mySwiper"
      >
        <SwiperSlide className="w-[300px] swiper-slide2">
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
              className="rounded-md !w-[300px] !h-[300px]"
              src="https://i.ibb.co/Kh67bXm/A-way-out.webp"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide className="!w-[300px]">
          <img
            className="rounded-md !w-[300px] !h-[300px]"
            src="https://i.ibb.co/khTTCzJ/Naruto-Strom-4.webp"
          />
        </SwiperSlide>
        <SwiperSlide className="!w-[300px]">
          <img
            className="rounded-md !w-[300px] !h-[300px]"
            src="https://i.ibb.co/jr9HPtx/spiderman.png"
          />
        </SwiperSlide>
        <SwiperSlide className="!w-[300px]">
          <img
            className="rounded-md !w-[300px] !h-[300px]"
            src="https://i.ibb.co/3RV6GGr/Aotennis-2.jpg"
          />
        </SwiperSlide>
        <SwiperSlide className="!w-[300px]">
          <img
            className="rounded-md !w-[300px] !h-[300px]"
            src="https://i.ibb.co/WKkZrgF/Astro-Playroom.webp"
          />
        </SwiperSlide>
        <SwiperSlide className="!w-[300px]">
          <img
            className="rounded-md !w-[300px] !h-[300px]"
            src="https://i.ibb.co/4WYM4GC/2k-drive.png"
          />
        </SwiperSlide>
        <SwiperSlide className="w-[300px] swiper-slide2">
          <img
            className="rounded-md !w-[300px] !h-[300px]"
            src="https://i.ibb.co/4tWMKL6/ultimate-ninja-5-1-final-1655137135122.jpg"
          />
        </SwiperSlide>
        <SwiperSlide className="w-[300px] swiper-slide2">
          <img
            className="rounded-md !w-[300px] !h-[300px]"
            src="https://i.ibb.co/Y04DbxG/Alienation.webp"
          />
        </SwiperSlide>
      </Swiper>
    </>
  )
}

export default SwiperContentGames
