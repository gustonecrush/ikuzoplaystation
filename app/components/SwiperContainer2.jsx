'use client'

import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

import { EffectCoverflow, Pagination } from 'swiper/modules'

import './styles.css'

export default function SwiperContainer2() {
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
        <SwiperSlide>
          <img
            className="rounded-lg"
            src="https://i.ibb.co/2FCP3dS/regular-plus.png"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img className="rounded-lg" src="https://i.ibb.co/rQznhYC/ps2.png" />
        </SwiperSlide>
        <SwiperSlide>
          <img
            className="rounded-lg"
            src="https://i.ibb.co/khhvvWY/vip-plus.png"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            className="rounded-lg"
            src="https://i.ibb.co/mC9q8X2/regular.png"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            className="rounded-lg"
            src="https://i.ibb.co/Wyf3KvL/simulator.png"
          />
        </SwiperSlide>
      </Swiper>
    </section>
  )
}
