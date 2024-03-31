'use client'

import React, { useRef, useState } from 'react'

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

import { EffectCoverflow, Pagination } from 'swiper/modules'

import './styles.css'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
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
import { AiOutlineDelete } from 'react-icons/ai'
import axios from 'axios'
import Toast from './Toast'
import { headers } from '@/next.config'
import Image from 'next/image'

import Cookies from 'js-cookie'
import { Cross2Icon } from '@radix-ui/react-icons'
import { IoGameControllerSharp } from 'react-icons/io5'

const SwiperContentGames = ({ games, fetchContentGames }) => {
  // base url & token
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const token = Cookies.get('token')

  // state variables for utilization process
  const [isUploading, setIsUploading] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [openUpdateSection, setOpenUpdateSection] = React.useState(false)

  const [pict, setPict] = React.useState(null)

  // function to handle upload
  const handleUploadGameContent = async (e) => {
    e.preventDefault()

    setIsUploading(true)

    try {
      const response = await axios.post(
        `${baseUrl}/content-games`,
        dataObjectFromStateVariables(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      Toast.fire({
        icon: 'success',
        title: `Data content game berhasil diupload!`,
      })

      clearStateVariables()
      setOpen(false)
      fetchContentGames()
    } catch (error) {
      console.error({ error })
      setOpen(false)
      Toast.fire({
        icon: 'error',
        title: `Data content game gagal diupload!`,
      })
    }
  }

  // function to return data object
  const dataObjectFromStateVariables = () => {
    const data = new FormData()
    data.append('file', pict)
    return data
  }

  // function to clear state variables
  const clearStateVariables = () => {
    setPict(null)
  }

  // function to handle onchange
  const handleFileChange = (e) => {
    setPict(e.target.files[0])
  }

  const deleteContentGame = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/content-games/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (response.status == 200) {
        const jsonData = await response.data
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
    <section className={`w-full flex flex-col gap-5`}>
      <div className="flex flex-row gap-2">
        <Dialog open={open}>
          <DialogTrigger asChild onClick={() => setOpen(!open)}>
            <Button variant="outline" className="w-fit">
              Upload New Game Content
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleUploadGameContent}>
              <DialogHeader>
                <div className="flex gap-2 items-center border-b border-b-slate-300 pb-3">
                  <IoGameControllerSharp className="w-10 text-3xl" />
                  <div className="flex flex-col gap-1">
                    <DialogTitle>Ikuzo Games Content</DialogTitle>
                    <DialogDescription>
                      {`Upload New Ikuzo Playstation Game Content!`}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col items-start gap-1">
                  <Label htmlFor="pict" className="text-right">
                    Picture
                  </Label>
                  <Input
                    id="pict"
                    onChange={handleFileChange}
                    type="file"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-orange hover:bg-orange">
                  Upload
                </Button>
              </DialogFooter>
            </form>

            <DialogClose
              onClick={() => setOpen(!open)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <Cross2Icon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogContent>
        </Dialog>

        <Dialog open={openUpdateSection}>
          <DialogTrigger asChild onClick={() => setOpenUpdateSection(!open)}>
            <Button variant="outline" className="w-fit">
              Update Game Section
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleUploadGameContent}>
              <DialogHeader>
                <div className="flex gap-2 items-center border-b border-b-slate-300 pb-3">
                  <IoGameControllerSharp className="w-10 text-3xl" />
                  <div className="flex flex-col gap-1">
                    <DialogTitle>Ikuzo Games Section</DialogTitle>
                    <DialogDescription>
                      {`Update Ikuzo Playstation Game Section!`}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="flex flex-col items-start gap-1 w-full mt-3">
                <Label htmlFor="price" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Input Title..."
                  type="text"
                  className="w-full"
                />
              </div>
              <div className="flex flex-col items-start gap-1 w-full mt-2 mb-3">
                <Label htmlFor="price" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  placeholder="Input Description..."
                  type="text"
                  className="w-full"
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-orange hover:bg-orange">
                  Upload
                </Button>
              </DialogFooter>
            </form>

            <DialogClose
              onClick={() => setOpenUpdateSection(!open)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <Cross2Icon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>

      {games.length == 0 ? (
        <div className="w-full mt-14 mb-16 flex items-center justify-center">
          <div className="flex flex-col gap-1 items-center justify-center">
            <Image
              src={'/error.png'}
              width={0}
              height={0}
              className="w-[200px]"
            />
            <p className="text-base font-normal text-gray-400">
              There is no any contents right now ikuzo!
            </p>
          </div>
        </div>
      ) : (
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
                <form
                  action=""
                  method="post"
                  className="absolute top-4 right-4"
                >
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
                <Image
                  width={0}
                  height={0}
                  className="rounded-md !w-[300px] !h-[300px]"
                  src={process.env.NEXT_PUBLIC_IMAGE_URL + game.file_name}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  )
}

export default SwiperContentGames
