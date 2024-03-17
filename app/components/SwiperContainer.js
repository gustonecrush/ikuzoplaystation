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

const SwiperContainer = () => {
  const [games, setGames] = React.useState([])

  const fetchContents = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/content-games`,
      )
      if (response.status == 200) {
        const jsonData = await response.data
        setGames(jsonData.data)
        console.log({ jsonData })
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
        className="mySwiper"
      >
        {games.map((game, index) => (
          <SwiperSlide key={index} className="md:small">
            <Image
              alt={game.file_name}
              width={0}
              height={0}
              className="rounded-lg md:w-[300px]"
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${game.file_name}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default SwiperContainer
