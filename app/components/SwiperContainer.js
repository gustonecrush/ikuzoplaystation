'use client'

import React, { useRef, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import { EffectCoverflow, Pagination } from 'swiper/modules';

import './styles.css';

const SwiperContainer = ({children}) => {
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
      <SwiperSlide>
        <img src="https://i.ibb.co/Kh67bXm/A-way-out.webp" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://i.ibb.co/khTTCzJ/Naruto-Strom-4.webp" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://i.ibb.co/jr9HPtx/spiderman.png" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://i.ibb.co/3RV6GGr/Aotennis-2.jpg" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://i.ibb.co/WKkZrgF/Astro-Playroom.webp" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://i.ibb.co/4WYM4GC/2k-drive.png" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://i.ibb.co/4tWMKL6/ultimate-ninja-5-1-final-1655137135122.jpg" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://i.ibb.co/Y04DbxG/Alienation.webp" />
      </SwiperSlide>
    </Swiper>
  </>
  )
}

export default SwiperContainer
