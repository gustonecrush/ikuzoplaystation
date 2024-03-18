'use client'

import React, { useRef, useState } from 'react'

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

import { EffectCoverflow, Pagination } from 'swiper/modules'

import './styles2.css'

import Cookies from 'js-cookie'

import { GiSofa } from 'react-icons/gi'

// shadcn ui components
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

// tinymce ui components
import { Editor } from '@tinymce/tinymce-react'

import { AiOutlineDelete } from 'react-icons/ai'
import axios from 'axios'
import Toast from '@/app/components/Toast'
import Image from 'next/image'
import { Cross2Icon } from '@radix-ui/react-icons'
import { FiEdit3 } from 'react-icons/fi'
import { HashLoader } from 'react-spinners'

const SwiperContentFacilities = ({ facilities, fetchContentFacilities }) => {
  // base url & token
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const token = Cookies.get('token')

  // state variables for utilization process
  const [isUploading, setIsUploading] = React.useState(false)
  const [idSelected, setIdSelected] = React.useState(null)
  const [isWillUpdate, setIsWillUpdate] = React.useState(false)
  const [pictFacilitySelected, setPictFacilitySelected] = React.useState('')
  const [open, setOpen] = React.useState(false)

  // state variables for upload and update facility contents
  const [name, setName] = React.useState('')
  const [price, setPrice] = React.useState('')
  const [capacity, setCapacity] = React.useState('')
  const benefits = React.useRef(null)
  const [initialValue, setInitialValue] = React.useState('')
  const [pict, setPict] = React.useState(null)

  // function to handle upload
  const handleUploadFacilityContent = async (e) => {
    e.preventDefault()

    setIsUploading(true)

    try {
      const response = await axios.post(
        `${baseUrl}/content-facilities`,
        dataObjectFromStateVariables(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      console.log(dataObjectFromStateVariables())
      console.log({ response })

      Toast.fire({
        icon: 'success',
        title: `Data content facility berhasil diupload!`,
      })
      setIsUploading(false)

      clearStateVariables()
      setOpen(false)

      fetchContentFacilities()
    } catch (error) {
      setIsUploading(false)

      console.error({ error })
      clearStateVariables()

      setOpen(false)
      Toast.fire({
        icon: 'error',
        title: error.response.data.data,
      })
    }
  }

  // function to return data object
  const dataObjectFromStateVariables = () => {
    const data = new FormData()

    data.append('name', name)
    data.append('price', price)
    data.append('capacity', capacity)
    data.append('benefits', benefits.current.getContent())
    if (pict != null) {
      data.append('pict', pict)
    }

    return data
  }

  // function to clear state variables
  const clearStateVariables = () => {
    setName('')
    setPrice('')
    setCapacity('')
    setIdSelected(null)
    setInitialValue('')
    setPict(null)
  }

  // function to handle update
  const handleOpenFormForUpdating = (facility) => {
    setIdSelected(facility.id)
    setOpen(true)
    setIsWillUpdate(true)
    setName(facility.name)
    setPrice(facility.price)
    setCapacity(facility.capacity)
    setPictFacilitySelected(facility.pict)
    setInitialValue(facility.benefits)
    console.log({ facility })
  }

  const handleUpdateFacilityContent = async (e) => {
    e.preventDefault()

    setIsUploading(true)

    try {
      const response = await axios.post(
        `${baseUrl}/content-facilities/${idSelected}`,
        dataObjectFromStateVariables(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      console.log(dataObjectFromStateVariables())
      console.log({ response })

      setIsUploading(false)

      Toast.fire({
        icon: 'success',
        title: `Data content facility berhasil diupdate!`,
      })

      setIsWillUpdate(false)

      clearStateVariables()

      setOpen(false)
      fetchContentFacilities()
    } catch (error) {
      setIsWillUpdate(false)

      setIsUploading(false)
      clearStateVariables()

      console.error({ error })

      setOpen(false)
      Toast.fire({
        icon: 'error',
        title: error.response.data.data,
      })
    }
  }

  // function to handle delete
  const handleDeleteFacilityContent = async (id) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/content-facilities/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
        title: `Data content facility berhasil dihapus!`,
      })

      fetchContentFacilities()
    } catch (error) {
      console.error({ error })
      if (error.code == 'ERR_NETWORK') {
        Toast.fire({
          icon: 'error',
          title: `Data content gagal dihapus!`,
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: `Internal server sedang error, coba lagi nanti!`,
        })
      }
    }
  }

  // function to handle onchange
  const handleFileChange = (e) => {
    setPict(e.target.files[0])
  }

  return (
    <section className={`w-full flex flex-col gap-5`}>
      <Dialog open={open}>
        <DialogTrigger asChild onClick={() => setOpen(!open)}>
          <Button variant="outline" className="w-fit">
            Upload New Facility Content
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form
            onSubmit={
              isWillUpdate
                ? handleUpdateFacilityContent
                : handleUploadFacilityContent
            }
          >
            <DialogHeader>
              <div className="flex gap-2 items-center border-b border-b-slate-300 pb-3">
                <GiSofa className="w-10 text-3xl" />
                <div className="flex flex-col gap-1">
                  <DialogTitle>Ikuzo Facility Content</DialogTitle>
                  <DialogDescription>
                    {`Upload New Ikuzo Playstation Facility Content!`}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            {isUploading ? (
              <div className="flex items-center justify-center p-10">
                <HashLoader color="#FF6200" />
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                <div className="flex flex-col items-start gap-1">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Input Facility Name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="flex gap-2 w-full">
                  <div className="flex flex-col items-start gap-1 w-full">
                    <Label htmlFor="price" className="text-right">
                      Price
                    </Label>
                    <Input
                      id="price"
                      placeholder="Input Price..."
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-1 w-full">
                    <Label htmlFor="capacity" className="text-right">
                      Capacity
                    </Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="Input Capacity..."
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1 w-full">
                  <Label htmlFor="benefits" className="text-right">
                    Benefits
                  </Label>
                  <Editor
                    initialValue={initialValue}
                    apiKey={process.env.NEXT_PUBLIC_TINY_CLIENT}
                    onInit={(evt, benefit) => (benefits.current = benefit)}
                    init={{
                      height: 200,
                      width: '100%',

                      menubar: false,
                      plugins: ['lists', 'fullscreen', 'wordcount'],
                      toolbar: 'bullist numlist',
                      content_style:
                        'body { font-family:Plus Jakarta Sans,Arial,sans-serif; font-size:14px; width: 100%; overflow: hidden; }',
                    }}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <Label htmlFor="pict" className="text-right">
                    Picture
                  </Label>
                  {isWillUpdate && (
                    <Image
                      alt={pictFacilitySelected}
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${pictFacilitySelected}`}
                      width={0}
                      height={0}
                      className="w-full object-cover h-[100px] rounded-lg"
                    />
                  )}
                  <Input
                    id="pict"
                    onChange={handleFileChange}
                    type="file"
                    className="col-span-3"
                  />
                </div>
              </div>
            )}

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

      {facilities.length == 0 ? (
        <div className="w-full mt-14 mb-16  flex items-center justify-center">
          <div className="flex flex-col gap-1 items-center justify-center">
            <Image
              src={'/error.png'}
              width={0}
              height={0}
              className="w-[200px]"
              alt={'No content available'}
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
          className="mySwiper mx-10"
        >
          {facilities.map((facility, index) => (
            <SwiperSlide key={index} className="wide">
              <div className="relative">
                <div className="flex flex-row gap-1 absolute top-4 right-4 w-fit p-1 bg-gray-700  bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 border-opacity-25 rounded-lg">
                  <Button
                    onClick={() => handleOpenFormForUpdating(facility)}
                    variant="outline"
                    className="ml-auto border border-yellow-500 bg-transparent hover:bg-yellow-600  hover:text-white text-base text-yellow-500"
                  >
                    <FiEdit3 className="h-7 w-5" />
                  </Button>
                  <form action="" method="post" className="">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="ml-auto border border-red-500 bg-transparent hover:bg-red-600   hover:text-white text-base text-red-500"
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
                            delete your content and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) =>
                              handleDeleteFacilityContent(facility.id)
                            }
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </form>
                </div>

                <img
                  alt={facility.name}
                  className="rounded-md"
                  src={process.env.NEXT_PUBLIC_IMAGE_URL + facility.pict}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  )
}

export default SwiperContentFacilities
