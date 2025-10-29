'use client'

import Image from 'next/image'
import Link from 'next/link'
import Checkout from '../components/Checkout'
import React, { useEffect, useRef, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { Button } from '@/components/ui/button'
import {
  calculateTimeDifference,
  convertToStandardTime,
  extractHour,
  formatDate,
  formatDateIndonesian,
  formatTimestampIndonesian,
  generateTimeArray,
  generateTimeArrayWithStepUser,
  getIndonesianDay,
} from '@/utils/date'
import { generateRandomString } from '@/utils/id'
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
import { Calendar } from '@/components/ui/calendar'
import { addDays, format, startOfDay } from 'date-fns'
import axios from 'axios'
import { pricePackageDetermination } from '@/utils/price'
import { RESERVATION_PLACE } from '@/constans/reservations'
import getDocument from '@/firebase/firestore/getData'
import { capitalizeAndFormat, getFacilityId } from '@/utils/text'
import { useFetchPositions } from '@/hooks/useFetchPositions'
import { useFetchDataMaintenances } from '@/hooks/useFetchDataMaintenance'
import ReservationDrawer from './ReservationDrawer'
import ReservationLegend from './ReservationLegend'
import ReservationSummary from './ReservationSummary'
import LoaderHome from '../components/LoaderHome'
import { apiBaseUrl } from '@/utils/urls'
import Cookies from 'js-cookie'

export default function ReservationTesting() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(false)

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

  // User State
  const [user, setUser] = useState(null)
  const fetchUser = async () => {
    const token = Cookies.get('XSRF_CUST')
    const isLoggedIn = Cookies.get('isLoggedIn')

    if (!token || !isLoggedIn) return

    setIsLoadingUser(true)
    try {
      const res = await axios.get(`${apiBaseUrl}/customer/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(res.data)
      if (res.data.full_name) setNamaReservasi(res.data.full_name)
      if (res.data.whatsapp_number)
        setNoWhatsappReservasi(res.data.whatsapp_number)
      console.log('PENGGUNA', res)
      setIsLoadingUser(false)
    } catch (err) {
      console.error('Gagal memuat data pengguna:', err)
      Cookies.remove('XSRF_CUST')
      Cookies.remove('isLoggedIn')
      setIsLoadingUser(false)
    }
  }

  console.log('USER PENG', user)

  // Reservation State
  const [continueTapped, setContinueTapped] = useState(false)
  const [idReservasi, setIdReservasi] = useState(generateRandomString)
  const [namaReservasi, setNamaReservasi] = useState('')
  const [nomorWhatsappReservasi, setNoWhatsappReservasi] = useState('')
  const [startTimeReservasi, setStartTimeReservasi] = useState('')
  const [endTimeReservasi, setEndTimeReservasi] = useState('')
  const [totalTime, setTotalTime] = useState(0)
  const [pricePerReserve, setPricePerReserve] = useState(0)
  const [posisiReservasi, setPosisiReservasi] = useState(0)
  const [namaPosisiReservasi, setNamaPosisiReservasi] = useState('')
  const [selectedReservationPlace, setSelectedReservationPlace] = useState(null)
  const [date, setDate] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')

  // Content State
  const [reservationContent, setReservationContent] = useState(null)

  // Price Data State
  const [familyVIPRoomData, setFamilyVIPRoomData] = useState(null)
  const [lovebirdsVIPRoomData, setLovebirdsVIPRoomData] = useState(null)
  const [familyOpenSpaceData, setFamilyOpenSpaceData] = useState(null)
  const [squadOpenSpaceData, setSquadOpenSpaceData] = useState(null)
  const [ps4RegulerData, setPs4RegulerData] = useState(null)
  const [ps5RegulerData, setPs5RegulerData] = useState(null)
  const [ikuzoRacingSimulatorData, setIkuzoRacingSimulatorData] = useState(null)
  const [selectedCustomPrices, setSelectedCustomPrices] = useState(null)
  const [selectedPriceToday, setSelectedPriceToday] = useState('')

  // Time & Space State
  const [privateSpaceData, setPrivateSpaceData] = useState(null)
  const [regularSpaceData, setRegularSpaceData] = useState(null)
  const [premiumSpaceData, setPremiumSpaceData] = useState(null)
  const [customTimeSelected, setCustomTimeSelected] = useState([])
  const [dateClose, setDateClose] = useState([])

  // Reservation & Catalog State
  const [reserves, setReserves] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])
  const [reservesPosition, setReservesPosition] = useState([])
  const [catalogs, setCatalogs] = useState([])
  const [latestUpdatedAt, setLatestUpdatedAt] = useState('')

  // UI State
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef(null)

  // Fetch Functions
  const fetchDataPrices = async () => {
    const [
      dataFamilyRoom,
      dataLovebirdsRoom,
      dataFamilySpace,
      dataSquadOpenSpace,
      dataPs4Reguler,
      dataPs5Reguler,
      dataIkuzoRacingSimulator,
    ] = await Promise.all([
      getDocument('facility-setting-prices', 'family-vip-room'),
      getDocument('facility-setting-prices', 'lovebirds-vip-room'),
      getDocument('facility-setting-prices', 'family-open-space'),
      getDocument('facility-setting-prices', 'squad-open-space'),
      getDocument('facility-setting-prices', 'ps4-reguler'),
      getDocument('facility-setting-prices', 'ps5-reguler'),
      getDocument('facility-setting-prices', 'ikuzo-racing-simulator'),
    ])

    setFamilyVIPRoomData(dataFamilyRoom.data)
    setLovebirdsVIPRoomData(dataLovebirdsRoom.data)
    setSquadOpenSpaceData(dataSquadOpenSpace.data)
    setPs4RegulerData(dataPs4Reguler.data)
    setPs5RegulerData(dataPs5Reguler.data)
    setIkuzoRacingSimulatorData(dataIkuzoRacingSimulator.data)
    setFamilyOpenSpaceData(dataFamilySpace.data)
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
      console.error('Error fetching space settings:', error)
    }
  }

  const fetchDataContents = async () => {
    const dataContentReservation = await getDocument(
      'reservation-id',
      'reservation-id-doc',
    )
    setReservationContent(dataContentReservation.data)
  }

  const getAllReservationsPositon = async (date) => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/reservations?reserve_date=${date}`,
      )
      if (response.status === 200) {
        setReservesPosition(response.data)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.error(error)
    }
  }

  const getAllReservation = async (date, position) => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/reservations?reserve_date=${date}&position=${position}&status=settlement&pending=pending`,
      )
      if (response.status === 200) {
        setReserves(response.data)
        const slots = response.data.map((reserve) => ({
          startTime: reserve.reserve_start_time,
          endTime: reserve.reserve_end_time,
        }))
        setBookedSlots(slots)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.error(error)
    }
  }

  const getDateClosed = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/dates`)
      if (response.status === 200) {
        setDateClose(response.data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getTimeSelected = async (date) => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/times?selected_date=${date}`,
      )
      if (response.status === 200) {
        setCustomTimeSelected(
          response.data.data.length > 0 ? response.data.data : [],
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Price Calculation Functions
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

    getPriceByDate(facilityPriceMap[facilityId] || [], selectedDate)
    return facilityPriceMap[facilityId] || []
  }

  const getPriceByDate = (data, selectedDate) => {
    const found = data.find((item) => item.date === selectedDate)
    setSelectedCustomPrices(found ? found.price : null)
    return found ? found.price : null
  }

  const getPriceSetForToday = (value, selectedDate) => {
    const today = getIndonesianDay(selectedDate)
    const valueConverted = getFacilityId(value)

    const priceMap = {
      'ps5-reguler': ps5RegulerData?.prices,
      'ikuzo-racing-simulator': ikuzoRacingSimulatorData?.prices,
      'ps4-reguler': ps4RegulerData?.prices,
      'family-vip-room': familyVIPRoomData?.prices,
      'lovebirds-vip-room': lovebirdsVIPRoomData?.prices,
      'family-open-space': familyOpenSpaceData?.prices,
      'squad-open-space': squadOpenSpaceData?.prices,
    }

    const prices = priceMap[valueConverted] || []
    const foundPrice = prices.filter((item) =>
      item['day'].split(',').includes(today),
    )

    if (foundPrice.length > 0) {
      setSelectedPriceToday(foundPrice[0]['price'])
      return foundPrice[0]['price']
    }
    return null
  }

  const getTimeSetForToday = (value) => {
    const today = getIndonesianDay(selectedDate)
    const timeMap = {
      'regular-space': regularSpaceData?.times,
      'private-space': privateSpaceData?.times,
      'premium-space': premiumSpaceData?.times,
    }

    const times = timeMap[value] || []
    const foundItem = times.filter((item) =>
      item['time-day'].split(',').includes(today),
    )
    return foundItem.length === 1 ? foundItem[0]['time-set'] : null
  }

  const getTimeSetForTodayAgain = (value, selectedDate) => {
    const today = getIndonesianDay(selectedDate)
    const timeMap = {
      'regular-space': regularSpaceData?.times,
      'private-space': privateSpaceData?.times,
      'premium-space': premiumSpaceData?.times,
    }

    const times = timeMap[value] || []
    const foundItem = times.filter((item) =>
      item['time-day'].split(',').includes(today),
    )
    return foundItem.length === 1 ? foundItem[0]['time-set'] : null
  }

  // Event Handlers
  const handleZoomIn = () => setScale((prev) => prev + 0.1)
  const handleZoomOut = () => setScale((prev) => prev - 0.1)

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
      setContinueTapped(!continueTapped)
      setTimeout(() => setIsLoading(false), 4000)
    } else {
      alert('Please fill in all required inputs.')
    }
  }

  const handleCancle = async () => {
    try {
      await axios.delete(`${apiBaseUrl}/reservations/${idReservasi}`)
      setNamaReservasi('')
      setNoWhatsappReservasi('')
      setSelectedReservationPlace('')
      setSelectedDate('')
      setStartTimeReservasi('')
      setSelectedPriceToday('')
      setEndTimeReservasi('')
      setIdReservasi('')
      setPosisiReservasi(0)
      setNamaPosisiReservasi('')
      setContinueTapped(!continueTapped)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchingAvailableReservation = async (date, position) => {
    getAllReservation(date, position)
  }

  // Computed Values
  const disableTimes = reserves
    .map((reserve) => {
      if (reserve.reserve_end_time) {
        const [hour, minute] = reserve.reserve_end_time.split(':')
        return `${hour}:${minute}`
      }
      return null
    })
    .filter((time) => time !== null)

  const timeSet = getTimeSetForTodayAgain(
    selectedReservationPlace,
    selectedDate,
  )

  const fallbackTimeArray = [
    { open_time: 10, close_time: 23, date: selectedDate },
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

  const fallbackPrice = parseInt(selectedPriceToday)
  const actualPrice = fallbackPrice
  const finalPrice = pricePackageDetermination(
    posisiReservasi,
    totalTime,
    actualPrice,
  )
  const safePrice = isNaN(finalPrice) ? 0 : finalPrice + 4000

  // Effects
  useEffect(() => {
    fetchPositions()
  }, [fetchPositions])

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    fetchDataTimes()
    getAllDataMaintenances()
    fetchDataContents()
    fetchDataPrices()
    getDateClosed()

    const snapScript = 'https://app.midtrans.com/snap/snap.js'
    const clientKey = process.env.NEXT_PUBLIC_CLIENT
    const script = document.createElement('script')
    script.src = snapScript
    script.setAttribute('data-client-key', clientKey)
    script.async = true
    document.body.appendChild(script)

    const timeDiff = calculateTimeDifference(
      startTimeReservasi,
      endTimeReservasi,
    )
    setTotalTime(timeDiff)

    return () => {
      document.body.removeChild(script)
    }
  }, [startTimeReservasi, endTimeReservasi])

  // Render Position Drawer
  const renderPositionDrawer = (numbers, getPositionIndex, prices) => {
    return numbers.map((number) => {
      const isSeatInMaintenance = dataMaintenance.find(
        (s) => s.no_seat === number,
      )
      const positionIndex = getPositionIndex

      return (
        <ReservationDrawer
          key={number}
          number={number}
          position={{ x: 0, y: 0 }}
          scale={1}
          positionData={positions[positionIndex]}
          selectedDate={selectedDate}
          selectedPosition={posisiReservasi} // Tambahkan ini
          onPositionClick={(number, date) => {
            setPosisiReservasi(number)
            setNamaPosisiReservasi(positions[positionIndex].name)
            setPricePerReserve(positions[positionIndex].price)
            getPriceSetForToday(positions[positionIndex].name, date)
            getPriceDataCustom(positions[positionIndex].name)
            fetchingAvailableReservation(date, number)
          }}
          reserves={reserves}
          isSeatInMaintenance={!!isSeatInMaintenance}
          timeSet={timeSet}
          generatedTimes={generatedTimes}
          timeArray={timeArray}
          disableTimes={disableTimes}
          catalogs={catalogs}
          latestUpdatedAt={latestUpdatedAt}
          startTime={startTimeReservasi}
          endTime={endTimeReservasi}
          onStartTimeChange={setStartTimeReservasi}
          onEndTimeChange={setEndTimeReservasi}
          facilityPriceData={prices}
          formatDateIndonesian={formatDateIndonesian}
          formatTimestampIndonesian={formatTimestampIndonesian}
        />
      )
    })
  }

  // Loading Check
  const isLoadingData =
    reservationContent == null ||
    regularSpaceData == null ||
    privateSpaceData == null ||
    premiumSpaceData == null ||
    familyVIPRoomData == null ||
    familyOpenSpaceData == null ||
    squadOpenSpaceData == null ||
    lovebirdsVIPRoomData == null ||
    ps4RegulerData == null ||
    ps5RegulerData == null ||
    ikuzoRacingSimulatorData == null ||
    isLoadingMaintenance

  if (isLoadingData || isLoadingUser) {
    return (
      <div className="z-[999999] w-full h-full absolute top-50">
        <LoaderHome />
      </div>
    )
  }

  return (
    <section className="bg-transparent w-full h-full md:max-w-4xl md:mx-auto font-jakarta px-5 py-5 md:pb-10 absolute z-50">
      <Link href="/" className="flex items-center justify-center">
        <Fade>
          <Image
            src="/logo-orange.png"
            alt="Ikuzo Playstation Logo"
            title="Ikuzo Playstation Logo"
            width={150}
            height={50}
            className="w-[150px] h-fit"
          />
        </Fade>
      </Link>

      <div className="px-5 py-5 text-black bg-gray-700 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 border-opacity-25 shadow-md rounded-lg flex flex-col text-center gap-3 items-center justify-center">
        <Fade>
          <Image
            src={!continueTapped ? '/reserve.png' : '/checkout.png'}
            width={56}
            height={56}
            alt="Reservation"
            className="w-14"
          />
        </Fade>

        <Fade>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold uppercase font-montserrat leading-none text-orange">
              {!continueTapped
                ? reservationContent['reservation-title']
                : 'Payment'}
            </h1>
            <p className="text-sm font-normal text-white">
              {!continueTapped
                ? reservationContent['reservation-description']
                : 'Lakukan pembayaran segera untuk reservasi'}
            </p>
          </div>
        </Fade>
      </div>

      {!continueTapped ? (
        <>
          <div className="flex flex-col gap-3 px-5 bg-gray-700 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 border-opacity-25 shadow-md rounded-lg mt-5 py-7">
            {/* Name Input */}
            <Fade>
              <div className="flex flex-col gap-2">
                <label className="text-white" htmlFor="nama">
                  {reservationContent['label-name']}
                </label>
                <input
                  type="text"
                  value={namaReservasi}
                  onChange={(e) => setNamaReservasi(e.target.value)}
                  name="nama"
                  id="nama"
                  placeholder={reservationContent['placeholder-name']}
                  className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg px-3 py-2 active:border-orange focus:border-orange outline-none focus:outline-orange"
                  required
                />
              </div>
            </Fade>

            {/* WhatsApp Input */}
            <Fade delay={500} duration={1100}>
              <div className="flex flex-col gap-2">
                <label className="text-white" htmlFor="nomor_whatsapp">
                  {reservationContent['label-whatsapp']}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                    +62
                  </span>
                  <input
                    type="tel"
                    name="nomor_whatsapp"
                    id="nomor_whatsapp"
                    placeholder="812345678"
                    className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg pl-12 pr-3 py-2 active:border-orange focus:border-orange outline-none focus:outline-orange w-full"
                    value={
                      nomorWhatsappReservasi.startsWith('62')
                        ? nomorWhatsappReservasi.slice(2)
                        : nomorWhatsappReservasi
                    }
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '') // Hanya angka
                      setNoWhatsappReservasi('62' + value)
                    }}
                    required
                  />
                </div>
              </div>
            </Fade>

            {/* Date Input */}
            <Fade delay={600} duration={1200}>
              <div className="flex flex-col gap-2">
                <label className="text-white" htmlFor="tanggal_reservasi">
                  {reservationContent['label-tanggal-reservasi']}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <input
                      type="text"
                      value={selectedDate}
                      name="tanggal_reservasi"
                      id="tanggal_reservasi"
                      placeholder={
                        reservationContent['placeholder-tanggal-reservasi']
                      }
                      className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg px-3 py-2 active:border-orange focus:border-orange outline-none focus:outline-orange w-full"
                      required
                      readOnly
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => {
                        setDate(date)
                        const formattedDate = format(date, 'yyyy-MM-dd')
                        setSelectedDate(formattedDate)
                        getAllReservationsPositon(formattedDate)
                        if (selectedReservationPlace) {
                          getTimeSetForTodayAgain(
                            selectedReservationPlace,
                            formattedDate,
                          )
                        }
                        getTimeSelected(formattedDate)
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
            <Fade delay={700} duration={1300}>
              <div className="flex flex-col gap-2">
                <label className="text-white" htmlFor="tempat">
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
                  <SelectTrigger className="py-5 px-3 text-base text-white">
                    <SelectValue placeholder="Choose Space">
                      {selectedReservationPlace
                        ? capitalizeAndFormat(selectedReservationPlace)
                        : 'Choose Space'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="w-4/5 ml-3" side="top">
                    <SelectGroup>
                      <SelectLabel className="text-base">
                        Pilih Tempat Reservasi
                      </SelectLabel>
                      {RESERVATION_PLACE.map((place, index) => (
                        <SelectItem
                          key={index}
                          className="text-base"
                          value={place.slug}
                        >
                          <div className="flex flex-col gap-1">
                            <span>{place.name}</span>
                            {regularSpaceData &&
                              premiumSpaceData &&
                              privateSpaceData && (
                                <span className="text-gray-500 flex flex-col gap-0">
                                  {(place.slug === 'regular-space' &&
                                    regularSpaceData.times) ||
                                  (place.slug === 'private-space' &&
                                    privateSpaceData.times) ||
                                  (place.slug === 'premium-space' &&
                                    premiumSpaceData.times)
                                    ? (place.slug === 'regular-space'
                                        ? regularSpaceData.times
                                        : place.slug === 'private-space'
                                        ? privateSpaceData.times
                                        : premiumSpaceData.times
                                      ).map((time, idx) => (
                                        <span key={idx}>
                                          {time['time-day']} -{' '}
                                          {time['time-set']['start-time']} -{' '}
                                          {convertToStandardTime(
                                            time['time-set']['end-time'],
                                          )}
                                        </span>
                                      ))
                                    : null}
                                </span>
                              )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </Fade>

            {/* Map Display */}
            <Fade delay={800} duration={1400}>
              <div className="flex-relative w-full h-fit">
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Zoom Controls */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '8px',
                      backgroundColor: 'white',
                      borderRadius: '8px 0 8px',
                      overflow: 'hidden',
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      zIndex: 100,
                    }}
                  >
                    <button
                      className="border-none text-[#737373] bg-white p-3 text-lg cursor-pointer"
                      onClick={handleZoomIn}
                    >
                      +
                    </button>
                    <button
                      className="border-none text-[#737373] bg-white p-3 text-lg cursor-pointer"
                      onClick={handleZoomOut}
                    >
                      -
                    </button>
                  </div>

                  {/* Map Image */}
                  <img
                    src={
                      selectedReservationPlace === 'regular-space'
                        ? '/first-floor.jpg'
                        : selectedReservationPlace === 'premium-space'
                        ? '/premium-space.PNG'
                        : '/private-space.PNG'
                    }
                    alt="Floor Map"
                    style={{
                      width: '100%',
                      height: 'auto',
                      transform: `${
                        selectedReservationPlace === 'regular-space'
                          ? 'scale(1.4)'
                          : 'scale(1)'
                      } translate(${position.x}px, ${position.y}px)`,
                      cursor: 'move',
                    }}
                  />

                  {/* Regular Space Seats */}
                  {selectedReservationPlace === 'regular-space' &&
                    selectedDate && (
                      <div className="flex flex-col mb-6 w-full">
                        {/* Seats 1-5 */}
                        <div
                          className="flex flex-row justify-around w-full top-10 absolute z-50"
                          ref={imageRef}
                          style={{
                            width: '100%',
                            height: 'auto',
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            cursor: 'move',
                          }}
                        >
                          {renderPositionDrawer(
                            [1, 2, 3, 4, 5],
                            0,
                            ps5RegulerData,
                          )}
                        </div>

                        {/* Seats 6-7 */}
                        <div
                          className="flex flex-row justify-around md:w-64 w-24 bottom-10 absolute z-50 left-7 md:left-20"
                          ref={imageRef}
                          style={{
                            height: 'auto',
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            cursor: 'move',
                          }}
                        >
                          {renderPositionDrawer(
                            [6, 7],
                            1,
                            ikuzoRacingSimulatorData,
                          )}
                        </div>

                        {/* Seat 8 */}
                        <div
                          className="flex flex-row justify-around w-fit bottom-10 absolute z-50 left-40 -ml-2 md:left-[53.5%] ml-2"
                          ref={imageRef}
                          style={{
                            height: 'auto',
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            cursor: 'move',
                          }}
                        >
                          {renderPositionDrawer([8], 0, ps4RegulerData)}
                        </div>
                      </div>
                    )}

                  {/* Premium Space Seats */}
                  {selectedReservationPlace === 'premium-space' &&
                    selectedDate && (
                      <div className="flex flex-col mb-6">
                        {/* Seats 13-16 */}
                        <div
                          className="flex flex-row w-full top-5 gap-8 md:gap-16 absolute left-7 md:top-10 md:left-20 z-50"
                          ref={imageRef}
                          style={{
                            height: 'auto',
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            cursor: 'move',
                          }}
                        >
                          {renderPositionDrawer(
                            [13, 14, 15, 16],
                            3,
                            squadOpenSpaceData,
                          )}
                        </div>

                        {/* Seat 17 */}
                        <div
                          className="flex flex-row w-auto bottom-12 gap-16 absolute left-[46%] md:bottom-20 z-50"
                          ref={imageRef}
                          style={{
                            height: 'auto',
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            cursor: 'move',
                          }}
                        >
                          {renderPositionDrawer([17], 2, familyOpenSpaceData)}
                        </div>
                      </div>
                    )}

                  {/* Private Space Seats */}
                  {selectedReservationPlace === 'private-space' &&
                    selectedDate && (
                      <div className="flex flex-col mb-6">
                        {/* Seats 18-19 */}
                        <div
                          className="flex flex-row w-auto top-7 gap-16 md:gap-64 absolute left-[16%] md:top-16 z-50"
                          ref={imageRef}
                          style={{
                            height: 'auto',
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            cursor: 'move',
                          }}
                        >
                          {renderPositionDrawer([18, 19], 4, familyVIPRoomData)}
                        </div>

                        {/* Seats 20-22 */}
                        <div
                          className="flex flex-row w-full top-[11rem] md:top-[26rem] gap-3 md:gap-24 absolute left-6 md:left-32 z-50"
                          ref={imageRef}
                          style={{
                            height: 'auto',
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            cursor: 'move',
                          }}
                        >
                          {renderPositionDrawer(
                            [20, 21, 22],
                            5,
                            lovebirdsVIPRoomData,
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </Fade>

            <ReservationLegend />
          </div>
        </>
      ) : (
        <ReservationSummary
          isLoading={isLoading}
          idReservasi={idReservasi}
          namaReservasi={namaReservasi}
          nomorWhatsappReservasi={nomorWhatsappReservasi}
          selectedDate={selectedDate}
          startTimeReservasi={startTimeReservasi}
          endTimeReservasi={endTimeReservasi}
          totalTime={totalTime}
          namaPosisiReservasi={namaPosisiReservasi}
          posisiReservasi={posisiReservasi}
          totalHarga={pricePackageDetermination(
            posisiReservasi,
            totalTime,
            selectedCustomPrices != null
              ? selectedCustomPrices
              : parseInt(selectedPriceToday),
          )}
          serviceCharge={4000}
          formatDate={formatDate}
        />
      )}

      {/* Action Buttons */}
      {!continueTapped ? (
        <Button
          type="button"
          onClick={handleContinue}
          className="font-medium text-white bg-orange w-full px-5 py-6 rounded-full hover:bg-orange text-base mt-5"
        >
          Continue
        </Button>
      ) : (
        <div className="flex flex-col gap-1 w-full mt-5">
          <Checkout
            id={idReservasi}
            idMembership={user.id}
            price={safePrice}
            productName={`Reservation ${namaPosisiReservasi}`}
            detailCustomer={{
              name: namaReservasi,
              no: nomorWhatsappReservasi,
              reserve_date: selectedDate,
              reserve_start_time: startTimeReservasi,
              reserve_end_time: endTimeReservasi,
              position: posisiReservasi,
              location: namaPosisiReservasi,
            }}
          />
          <Button
            variant="outline"
            onClick={handleCancle}
            className="rounded-lg px-5 py-6 text-base font-jakarta"
          >
            Cancel
          </Button>
        </div>
      )}
    </section>
  )
}
