'use client'
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { format, addDays, startOfDay } from 'date-fns'
import { Fade } from 'react-awesome-reveal'

// UI Components
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

// Components & Utils
import Checkout from '../components/Checkout'
import LoaderHome from '../components/LoaderHome'
import Toast from '@/app/components/Toast'
import { Video } from '@/app/components/Home'

// Utils & Constants
import {
  calculateTimeDifference,
  extractHour,
  formatDate,
  formatDateIndonesian,
  formatTimestampIndonesian,
  generateTimeArray,
  generateTimeArrayWithStepUser,
  getIndonesianDay,
} from '@/utils/date'
import { generateRandomString } from '@/utils/id'
import { pricePackageDetermination } from '@/utils/price'
import { capitalizeAndFormat, getFacilityId } from '@/utils/text'
import { RESERVATION_PLACE } from '@/constans/reservations'
import getDocument from '@/firebase/firestore/getData'

// Hooks
import { useFetchPositions } from '@/hooks/useFetchPositions'
import { useFetchDataMaintenances } from '@/hooks/useFetchDataMaintenance'

export default function ReservationTesting() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  // Hooks
  const {
    data: dataMaintenance,
    isLoading: isLoadingMaintenance,
    getAllDataMaintenances,
  } = useFetchDataMaintenances()
  const {
    positions,
    isLoading: isLoadingPositions,
    fetchPositions,
  } = useFetchPositions()

  // State - Basic Info
  const [continueTapped, setContinueTapped] = useState(false)
  const [idReservasi, setIdReservasi] = useState(generateRandomString)
  const [namaReservasi, setNamaReservasi] = useState('')
  const [nomorWhatsappReservasi, setNoWhatsappReservasi] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [date, setDate] = useState(null)
  const [selectedReservationPlace, setSelectedReservationPlace] = useState(null)

  // State - Time & Position
  const [startTimeReservasi, setStartTimeReservasi] = useState('')
  const [endTimeReservasi, setEndTimeReservasi] = useState('')
  const [totalTime, setTotalTime] = useState(0)
  const [posisiReservasi, setPosisiReservasi] = useState(0)
  const [namaPosisiReservasi, setNamaPosisiReservasi] = useState('')

  // State - Price Data
  const [selectedPriceToday, setSelectedPriceToday] = useState('')
  const [selectedCustomPrices, setSelectedCustomPrices] = useState(null)
  const [pricePerReserve, setPricePerReserve] = useState(0)

  // State - Facility Data
  const [familyVIPRoomData, setFamilyVIPRoomData] = useState(null)
  const [lovebirdsVIPRoomData, setLovebirdsVIPRoomData] = useState(null)
  const [familyOpenSpaceData, setFamilyOpenSpaceData] = useState(null)
  const [squadOpenSpaceData, setSquadOpenSpaceData] = useState(null)
  const [ps4RegulerData, setPs4RegulerData] = useState(null)
  const [ps5RegulerData, setPs5RegulerData] = useState(null)
  const [ikuzoRacingSimulatorData, setIkuzoRacingSimulatorData] = useState(null)

  // State - Space Data
  const [privateSpaceData, setPrivateSpaceData] = useState(null)
  const [regularSpaceData, setRegularSpaceData] = useState(null)
  const [premiumSpaceData, setPremiumSpaceData] = useState(null)

  // State - Reservation & Content
  const [reservationContent, setReservationContent] = useState(null)
  const [reserves, setReserves] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])
  const [reservesPosition, setReservesPosition] = useState([])
  const [dateClose, setDateClose] = useState([])
  const [customTimeSelected, setCustomTimeSelected] = useState([])

  // State - Catalog
  const [catalogs, setCatalogs] = useState([])
  const [filteredCatalogs, setFilteredCatalogs] = useState([])
  const [filterKeyword, setFilterKeyword] = useState('')
  const [selectedSeat, setSelectedSeat] = useState(0)
  const [drawerContent, setDrawerContent] = useState('default')
  const [latestUpdatedAt, setLatestUpdatedAt] = useState('')

  // State - UI
  const [isLoading, setIsLoading] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef(null)

  // Fetch Functions
  const fetchDataPrices = async () => {
    try {
      const [
        family,
        lovebirds,
        familySpace,
        squad,
        ps4,
        ps5,
        simulator,
      ] = await Promise.all([
        getDocument('facility-setting-prices', 'family-vip-room'),
        getDocument('facility-setting-prices', 'lovebirds-vip-room'),
        getDocument('facility-setting-prices', 'family-open-space'),
        getDocument('facility-setting-prices', 'squad-open-space'),
        getDocument('facility-setting-prices', 'ps4-reguler'),
        getDocument('facility-setting-prices', 'ps5-reguler'),
        getDocument('facility-setting-prices', 'ikuzo-racing-simulator'),
      ])

      setFamilyVIPRoomData(family.data)
      setLovebirdsVIPRoomData(lovebirds.data)
      setFamilyOpenSpaceData(familySpace.data)
      setSquadOpenSpaceData(squad.data)
      setPs4RegulerData(ps4.data)
      setPs5RegulerData(ps5.data)
      setIkuzoRacingSimulatorData(simulator.data)
    } catch (error) {
      console.error('Error fetching prices:', error)
    }
  }

  const fetchDataTimes = async () => {
    try {
      const [privateData, premiumData, regularData] = await Promise.all([
        getDocument('space-setting-times', 'private-space-doc'),
        getDocument('space-setting-times', 'premium-space-doc'),
        getDocument('space-setting-times', 'regular-space-doc'),
      ])

      setPrivateSpaceData(privateData?.data)
      setPremiumSpaceData(premiumData?.data)
      setRegularSpaceData(regularData?.data)
    } catch (error) {
      console.error('Error fetching times:', error)
    }
  }

  const fetchDataContents = async () => {
    try {
      const data = await getDocument('reservation-id', 'reservation-id-doc')
      setReservationContent(data.data)
    } catch (error) {
      console.error('Error fetching contents:', error)
    }
  }

  const getAllReservation = async (date, position) => {
    try {
      const response = await axios.get(
        `${baseUrl}/reservations?reserve_date=${date}&position=${position}&status=settlement&pending=pending`,
      )

      if (response.status === 200) {
        setReserves(response.data)
        const slots = response.data.map((reserve) => ({
          startTime: reserve.reserve_start_time,
          endTime: reserve.reserve_end_time,
        }))
        setBookedSlots(slots)
      }
    } catch (error) {
      console.error('Error fetching reservations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAllReservationsPosition = async (date) => {
    try {
      const response = await axios.get(
        `${baseUrl}/reservations?reserve_date=${date}`,
      )
      if (response.status === 200) {
        setReservesPosition(response.data)
      }
    } catch (error) {
      console.error('Error fetching positions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDateClosed = async () => {
    try {
      const response = await axios.get(`${baseUrl}/dates`)
      if (response.status === 200) {
        setDateClose(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching closed dates:', error)
    }
  }

  const getTimeSelected = async (date) => {
    try {
      const response = await axios.get(`${baseUrl}/times?selected_date=${date}`)
      if (response.status === 200) {
        setCustomTimeSelected(
          response.data.data.length > 0 ? response.data.data : [],
        )
      }
    } catch (error) {
      console.error('Error fetching times:', error)
    }
  }

  // Helper Functions
  const getPriceDataCustom = (facilityName) => {
    const facilityId = getFacilityId(facilityName)
    const facilityPriceMap = {
      'ps5-reguler': ps5RegulerData?.['custom-prices'],
      'ikuzo-racing-simulator': ikuzoRacingSimulatorData?.['custom-prices'],
      'ps4-reguler': ps4RegulerData?.['custom-prices'],
      'family-vip-room': familyVIPRoomData?.['custom-prices'],
      'lovebirds-vip-room': lovebirdsVIPRoomData?.['custom-prices'],
      'family-open-space': familyOpenSpaceData?.['custom-prices'],
      'squad-open-space': squadOpenSpaceData?.['custom-prices'],
    }

    const priceData = facilityPriceMap[facilityId] || []
    const found = priceData.find((item) => item.date === selectedDate)
    setSelectedCustomPrices(found ? found.price : null)
    return priceData
  }

  const getPriceSetForToday = (value, selectedDate) => {
    const today = getIndonesianDay(selectedDate)
    const facilityId = getFacilityId(value)

    const facilityPriceMap = {
      'ps5-reguler': ps5RegulerData?.prices,
      'ikuzo-racing-simulator': ikuzoRacingSimulatorData?.prices,
      'ps4-reguler': ps4RegulerData?.prices,
      'family-vip-room': familyVIPRoomData?.prices,
      'lovebirds-vip-room': lovebirdsVIPRoomData?.prices,
      'family-open-space': familyOpenSpaceData?.prices,
      'squad-open-space': squadOpenSpaceData?.prices,
    }

    const prices = facilityPriceMap[facilityId] || []
    const foundPrice = prices.filter((item) =>
      item.day.split(',').includes(today),
    )

    if (foundPrice.length > 0) {
      setSelectedPriceToday(foundPrice[0].price)
      return foundPrice[0].price
    }
    return null
  }

  const getTimeSetForToday = (value, date = selectedDate) => {
    const today = getIndonesianDay(date)

    const spaceTimeMap = {
      'regular-space': regularSpaceData?.times,
      'private-space': privateSpaceData?.times,
      'premium-space': premiumSpaceData?.times,
    }

    const times = spaceTimeMap[value] || []
    const foundItem = times.filter((item) =>
      item['time-day'].split(',').includes(today),
    )

    return foundItem.length === 1 ? foundItem[0]['time-set'] : null
  }

  const handleCatalogClick = async (noSeat) => {
    setSelectedSeat(noSeat)
    try {
      const response = await axios.get(`${baseUrl}/catalogs?no_seat=${noSeat}`)

      if (response.data && response.data.length > 0) {
        const sortedCatalogs = response.data.sort((a, b) =>
          a.catalog_txt.localeCompare(b.catalog_txt),
        )

        const latestUpdatedAt = response.data.reduce(
          (latest, catalog) =>
            new Date(catalog.updated_at) > new Date(latest.updated_at)
              ? catalog
              : latest,
          response.data[0],
        ).updated_at

        setDrawerContent('catalog')
        setCatalogs(sortedCatalogs)
        setLatestUpdatedAt(latestUpdatedAt)
      } else {
        throw new Error('No catalog data found')
      }
    } catch (error) {
      setDrawerContent('catalog')
      setCatalogs([])
      console.error('Error fetching catalog:', error)
    }
  }

  const handleInputFilterCatalogChange = (e) => {
    const value = e.target.value.toLowerCase()
    const filtered = catalogs
      .filter((catalog) => catalog.catalog_txt.toLowerCase().includes(value))
      .sort((a, b) => a.catalog_txt.localeCompare(b.catalog_txt))
    setFilteredCatalogs(filtered)
  }

  const handleCloseCatalogClick = () => {
    setDrawerContent('default')
    setFilteredCatalogs([])
    setFilterKeyword('')
  }

  const handleZoomIn = () => setScale((scale) => scale + 0.1)
  const handleZoomOut = () => setScale((scale) => scale - 0.1)

  const handleContinue = () => {
    if (
      namaReservasi &&
      nomorWhatsappReservasi &&
      selectedReservationPlace &&
      selectedDate &&
      startTimeReservasi &&
      endTimeReservasi &&
      posisiReservasi &&
      totalTime !== 0
    ) {
      window.scrollTo(0, 0)
      setIsLoading(true)
      setContinueTapped(true)
      setTimeout(() => setIsLoading(false), 4000)
    } else {
      alert('Please fill in all required inputs.')
    }
  }

  const handleCancel = async () => {
    try {
      await axios.delete(`${baseUrl}/reservations/${idReservasi}`)
      setNamaReservasi('')
      setNoWhatsappReservasi('')
      setSelectedReservationPlace('')
      setSelectedDate('')
      setStartTimeReservasi('')
      setEndTimeReservasi('')
      setIdReservasi('')
      setPosisiReservasi(0)
      setNamaPosisiReservasi('')
      setSelectedPriceToday('')
      setContinueTapped(false)
    } catch (error) {
      console.error('Error canceling:', error)
    }
  }

  // Effects
  useEffect(() => {
    fetchPositions()
  }, [fetchPositions])

  useEffect(() => {
    fetchDataTimes()
    fetchDataContents()
    fetchDataPrices()
    getAllDataMaintenances()
    getDateClosed()

    const timeDiff = calculateTimeDifference(
      startTimeReservasi,
      endTimeReservasi,
    )
    setTotalTime(timeDiff)

    const snapScript = document.createElement('script')
    snapScript.src = 'https://app.midtrans.com/snap/snap.js'
    snapScript.setAttribute('data-client-key', process.env.NEXT_PUBLIC_CLIENT)
    snapScript.async = true
    document.body.appendChild(snapScript)

    return () => {
      if (document.body.contains(snapScript)) {
        document.body.removeChild(snapScript)
      }
    }
  }, [startTimeReservasi, endTimeReservasi])

  // Calculations
  const timeSet = getTimeSetForToday(selectedReservationPlace, selectedDate)

  const fallbackTimeArray = [
    {
      open_time: 10,
      close_time: 23,
      date: selectedDate,
    },
  ]

  const timeArrayStart =
    timeSet === null
      ? fallbackTimeArray
      : [
          {
            open_time: extractHour(timeSet['start-time']),
            close_time: extractHour(timeSet['end-time']),
            date: selectedDate,
          },
        ]

  const generatedTimes = generateTimeArray(
    timeArrayStart,
    selectedDate,
    bookedSlots,
  )
  const timeArray = generateTimeArrayWithStepUser(
    startTimeReservasi,
    bookedSlots,
    timeSet != null ? extractHour(timeSet['end-time']) : 23,
  )

  const disableTimes = reserves
    .map((reserve) => {
      if (reserve.reserve_end_time) {
        const [hour, minute] = reserve.reserve_end_time.split(':')
        return `${hour}:${minute}`
      }
      return null
    })
    .filter((time) => time !== null)

  const finalPrice = pricePackageDetermination(
    posisiReservasi,
    totalTime,
    selectedCustomPrices != null
      ? selectedCustomPrices
      : parseInt(selectedPriceToday),
  )
  const safePrice = isNaN(finalPrice) ? 0 : finalPrice + 4000

  // Render Loading
  if (
    !reservationContent ||
    !regularSpaceData ||
    !privateSpaceData ||
    !premiumSpaceData ||
    !familyVIPRoomData ||
    !familyOpenSpaceData ||
    !squadOpenSpaceData ||
    !lovebirdsVIPRoomData ||
    !ps4RegulerData ||
    !ps5RegulerData ||
    !ikuzoRacingSimulatorData ||
    isLoadingMaintenance
  ) {
    return (
      <div className="z-[999999] w-full h-full absolute top-50">
        <LoaderHome />
      </div>
    )
  }

  return (
    <section className="bg-transparent w-full min-h-screen font-jakarta px-4 sm:px-5 py-5 md:pb-10 relative z-50">
      {/* Video Background */}
      <div className="fixed inset-0 -z-10">
        <Video />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center mb-5">
          <Fade>
            <Image
              src="/logo-orange.png"
              alt="Ikuzo Playstation Logo"
              width={150}
              height={150}
              className="w-32 sm:w-[150px] h-auto"
            />
          </Fade>
        </Link>

        {/* Header Card */}
        <div className="px-4 sm:px-5 py-5 bg-gray-700 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 border-opacity-25 shadow-md rounded-lg flex flex-col text-center gap-3 items-center justify-center">
          <Fade>
            <Image
              src={!continueTapped ? '/reserve.png' : '/checkout.png'}
              width={56}
              height={56}
              alt="Reservation"
              className="w-12 sm:w-14"
            />
          </Fade>

          <Fade>
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-bold uppercase font-montserrat leading-none text-orange">
                {!continueTapped
                  ? reservationContent['reservation-title']
                  : 'Payment'}
              </h1>
              <p className="text-xs sm:text-sm font-normal text-white mt-1">
                {!continueTapped
                  ? reservationContent['reservation-description']
                  : 'Lakukan pembayaran segera untuk reservasi'}
              </p>
            </div>
          </Fade>
        </div>

        {/* Form or Checkout */}
        {!continueTapped ? (
          <>
            {/* Reservation Form */}
            <div className="flex flex-col gap-3 px-4 sm:px-5 bg-gray-700 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 border-opacity-25 shadow-md rounded-lg mt-5 py-5 sm:py-7">
              {/* Name Input */}
              <Fade>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-white text-sm sm:text-base"
                    htmlFor="nama"
                  >
                    {reservationContent['label-name']}
                  </label>
                  <input
                    type="text"
                    value={namaReservasi}
                    onChange={(e) => setNamaReservasi(e.target.value)}
                    name="nama"
                    id="nama"
                    placeholder={reservationContent['placeholder-name']}
                    className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base active:border-orange focus:border-orange outline-none focus:outline-orange"
                    required
                  />
                </div>
              </Fade>

              {/* WhatsApp Input */}
              <Fade delay={50}>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-white text-sm sm:text-base"
                    htmlFor="nomor_whatsapp"
                  >
                    {reservationContent['label-whatsapp']}
                  </label>
                  <input
                    type="text"
                    value={nomorWhatsappReservasi}
                    onChange={(e) => setNoWhatsappReservasi(e.target.value)}
                    name="nomor_whatsapp"
                    id="nomor_whatsapp"
                    placeholder={reservationContent['placeholder-whatsapp']}
                    className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base active:border-orange focus:border-orange outline-none focus:outline-orange"
                    required
                  />
                </div>
              </Fade>

              {/* Date Picker */}
              <Fade delay={100}>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-white text-sm sm:text-base"
                    htmlFor="tanggal_reservasi"
                  >
                    {reservationContent['label-tanggal-reservasi']}
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <input
                        type="text"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        name="tanggal_reservasi"
                        id="tanggal_reservasi"
                        placeholder={
                          reservationContent['placeholder-tanggal-reservasi']
                        }
                        className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base active:border-orange focus:border-orange outline-none focus:outline-orange w-full cursor-pointer"
                        required
                        readOnly
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => {
                          setDate(date)
                          setSelectedDate(format(date, 'yyyy-MM-dd'))
                          getAllReservationsPosition(format(date, 'yyyy-MM-dd'))
                          if (selectedReservationPlace) {
                            getTimeSetForToday(
                              selectedReservationPlace,
                              format(date, 'yyyy-MM-dd'),
                            )
                          }
                          getTimeSelected(format(date, 'yyyy-MM-dd'))
                        }}
                        disabled={(date) => {
                          const today = startOfDay(new Date())
                          const maxDate = addDays(today, 14)
                          const checkDate = startOfDay(date)

                          const isInClosedRange = dateClose.some(
                            ({ start_date, end_date }) => {
                              const startDate = startOfDay(new Date(start_date))
                              const endDate = startOfDay(new Date(end_date))
                              return (
                                checkDate >= startDate && checkDate <= endDate
                              )
                            },
                          )

                          return (
                            checkDate > maxDate ||
                            checkDate < today ||
                            isInClosedRange
                          )
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </Fade>

              {/* Space Selection */}
              <Fade delay={150}>
                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm sm:text-base">
                    {reservationContent['label-tempat-reservasi']}
                  </label>
                  <Select
                    value={selectedReservationPlace}
                    onValueChange={(value) => {
                      setSelectedReservationPlace(value)
                      getTimeSetForToday(value)
                    }}
                    required
                  >
                    <SelectTrigger className="py-5 px-3 text-sm sm:text-base text-white bg-transparent border-border">
                      <SelectValue placeholder="Choose Space">
                        {selectedReservationPlace
                          ? capitalizeAndFormat(selectedReservationPlace)
                          : 'Choose Space'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-w-[90vw]" side="top">
                      <SelectGroup>
                        <SelectLabel className="text-sm sm:text-base">
                          Pilih Tempat Reservasi
                        </SelectLabel>
                        {RESERVATION_PLACE.map((place, index) => (
                          <SelectItem
                            key={index}
                            className="text-sm sm:text-base"
                            value={place.slug}
                          >
                            <div className="flex flex-col gap-1">
                              <span>{place.name}</span>
                              {(place.slug === 'regular-space' &&
                                regularSpaceData?.times) ||
                              (place.slug === 'private-space' &&
                                privateSpaceData?.times) ||
                              (place.slug === 'premium-space' &&
                                premiumSpaceData?.times) ? (
                                <span className="text-gray-500 text-xs flex flex-col gap-0">
                                  {(place.slug === 'regular-space'
                                    ? regularSpaceData.times
                                    : place.slug === 'private-space'
                                    ? privateSpaceData.times
                                    : premiumSpaceData.times
                                  ).map((time, idx) => (
                                    <span key={idx} className="text-xs">
                                      {time['time-day']} -{' '}
                                      {time['time-set']['start-time']} -{' '}
                                      {time['time-set']['end-time']}
                                    </span>
                                  ))}
                                </span>
                              ) : null}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </Fade>

              {/* Floor Map with Seats - Only show if space and date are selected */}
              {selectedReservationPlace && selectedDate && (
                <Fade delay={200}>
                  <div className="relative w-full h-fit mt-4">
                    <div className="bg-white rounded-lg relative overflow-hidden">
                      {/* Zoom Controls */}
                      <div className="absolute bottom-0 right-0 z-10 flex gap-2 bg-white rounded-tl-lg overflow-hidden">
                        <button
                          onClick={handleZoomIn}
                          className="border-none text-gray-700 bg-white p-2 sm:p-3 text-base sm:text-lg cursor-pointer hover:bg-gray-100"
                        >
                          +
                        </button>
                        <button
                          onClick={handleZoomOut}
                          className="border-none text-gray-700 bg-white p-2 sm:p-3 text-base sm:text-lg cursor-pointer hover:bg-gray-100"
                        >
                          −
                        </button>
                      </div>

                      {/* Floor Image */}
                      <img
                        src={
                          selectedReservationPlace === 'regular-space'
                            ? '/first-floor.jpg'
                            : selectedReservationPlace === 'premium-space'
                            ? '/premium-space.PNG'
                            : '/private-space.PNG'
                        }
                        alt="Floor Map"
                        className="w-full h-auto"
                        style={{
                          transform: `${
                            selectedReservationPlace === 'regular-space'
                              ? 'scale(1.4)'
                              : 'scale(1)'
                          } translate(${position.x}px, ${position.y}px)`,
                          cursor: 'move',
                        }}
                      />

                      {/* Seat Markers - This is simplified, you'll need to add the actual seat positioning logic */}
                      {/* Regular Space Seats */}
                      {selectedReservationPlace === 'regular-space' && (
                        <div className="absolute top-10 left-0 right-0 z-50">
                          <div className="flex justify-around px-4 gap-2">
                            {[1, 2, 3, 4, 5].map((number) => {
                              const isSeatInMaintenance = dataMaintenance.find(
                                (s) => s.no_seat === number,
                              )
                              return (
                                <div
                                  key={number}
                                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-gray-400 bg-gray-900 bg-opacity-20 text-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-opacity-40 transition-all"
                                  onClick={() => {
                                    if (!isSeatInMaintenance) {
                                      setPosisiReservasi(number)
                                      if (number <= 4) {
                                        setNamaPosisiReservasi(
                                          positions[6].name,
                                        )
                                        setPricePerReserve(positions[6].price)
                                        getPriceSetForToday(
                                          positions[6].name,
                                          selectedDate,
                                        )
                                        getPriceDataCustom(positions[6].name)
                                      } else {
                                        setNamaPosisiReservasi(
                                          positions[0].name,
                                        )
                                        setPricePerReserve(positions[0].price)
                                        getPriceSetForToday(
                                          positions[0].name,
                                          selectedDate,
                                        )
                                        getPriceDataCustom(positions[0].name)
                                      }
                                      getAllReservation(selectedDate, number)
                                    }
                                  }}
                                >
                                  <p className="text-xs font-medium">
                                    {number}
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Premium Space Seats */}
                      {selectedReservationPlace === 'premium-space' && (
                        <div className="absolute top-5 left-7 right-7 z-50">
                          <div className="flex justify-between gap-4">
                            {[13, 14, 15, 16].map((number) => {
                              const isSeatInMaintenance = dataMaintenance.find(
                                (s) => s.no_seat === number,
                              )
                              return (
                                <div
                                  key={number}
                                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 border border-gray-400 bg-gray-900 bg-opacity-20 text-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-opacity-40 transition-all"
                                  onClick={() => {
                                    if (!isSeatInMaintenance) {
                                      setPosisiReservasi(number)
                                      setNamaPosisiReservasi(positions[3].name)
                                      setPricePerReserve(positions[3].price)
                                      getPriceSetForToday(
                                        positions[3].name,
                                        selectedDate,
                                      )
                                      getPriceDataCustom(positions[3].name)
                                      getAllReservation(selectedDate, number)
                                    }
                                  }}
                                >
                                  <p className="text-[0.6rem] sm:text-xs text-center leading-tight px-1">
                                    Squad
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Private Space Seats */}
                      {selectedReservationPlace === 'private-space' && (
                        <>
                          {/* Family VIP Rooms */}
                          <div className="absolute top-7 left-[16%] right-[16%] z-50">
                            <div className="flex justify-between gap-16">
                              {[18, 19].map((number) => {
                                const isSeatInMaintenance = dataMaintenance.find(
                                  (s) => s.no_seat === number,
                                )
                                return (
                                  <div
                                    key={number}
                                    className="w-16 h-10 sm:w-20 sm:h-12 md:w-24 md:h-14 border border-gray-400 bg-gray-900 bg-opacity-20 text-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-opacity-40 transition-all"
                                    onClick={() => {
                                      if (!isSeatInMaintenance) {
                                        setPosisiReservasi(number)
                                        setNamaPosisiReservasi(
                                          positions[4].name,
                                        )
                                        setPricePerReserve(positions[4].price)
                                        getPriceSetForToday(
                                          positions[4].name,
                                          selectedDate,
                                        )
                                        getPriceDataCustom(positions[4].name)
                                        getAllReservation(selectedDate, number)
                                      }
                                    }}
                                  >
                                    <p className="text-[0.6rem] sm:text-xs text-center leading-tight px-1">
                                      Family
                                    </p>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          {/* Lovebirds VIP Rooms */}
                          <div className="absolute bottom-12 left-6 right-6 z-50">
                            <div className="flex justify-start gap-3">
                              {[20, 21, 22].map((number) => {
                                const isSeatInMaintenance = dataMaintenance.find(
                                  (s) => s.no_seat === number,
                                )
                                return (
                                  <div
                                    key={number}
                                    className="w-16 h-10 sm:w-20 sm:h-12 md:w-24 md:h-14 border border-gray-400 bg-gray-900 bg-opacity-20 text-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-opacity-40 transition-all"
                                    onClick={() => {
                                      if (!isSeatInMaintenance) {
                                        setPosisiReservasi(number)
                                        setNamaPosisiReservasi(
                                          positions[5].name,
                                        )
                                        setPricePerReserve(positions[5].price)
                                        getPriceSetForToday(
                                          positions[5].name,
                                          selectedDate,
                                        )
                                        getPriceDataCustom(positions[5].name)
                                        getAllReservation(selectedDate, number)
                                      }
                                    }}
                                  >
                                    <p className="text-[0.6rem] sm:text-xs text-center leading-tight px-1">
                                      Lovebirds
                                    </p>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
                      <div className="flex gap-1 items-center">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border border-green-500 bg-green-500 bg-opacity-25 rounded-sm"></div>
                        <p className="text-xs sm:text-sm text-white">
                          selected
                        </p>
                      </div>
                      <div className="flex gap-1 items-center">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border border-yellow-500 bg-yellow-500 bg-opacity-25 rounded-sm"></div>
                        <p className="text-xs sm:text-sm text-white">in hold</p>
                      </div>
                      <div className="flex gap-1 items-center">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border border-red-500 bg-red-500 bg-opacity-25 rounded-sm"></div>
                        <p className="text-xs sm:text-sm text-white">
                          reserved
                        </p>
                      </div>
                      <div className="flex gap-1 items-center">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border border-gray-500 bg-gray-500 bg-opacity-25 rounded-sm"></div>
                        <p className="text-xs sm:text-sm text-white">
                          available
                        </p>
                      </div>
                    </div>
                  </div>
                </Fade>
              )}

              {/* Time Selection - Only show if seat is selected */}
              {posisiReservasi > 0 && (
                <>
                  {/* Reserved Times Display */}
                  {reserves.length > 0 && (
                    <Fade>
                      <div className="flex flex-col gap-2">
                        <label className="text-white text-sm sm:text-base">
                          Reserved Times
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {reserves.map((reserve, index) => (
                            <div
                              key={index}
                              className={`text-xs px-2 py-1 border rounded-md ${
                                reserve.status_reserve === 'pending'
                                  ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                  : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                              }`}
                            >
                              {reserve.reserve_start_time} -{' '}
                              {reserve.reserve_end_time} WIB
                            </div>
                          ))}
                        </div>
                      </div>
                    </Fade>
                  )}

                  {/* Time Selection */}
                  <Fade>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Start Time */}
                      <div className="flex flex-col gap-2">
                        <label className="text-white text-sm sm:text-base">
                          Start Time
                        </label>
                        <Select
                          value={startTimeReservasi}
                          onValueChange={(value) =>
                            setStartTimeReservasi(value)
                          }
                          required
                        >
                          <SelectTrigger className="py-5 px-3 text-sm sm:text-base bg-transparent text-white border-border">
                            <SelectValue placeholder="00:00" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel className="text-sm">
                                Pilih Waktu Mulai
                              </SelectLabel>
                              {generatedTimes.map((time, index) => (
                                <SelectItem
                                  key={index}
                                  value={time}
                                  className="text-sm"
                                >
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* End Time */}
                      <div className="flex flex-col gap-2">
                        <label className="text-white text-sm sm:text-base">
                          End Time
                        </label>
                        <Select
                          value={endTimeReservasi}
                          onValueChange={(value) => setEndTimeReservasi(value)}
                          required
                        >
                          <SelectTrigger className="py-5 px-3 text-sm sm:text-base bg-transparent text-white border-border">
                            <SelectValue placeholder="00:00" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel className="text-sm">
                                Pilih Waktu Berakhir
                              </SelectLabel>
                              {startTimeReservasi !== '' &&
                              timeArray.length !== 0 ? (
                                timeArray.map((time, index) => {
                                  const isDisabled = disableTimes.includes(time)
                                  return (
                                    <SelectItem
                                      key={index}
                                      value={time}
                                      className="text-sm"
                                      disabled={isDisabled}
                                    >
                                      {time}
                                    </SelectItem>
                                  )
                                })
                              ) : (
                                <SelectItem value="00:00" disabled>
                                  <p className="text-gray-500 text-xs">
                                    Waktu yang kamu pilih sudah terisi. Silakan
                                    pilih waktu bermain di jam yang lain
                                  </p>
                                </SelectItem>
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Fade>
                </>
              )}
            </div>

            {/* Continue Button */}
            <Button
              type="button"
              onClick={handleContinue}
              className="font-medium text-white bg-orange w-full px-5 py-5 sm:py-6 rounded-full hover:bg-orange-600 text-sm sm:text-base mt-5 transition-all"
            >
              Continue
            </Button>
          </>
        ) : (
          <>
            {/* Checkout Summary */}
            <div className="flex flex-col gap-3 px-4 sm:px-5 bg-gray-700 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 border-opacity-25 shadow-md rounded-lg mt-5 py-5 sm:py-7">
              <div className="p-2 sm:p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center w-full">
                    <LoaderHome />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Fade>
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-medium leading-none text-white">
                          ID Reservasi
                        </h4>
                        <p className="text-sm sm:text-base text-gray-300">
                          {idReservasi}
                        </p>
                      </div>
                    </Fade>
                    <Separator className="my-2" />

                    <Fade>
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-medium leading-none text-white">
                          Nama
                        </h4>
                        <p className="text-sm sm:text-base text-gray-300">
                          {namaReservasi}
                        </p>
                      </div>
                    </Fade>
                    <Separator className="my-2" />

                    <Fade>
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-medium leading-none text-white">
                          No Whatsapp
                        </h4>
                        <p className="text-sm sm:text-base text-gray-300">
                          {nomorWhatsappReservasi}
                        </p>
                      </div>
                    </Fade>
                    <Separator className="my-2" />

                    <Fade>
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-medium leading-none text-white">
                          Tanggal Reservasi
                        </h4>
                        <p className="text-sm sm:text-base text-gray-300">
                          {formatDate(selectedDate)}
                        </p>
                      </div>
                    </Fade>
                    <Separator className="my-2" />

                    <Fade>
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-medium leading-none text-white">
                          Waktu Reservasi
                        </h4>
                        <p className="text-sm sm:text-base text-gray-300">
                          {startTimeReservasi} - {endTimeReservasi} -{' '}
                          {totalTime} Hours
                        </p>
                      </div>
                    </Fade>
                    <Separator className="my-2" />

                    <Fade>
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-medium leading-none text-white">
                          Detail Tempat
                        </h4>
                        <p className="text-sm sm:text-base text-gray-300">
                          in {namaPosisiReservasi}, Position {posisiReservasi}
                        </p>
                      </div>
                    </Fade>
                    <Separator className="my-2" />

                    <Fade>
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-medium leading-none text-white">
                          Total Harga
                        </h4>
                        <p className="text-sm sm:text-base text-gray-300">
                          Rp{' '}
                          {pricePackageDetermination(
                            posisiReservasi,
                            totalTime,
                            selectedCustomPrices != null
                              ? selectedCustomPrices
                              : parseInt(selectedPriceToday),
                          ).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </Fade>
                    <Separator className="my-2" />

                    <Fade>
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-medium leading-none text-white">
                          Service Charge
                        </h4>
                        <p className="text-sm sm:text-base text-gray-300">
                          Rp 4,000
                        </p>
                      </div>
                    </Fade>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Buttons */}
            <div className="flex flex-col gap-2 sm:gap-3 w-full mt-5">
              <Checkout
                id={idReservasi}
                price={safePrice}
                productName={`Reservation ${namaPosisiReservasi}`}
                detailCustomer={{
                  name: namaReservasi,
                  no: nomorWhatsappReservasi,
                  reserve_date: selectedDate,
                  reserve_start_time: startTimeReservasi,
                  reserve_end_time: endTimeReservasi,
                  position: posisiReservasi,
                  location: `${namaPosisiReservasi}`,
                }}
              />
              <Button
                variant="outline"
                onClick={handleCancel}
                className="rounded-lg px-5 py-5 sm:py-6 text-sm sm:text-base font-jakarta"
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
