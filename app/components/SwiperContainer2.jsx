'use client'

import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';

import './styles2.css';

import { Navigation } from 'swiper/modules';

export default function SwiperContainer2() {
  return (
    <>
      <Swiper
        rewind={true}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
      >
       <SwiperSlide>
        <img src="https://i.ibb.co/2FCP3dS/regular-plus.png" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://i.ibb.co/rQznhYC/ps2.png" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://i.ibb.co/khhvvWY/vip-plus.png" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://i.ibb.co/mC9q8X2/regular.png" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://i.ibb.co/Wyf3KvL/simulator.png" />
      </SwiperSlide>
      </Swiper>
    </>
  );
}
