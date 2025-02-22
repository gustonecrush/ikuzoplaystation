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
import { FiEdit3 } from 'react-icons/fi'
import Link from 'next/link'
import Loading from './loading'
import { HashLoader } from 'react-spinners'
function ListSections({ isLoading, sections, fetchContentFacilities }) {
  // base url & token
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const token = Cookies.get('token')

  // state variables for utilization process
  const [isUploading, setIsUploading] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [idSelected, setIdSelected] = React.useState(null)
  const [isWillUpdate, setIsWillUpdate] = React.useState(false)
  const [pictFacilitySelected, setPictFacilitySelected] = React.useState('')

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

    const dataSections = dataObjectFromStateVariables()

    setIsUploading(true)

    try {
      const response = await axios.post(
        `${baseUrl}/content-sections`,
        dataSections,
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
        title: `Data content berhasil diupload!`,
      })

      clearStateVariables()
      setOpen(false)
      fetchContentFacilities()
    } catch (error) {
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

  // function to return data object
  const dataObjectFromStateVariables = () => {
    const data = new FormData()

    data.append('name', name)
    data.append('title', title)
    data.append('description', description)
    data.append('is_button', isButton)
    data.append('link_button', linkButton)
    data.append('label_button', labelButton)
    if (content != null) {
      data.append('content', content)
    }

    return data
  }

  // function to clear state variables
  const clearStateVariables = () => {
    setName('')
    setTitle('')
    setDescription('')
    setIsButton('')
    setLinkButton('')
    setLabelButton('')
    setContent(null)
  }

  // function to handle update
  const handleOpenFormForUpdating = (section) => {
    setIdSelected(section.id)
    setOpen(true)
    setIsWillUpdate(true)
    setName(section.name)
    setTitle(section.title)
    setDescription(section.description)
    setIsButton(section.is_button)
    setLinkButton(section.link_button)
    setLabelButton(section.label_button)
    setPictFacilitySelected(section.content)
    console.log({ section })
  }

  const handleUpdateFacilityContent = async (e) => {
    e.preventDefault()

    setIsUploading(true)

    try {
      const response = await axios.post(
        `${baseUrl}/content-sections/${idSelected}`,
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

      clearStateVariables()
      setOpen(false)
      setIsWillUpdate(false)

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
      {isLoading ? (
        <div className="flex items-center justify-center p-10">
          <HashLoader color="#FF6200" />
        </div>
      ) : (
        <>
          {' '}
          <Dialog open={open}>
            <DialogTrigger asChild onClick={() => setOpen(!open)}>
              <Button variant="outline" className="w-fit">
                Upload New Section Content
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
                    <IoLaptop className="w-10 text-3xl" />
                    <div className="flex flex-col gap-1">
                      <DialogTitle>Ikuzo Section Content</DialogTitle>
                      <DialogDescription>
                        {`Upload New Ikuzo Playstation Section Content!`}
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
                {!isUploading && (
                  <DialogFooter>
                    <Button type="submit" className="bg-orange hover:bg-orange">
                      Upload
                    </Button>
                  </DialogFooter>
                )}
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
                  alt={'No content available'}
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
            <>
              <div className="flex flex-col gap-2">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className={`flex w-full duration-1000 cursor-pointer items-center px-2 py-2 justify-center bg-white rounded-lg shadow-md relative`}
                  >
                    <div className="relative w-full h-[500px] rounded-lg overflow-hidden ">
                      <div className="flex flex-row gap-1 absolute top-4 right-4 w-fit p-1 bg-gray-700  bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 border-opacity-25 rounded-lg z-[100]">
                        <Button
                          onClick={() => handleOpenFormForUpdating(section)}
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
                                  This action cannot be undone. This will
                                  permanently delete your content and remove
                                  your data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={(e) =>
                                    handleDeleteFacilityContent(section.id)
                                  }
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </form>
                      </div>
                      <Image
                        alt={section.name}
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${section.content}`}
                        layout="fill"
                        objectFit="cover"
                        className="z-0"
                        priority
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                        {/* Your overlay content goes here */}
                        <div className="absolute w-full md:w-1/2 px-2 flex items-center justify-center flex-col gap-2 left-1/2 transform -translate-x-1/2 top-1/2 z-40 -translate-y-1/2">
                          <h1 className="text-orange font-extrabold font-montserrat text-5xl leading-none text-center  md:mt-16">
                            {section.title}
                          </h1>
                          <p className="text-white font-normal text-center text-sm ">
                            {section.description}
                          </p>
                          {section.is_button == 'true' && (
                            <ReserveButton content={section} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </section>
  )
}

function ReserveButton({ content }) {
  return (
    <Link
      href={'#'}
      className="bg-orange text-white border-orange py-2 rounded-full text-base mt-4 mb-20 w-fit px-10 relative font-semibold duration-1000 hover:bg-yellow-700"
    >
      {content.label_button}
    </Link>
  )
}

export default ListSections
