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
import axios from 'axios'
import Toast from './Toast'
import { headers } from '@/next.config'

const SwiperContentGames = ({ games, fetchContentGames }) => {
  const deleteContentGame = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/content-games/${id}`,
        {
          headers: {
            Authorization: `Bearer ${'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzEwNDM4MTAzLCJleHAiOjE3MTA0NDE3MDMsIm5iZiI6MTcxMDQzODEwMywianRpIjoiVzNEbFBId3RTR0RoMmtNSyIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.sxT6ch4vRJP-aFABgfTBDrRqhZ0y7BVP0FPaUwj11yE'}`,
          },
        },
      )
      if (response.status == 200) {
        const jsonData = await response.data
        console.log({ jsonData })
      } else {
        console.error({ error })
        throw new Error('Failed to fetch data')
      }

      Toast.fire({
        icon: 'success',
        title: `Data content games berhasil dihapus!`,
      })

      fetchContentGames()
    } catch (error) {
      console.error({ error })
      if (error.code == 'ERR_NETWORK') {
        Toast.fire({
          icon: 'error',
          title: `Data content gagal games berhasil dihapus!`,
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: `Internal server sedang error, coba lagi nanti!`,
        })
      }
    }
  }

  return (
    <>
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
          <SwiperSlide key={index} className="w-fit small">
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
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => deleteContentGame(game.id)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </form>
              <img
                className="rounded-md !w-[300px] !h-[300px]"
                src={process.env.NEXT_PUBLIC_IMAGE_URL + game.file_name}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

export default SwiperContentGames
