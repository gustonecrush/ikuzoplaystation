'use client'

import React from 'react'

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

import { EffectCoverflow, Pagination } from 'swiper/modules'

import './styles.css'
import Image from 'next/image'
import Toast from './Toast'
import axios from 'axios'

const SwiperContainerCatalogs = ({ games }) => {
  return (
    <section className="mt-4 px-2 md:px-0">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {[
          ...new Map(games.map((item) => [item.catalog_txt, item])).values(),
        ].map((game, index) => (
          <div key={index} className="w-fit">
            <Image
              alt={game.catalog_txt}
              width={0}
              height={0}
              className="rounded-lg !w-[100px] h-[100px] md:!w-[300px] md:!h-[300px] object-cover"
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${game.catalog_img}`}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default SwiperContainerCatalogs
