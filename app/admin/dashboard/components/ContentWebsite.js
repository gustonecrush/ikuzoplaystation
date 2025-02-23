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
import getDocument from '@/firebase/firestore/getData'
import updateData from '@/firebase/firestore/updateData'
import { Textarea } from '@/components/ui/textarea'
function ContentWebsite() {
  // firebase data
  const [searchContent, setSearchContent] = React.useState(null)
  const [marqueeContent, setMarqueeContent] = React.useState(null)
  const [footerContent, setFooterContent] = React.useState(null)

  async function fetchDataContents() {
    const dataContentSearch = await getDocument('search-id', 'search-id-doc')
    const dataContentMarquee = await getDocument('marquee-id', 'marquee-id-doc')
    const dataContentFooter = await getDocument('footer-id', 'footer-id-doc')

    setSearchContent(dataContentSearch.data)
    setSearchTitlePage(dataContentSearch.data['search-title-page'])
    setSearchBtnPage(dataContentSearch.data['search-btn-page'])
    setSearchDescPage(dataContentSearch.data['search-desc-page'])
    setSearchInputPage(dataContentSearch.data['search-input-page'])
    setSearchBtnTxt(dataContentSearch.data['search-btn-txt'])

    setMarqueeContent(dataContentMarquee.data)
    setFooterContent(dataContentFooter.data)
  }

  // Form Search Content
  const [searchBtnPage, setSearchBtnPage] = React.useState('')
  const [searchBtnTxt, setSearchBtnTxt] = React.useState('')
  const [searchDescPage, setSearchDescPage] = React.useState('')
  const [searchInputPage, setSearchInputPage] = React.useState('')
  const [searchTitlePage, setSearchTitlePage] = React.useState('')

  // Form Footer Content
  const [footerAddress, setFooterAddress] = React.useState('')
  const [footerDesc, setFooterDesc] = React.useState('')
  const [footerLogo, setFooterLogo] = React.useState('')
  const [footerSocials, setFooterSocials] = React.useState([])

  const [isLoading, setIsLoading] = React.useState(false)

  async function handleUpdateDataSearchContents() {
    setIsLoading(true)

    const data = {
      'search-btn-page': searchBtnPage,
      'search-btn-txt': searchBtnTxt,
      'search-desc-page': searchDescPage,
      'search-input-page': searchInputPage,
      'search-title-page': searchTitlePage,
    }

    try {
      const dataContentSearch = await updateData(
        'search-id',
        'search-id-doc',
        data,
      )
      console.log({ dataContentSearch })

      await fetchDataContents() // Ensure fetch completes before stopping loading

      Toast.fire({
        icon: 'success',
        title: 'Ikuzoooo!',
        text: `Data content search telah berhasil diupdate!`,
      })
    } catch (error) {
      console.error('Error updating data:', error)
      Toast.fire({
        icon: 'error',
        title: 'Oopsss!',
        text: `Data content search gagal diupdate, terdapat masalah!`,
      })
    } finally {
      setIsLoading(false) // Stop loading
    }
  }

  async function handleUpdateDataFooterContents() {
    setIsLoading(true)

    const data = {
      'footer-address': footerAddress,
      'footer-desc': footerDesc,
      'footer-logo': footerLogo,
      'footer-socials': footerSocials,
    }

    try {
      const dataContentFooter = await updateData(
        'footer-id',
        'footer-id-doc',
        data,
      )
      console.log({ dataContentFooter })

      await fetchDataContents() // Ensure fetch completes before stopping loading

      Toast.fire({
        icon: 'success',
        title: 'Ikuzoooo!',
        text: `Data content footer telah berhasil diupdate!`,
      })
    } catch (error) {
      console.error('Error updating data:', error)
      Toast.fire({
        icon: 'error',
        title: 'Oopsss!',
        text: `Data content footer gagal diupdate, terdapat masalah!`,
      })
    } finally {
      setIsLoading(false) // Stop loading
    }
  }

  console.log({ searchContent })
  console.log({ marqueeContent })
  console.log({ footerContent })

  React.useEffect(() => {
    fetchDataContents()
  }, [])

  return (
    <section className={`w-full flex flex-col gap-5`}>
      {isLoading ||
      searchContent == null ||
      footerContent == null ||
      marqueeContent == null ? (
        <div className="flex items-center justify-center p-10">
          <HashLoader color="#FF6200" />
        </div>
      ) : (
        <>
          {/* Form Search Page */}
          <div className="w-full border-b border-b-gray-400 pb-10 mb-10">
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">Search Content</h1>
              <p className={`text-base font-normal text-gray-400`}>
                Editable content related to search page from button, title,
                description.
              </p>
            </div>
            <form className="w-2/3 space-y-3">
              <div>
                <label>Search Title Page</label>
                <Input
                  placeholder={searchTitlePage}
                  value={searchTitlePage}
                  onChange={(e) => setSearchTitlePage(e.target.value)}
                />
              </div>
              <div>
                <label>Search Description Page</label>
                <Textarea
                  rows={5}
                  placeholder={searchDescPage}
                  value={searchDescPage}
                  onChange={(e) => setSearchDescPage(e.target.value)}
                />
              </div>
              <div>
                <label>Search Input Text</label>
                <Input
                  placeholder={searchInputPage}
                  value={searchInputPage}
                  onChange={(e) => setSearchInputPage(e.target.value)}
                />
              </div>
              <div>
                <label>Search Button Text</label>
                <Input
                  placeholder={searchBtnPage}
                  value={searchBtnPage}
                  onChange={(e) => setSearchBtnPage(e.target.value)}
                />
              </div>
              <div>
                <label>Search Input Text on Homepage</label>
                <Input
                  placeholder={searchBtnTxt}
                  value={searchBtnTxt}
                  onChange={(e) => setSearchBtnTxt(e.target.value)}
                />
              </div>
              <Button
                type="button"
                onClick={() => handleUpdateDataSearchContents()}
              >
                Update
              </Button>
            </form>
          </div>

          {/* Form Footer Content */}
          <div className="w-full border-b border-b-gray-400 pb-10 mb-10">
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">Footer Content</h1>
              <p className={`text-base font-normal text-gray-400`}>
                Editable content related to footer on homepage from address,
                description, and socials
              </p>
            </div>
            <form className="w-2/3 space-y-3">
              <div>
                <label>Search Title Page</label>
                <Input
                  placeholder={searchTitlePage}
                  value={searchTitlePage}
                  onChange={(e) => setSearchTitlePage(e.target.value)}
                />
              </div>
              <div>
                <label>Search Description Page</label>
                <Textarea
                  rows={5}
                  placeholder={searchDescPage}
                  value={searchDescPage}
                  onChange={(e) => setSearchDescPage(e.target.value)}
                />
              </div>
              <div>
                <label>Search Input Text</label>
                <Input
                  placeholder={searchInputPage}
                  value={searchInputPage}
                  onChange={(e) => setSearchInputPage(e.target.value)}
                />
              </div>
              <div>
                <label>Search Button Text</label>
                <Input
                  placeholder={searchBtnPage}
                  value={searchBtnPage}
                  onChange={(e) => setSearchBtnPage(e.target.value)}
                />
              </div>
              <div>
                <label>Search Input Text on Homepage</label>
                <Input
                  placeholder={searchBtnTxt}
                  value={searchBtnTxt}
                  onChange={(e) => setSearchBtnTxt(e.target.value)}
                />
              </div>
              <Button
                type="button"
                onClick={() => handleUpdateDataFooterContents()}
              >
                Update
              </Button>
            </form>
          </div>
        </>
      )}
    </section>
  )
}

export default ContentWebsite
