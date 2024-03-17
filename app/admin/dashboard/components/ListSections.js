'use client'

import React, { useRef, useState } from 'react'

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
import { IoLaptop } from 'react-icons/io5'
function ListSections({ sections, fetchContentFacilities }) {
  // base url & token
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const token = Cookies.get('token')

  // state variables for utilization process
  const [isUploading, setIsUploading] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  // state variables for upload and update facility contents
  const [name, setName] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [isButton, setIsButton] = React.useState('')
  const [linkButton, setLinkButton] = React.useState('')
  const [labelButton, setLabelButton] = React.useState('')
  const [content, setContent] = React.useState(null)

  // function to handle upload
  const handleUploadFacilityContent = async (e) => {
    e.preventDefault()

    setIsUploading(true)

    try {
      const response = await axios.post(
        `${baseUrl}/content-sections`,
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
        title: `Data content berhasil diupload!`,
      })

      clearStateVariables()
      setOpen(false)
      fetchContentFacilities()
    } catch (error) {
      console.error({ error })
      setOpen(false)
      Toast.fire({
        icon: 'error',
        title: `Data content gagal diupload!`,
      })
    }
  }

  // function to return data object
  const dataObjectFromStateVariables = () => {
    const data = new FormData()

    data.append('name', name)
    data.append('title', price)
    data.append('description', capacity)
    data.append('is_button', capacity)
    data.append('link_button', capacity)
    data.append('label_button', capacity)
    data.append('content', content)

    return data
  }

  // function to clear state variables
  const clearStateVariables = () => {
    setName('')
    setPrice('')
    setCapacity('')
    setPict(null)
  }

  // function to handle delete
  const handleDeleteFacilityContent = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/content-sections/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status == 200) {
        const jsonData = await response.data
        console.log({ jsonData })
      } else {
        console.error({ error })
        throw new Error('Failed to fetch data')
      }

      Toast.fire({
        icon: 'success',
        title: `Data content berhasil dihapus!`,
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
    setContent(e.target.files[0])
  }
  return (
    <section className={`w-full flex flex-col gap-5`}>
      <Dialog open={open}>
        <DialogTrigger asChild onClick={() => setOpen(!open)}>
          <Button variant="outline" className="w-fit">
            Upload New Section Content
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleUploadFacilityContent}>
            <DialogHeader>
              <div className="flex gap-2 items-center border-b border-b-slate-300 pb-3">
                <IoLaptop className="w-10 text-3xl" />
                <div className="flex flex-col gap-1">
                  <DialogTitle>Ikuzo Section Content</DialogTitle>
                  <DialogDescription>
                    {`Upload New Ikuzo Playstation Facility Content!`}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-start gap-1">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Input Name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="flex flex-col items-start gap-1 w-full">
                <Label htmlFor="price" className="text-right">
                  Title
                </Label>
                <Input
                  id="price"
                  placeholder="Input Title..."
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col items-start gap-1 w-full">
                <Label htmlFor="capacity" className="text-right">
                  Description
                </Label>
                <Input
                  id="capacity"
                  type="text"
                  placeholder="Input Description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 w-full">
                <div className="flex flex-col items-start gap-1 w-full">
                  <Label htmlFor="capacity" className="text-right">
                    Button
                  </Label>
                  <Input
                    id="capacity"
                    type="text"
                    placeholder="Ada Button?..."
                    value={isButton}
                    onChange={(e) => setIsButton(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col items-start gap-1 w-full">
                  <Label htmlFor="capacity" className="text-right">
                    Link Button
                  </Label>
                  <Input
                    id="capacity"
                    type="text"
                    placeholder="Input Link..."
                    value={linkButton}
                    onChange={(e) => setLinkButton(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col items-start gap-1 w-full">
                  <Label htmlFor="capacity" className="text-right">
                    Label Button
                  </Label>
                  <Input
                    id="capacity"
                    type="text"
                    placeholder="Input Label..."
                    value={labelButton}
                    onChange={(e) => setLabelButton(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col items-start gap-1">
                <Label htmlFor="pict" className="text-right">
                  Content
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

      {sections.length == 0 ? (
        <div className="w-full mt-14 mb-16  flex items-center justify-center">
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
        <></>
      )}
    </section>
  )
}

export default ListSections
