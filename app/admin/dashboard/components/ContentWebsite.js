'use client'

import React from 'react'

// shadcn ui components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import Toast from '@/app/components/Toast'
import { HashLoader } from 'react-spinners'
import getDocument from '@/firebase/firestore/getData'
import updateData from '@/firebase/firestore/updateData'
import { Textarea } from '@/components/ui/textarea'

function ContentWebsite() {
  // firebase data
  const [searchContent, setSearchContent] = React.useState(null)
  const [marqueeContent, setMarqueeContent] = React.useState({ data: [''] })
  const [footerContent, setFooterContent] = React.useState(null)
  const [reservationContent, setReservationContent] = React.useState(null)

  async function fetchDataContents() {
    const dataContentSearch = await getDocument('search-id', 'search-id-doc')
    const dataContentReservation = await getDocument(
      'reservation-id',
      'reservation-id-doc',
    )
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
    setFooterAddress(dataContentFooter.data['footer-address'])
    setFooterDesc(dataContentFooter.data['footer-desc'])
    setFooterSocials(dataContentFooter.data['footer-socials'])

    setReservationContent(dataContentReservation.data)
    setReservationTitle(dataContentReservation.data['reservation-title'])
    setReservationDesc(dataContentReservation.data['reservation-description'])
    setLabelName(dataContentReservation.data['label-name'])
    setLabelWhatsapp(dataContentReservation.data['label-whatsapp'])
    setLabelTanggalReservasi(
      dataContentReservation.data['label-tanggal-reservasi'],
    )
    setLabelTempatReservasi(
      dataContentReservation.data['label-tempat-reservasi'],
    )
    setPlaceholderName(dataContentReservation.data['placeholder-name'])
    setPlaceholderWhatsapp(dataContentReservation.data['placeholder-whatsapp'])
    setPlaceholderTanggalReservasi(
      dataContentReservation.data['placeholder-tanggal-reservasi'],
    )
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
  const [footerSocials, setFooterSocials] = React.useState([
    {
      icon: 'FaInstagram',
      link: '',
    },
    {
      icon: 'FaYoutube',
      link: '',
    },
    {
      icon: 'FaTiktok',
      link: '',
    },
    {
      icon: 'FaWhatsapp',
      link: '',
    },
  ])

  const handleChange = (index, value) => {
    setFooterSocials((prevSocials) =>
      prevSocials.map((social, i) =>
        i === index ? { ...social, link: value } : social,
      ),
    )
  }

  const handleChangeMarquee = (index, value) => {
    setMarqueeContent((prev) => ({
      ...prev,
      data: prev.data.map((item, i) => (i === index ? value : item)),
    }))
  }

  // Form Reservation Content
  const [reservationTitle, setReservationTitle] = React.useState('')
  const [reservationDesc, setReservationDesc] = React.useState('')
  const [labelName, setLabelName] = React.useState('')
  const [labelTanggalReservasi, setLabelTanggalReservasi] = React.useState('')
  const [labelTempatReservasi, setLabelTempatReservasi] = React.useState('')
  const [labelWhatsapp, setLabelWhatsapp] = React.useState('')
  const [placeholderName, setPlaceholderName] = React.useState('')
  const [placeholderWhatsapp, setPlaceholderWhatsapp] = React.useState('')
  const [
    placeholderTanggalReservasi,
    setPlaceholderTanggalReservasi,
  ] = React.useState('')

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

  async function handleUpdateDataMarqueeContents() {
    setIsLoading(true)

    try {
      const dataContentMarquee = await updateData(
        'marquee-id',
        'marquee-id-doc',
        marqueeContent,
      )
      console.log({ dataContentMarquee })

      await fetchDataContents() // Ensure fetch completes before stopping loading

      Toast.fire({
        icon: 'success',
        title: 'Ikuzoooo!',
        text: `Data content marquee telah berhasil diupdate!`,
      })
    } catch (error) {
      console.error('Error updating data:', error)
      Toast.fire({
        icon: 'error',
        title: 'Oopsss!',
        text: `Data content marquee gagal diupdate, terdapat masalah!`,
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

  async function handleUpdateDataReservationContents() {
    setIsLoading(true)

    const data = {
      'label-name': labelName,
      'label-tanggal-reservasi': labelTanggalReservasi,
      'label-tempat-reservasi': labelTempatReservasi,
      'label-whatsapp': labelWhatsapp,
      'placeholder-name': placeholderName,
      'placeholder-tanggal-reservasi': placeholderTanggalReservasi,
      'placeholder-whatsapp': placeholderWhatsapp,
      'reservation-description': reservationDesc,
      'reservation-title': reservationTitle,
    }

    try {
      const dataContentReservation = await updateData(
        'reservation-id',
        'reservation-id-doc',
        data,
      )
      console.log({ dataContentReservation })

      await fetchDataContents() // Ensure fetch completes before stopping loading

      Toast.fire({
        icon: 'success',
        title: 'Ikuzoooo!',
        text: `Data content reservation telah berhasil diupdate!`,
      })
    } catch (error) {
      console.error('Error updating data:', error)
      Toast.fire({
        icon: 'error',
        title: 'Oopsss!',
        text: `Data content reservation gagal diupdate, terdapat masalah!`,
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
      reservationContent == null ||
      marqueeContent.data.length == 1 ? (
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
                <label>Footer Address</label>
                <Textarea
                  rows={5}
                  placeholder={footerAddress}
                  value={footerAddress}
                  onChange={(e) => setFooterAddress(e.target.value)}
                />
              </div>
              <div>
                <label>Footer Description</label>
                <Textarea
                  rows={5}
                  placeholder={footerDesc}
                  value={footerDesc}
                  onChange={(e) => setFooterDesc(e.target.value)}
                />
              </div>

              <div>
                <label>Footer Socials</label>

                {footerSocials.map((social, index) => (
                  <Input
                    key={index}
                    placeholder={social.link}
                    value={social.link}
                    className="mb-1"
                    onChange={(e) => handleChange(index, e.target.value)}
                  />
                ))}
              </div>
              <Button
                type="button"
                onClick={() => handleUpdateDataFooterContents()}
              >
                Update
              </Button>
            </form>
          </div>

          {/* Form Marquee Content */}
          <div className="w-full border-b border-b-gray-400 pb-10 mb-10">
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">Marquee Content</h1>
              <p className={`text-base font-normal text-gray-400`}>
                Editable content related to marquee on homepage from address,
                description, and socials
              </p>
            </div>
            <form className="w-2/3 space-y-3">
              <div>
                <label>Marquee Text</label>

                {marqueeContent.data.map((marquee, index) => (
                  <Input
                    key={index}
                    placeholder={marquee}
                    value={marquee}
                    className="mb-1"
                    onChange={(e) => handleChangeMarquee(index, e.target.value)}
                  />
                ))}
              </div>
              <Button
                type="button"
                onClick={() => handleUpdateDataMarqueeContents()}
              >
                Update
              </Button>
            </form>
          </div>

          {/* Form Reservation Page */}
          <div className="w-full border-b border-b-gray-400 pb-10 mb-10">
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">
                Reservation Content Page
              </h1>
              <p className={`text-base font-normal text-gray-400`}>
                Editable content related to reservation page from button, title,
                description.
              </p>
            </div>
            <form className="w-2/3 space-y-3">
              <div>
                <label>Reservation Title Page</label>
                <Input
                  placeholder={reservationTitle}
                  value={reservationTitle}
                  onChange={(e) => setReservationTitle(e.target.value)}
                />
              </div>
              <div>
                <label>Reservation Description Page</label>
                <Textarea
                  rows={5}
                  placeholder={reservationDesc}
                  value={reservationDesc}
                  onChange={(e) => setReservationDesc(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full">
                <div className="w-full">
                  <label>Label Input Name</label>
                  <Input
                    placeholder={labelName}
                    value={labelName}
                    onChange={(e) => setLabelName(e.target.value)}
                  />
                </div>

                <div className="w-full">
                  <label>Placeholder Input Name</label>
                  <Input
                    placeholder={placeholderName}
                    value={placeholderName}
                    onChange={(e) => setPlaceholderName(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2 w-full">
                <div className="w-full">
                  <label>Label Input Whatsapp</label>
                  <Input
                    placeholder={labelWhatsapp}
                    value={labelWhatsapp}
                    onChange={(e) => setLabelWhatsapp(e.target.value)}
                  />
                </div>

                <div className="w-full">
                  <label>Placeholder Input Whatsapp</label>
                  <Input
                    placeholder={placeholderWhatsapp}
                    value={placeholderWhatsapp}
                    onChange={(e) => setPlaceholderWhatsapp(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2 w-full">
                <div className="w-full">
                  <label>Label Input Tanggal Reservasi</label>
                  <Input
                    placeholder={labelTanggalReservasi}
                    value={labelTanggalReservasi}
                    onChange={(e) => setLabelTanggalReservasi(e.target.value)}
                  />
                </div>

                <div className="w-full">
                  <label>Placeholder Input Tanggal Reservasi</label>
                  <Input
                    placeholder={placeholderTanggalReservasi}
                    value={placeholderTanggalReservasi}
                    onChange={(e) =>
                      setPlaceholderTanggalReservasi(e.target.value)
                    }
                  />
                </div>
              </div>
              <div>
                <label>Label Tempat Reservasi</label>
                <Input
                  placeholder={labelTempatReservasi}
                  value={labelTempatReservasi}
                  onChange={(e) => setLabelTempatReservasi(e.target.value)}
                />
              </div>
              <Button
                type="button"
                onClick={() => handleUpdateDataReservationContents()}
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
