'use client'

import Image from 'next/image'
import Link from 'next/link'
import Checkout from '../components/Checkout'
import React, { useEffect, useRef, useState } from 'react'

// REVEAL
import { Fade } from 'react-awesome-reveal'

// UI COMPONENTS
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  calculateTimeDifference,
  convertToDate,
  convertToExtendedTime,
  convertToStandardTime,
  extractHour,
  formatDate,
  formatDateIndonesian,
  formatTimestampIndonesian,
  generateTimeArray,
  generateTimeArrayWithStep,
  generateTimeArrayWithStepUser,
  getCurrentDate,
  getCurrentTime,
  getIndonesianDay,
  getMaxDate,
  getMaxTime,
  getToday,
} from '@/utils/date'
import { generateRandomString } from '@/utils/id'
import { HashLoader } from 'react-spinners'
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
import { addDays, subDays, format, startOfDay } from 'date-fns'
import axios from 'axios'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import LoaderHome from '../components/LoaderHome'
import { pricePackageDetermination } from '@/utils/price'
import { IoMdBook, IoMdClose } from 'react-icons/io'
import { RESERVATION_PLACE } from '@/constans/reservations'
import getDocument from '@/firebase/firestore/getData'
import { capitalizeAndFormat, getFacilityId } from '@/utils/text'
import { MdOutlineUpdate } from 'react-icons/md'

export default function Reservation() {
  // RESERVATION STATE DATA
  const [continueTapped, setContinueTapped] = React.useState(false)
  const [idReservasi, setIdReservasi] = React.useState(generateRandomString)
  const [namaReservasi, setNamaReservasi] = React.useState('')
  const [nomorWhatsappReservasi, setNoWhatsappReservasi] = React.useState('')
  const [startTimeReservasi, setStartTimeReservasi] = React.useState('')
  const [endTimeReservasi, setEndTimeReservasi] = React.useState('')
  const [totalTime, setTotalTime] = React.useState(null)
  const [currentDate, setCurrentDate] = React.useState(getCurrentDate)
  const [maxDate, setMaxDate] = React.useState(getMaxDate)
  const [currentTime, setCurrentTime] = React.useState(getCurrentTime)
  const [maxTime, setMaxTime] = React.useState(getMaxTime)
  const [isLoading, setIsLoading] = React.useState(false)
  const [pricePerReserve, setPricePerReserve] = React.useState(0)

  const [reservationContent, setReservationContent] = React.useState(null)

  const [familyVIPRoomData, setFamilyVIPRoomData] = React.useState(null)
  const [lovebirdsVIPRoomData, setLovebirdsVIPRoomData] = React.useState(null)
  const [familyOpenSpaceData, setFamilyOpenSpaceData] = React.useState(null)
  const [squadOpenSpaceData, setSquadOpenSpaceData] = React.useState(null)
  const [ps4RegulerData, setPs4RegulerData] = React.useState(null)
  const [ps5RegulerData, setPs5RegulerData] = React.useState(null)
  const [
    ikuzoRacingSimulatorData,
    setIkuzoRacingSimulatorData,
  ] = React.useState(null)

  async function fetchDataPrices() {
    const dataFamilyRoom = await getDocument(
      'facility-setting-prices',
      'family-vip-room',
    )
    const dataLovebirdsRoom = await getDocument(
      'facility-setting-prices',
      'lovebirds-vip-room',
    )
    const dataFamilySpace = await getDocument(
      'facility-setting-prices',
      'family-open-space',
    )
    const dataSquadOpenSpace = await getDocument(
      'facility-setting-prices',
      'squad-open-space',
    )
    const dataPs4Reguler = await getDocument(
      'facility-setting-prices',
      'ps4-reguler',
    )
    const dataPs5Reguler = await getDocument(
      'facility-setting-prices',
      'ps5-reguler',
    )
    const dataIkuzoRacingSimulator = await getDocument(
      'facility-setting-prices',
      'ikuzo-racing-simulator',
    )
    setFamilyVIPRoomData(dataFamilyRoom.data)
    setLovebirdsVIPRoomData(dataLovebirdsRoom.data)
    setSquadOpenSpaceData(dataSquadOpenSpace.data)
    setPs4RegulerData(dataPs4Reguler.data)
    setPs5RegulerData(dataPs5Reguler.data)
    setIkuzoRacingSimulatorData(dataIkuzoRacingSimulator.data)
    setFamilyOpenSpaceData(dataFamilySpace.data)
  }

  const [selectedCustomPrices, setSelectedCustomPrices] = React.useState(null)
  const getPriceDataCustom = (facilityName) => {
    const facilityId = getFacilityId(facilityName)

    const facilityPriceMap = {
      'ps5-reguler': ps5RegulerData['custom-prices'],
      'ikuzo-racing-simulator': ikuzoRacingSimulatorData['custom-prices'],
      'ps4-reguler': ps4RegulerData['custom-prices'],
      'family-vip-room': familyVIPRoomData['custom-prices'],
      'lovebirds-vip-room': lovebirdsVIPRoomData['custom-prices'],
      'family-open-space': familyOpenSpaceData['custom-prices'],
      'squad-open-space': squadOpenSpaceData['custom-prices'],
    }

    console.log('GET PRICE DATA CUSTOM', facilityPriceMap[facilityId] || [])
    getPriceByDate(facilityPriceMap[facilityId] || [], selectedDate)
    return facilityPriceMap[facilityId] || []
  }

  const getPriceByDate = (data, selectedDate) => {
    const found = data.find((item) => item.date === selectedDate)
    setSelectedCustomPrices(found ? found.price : null)
    return found ? found.price : null
  }

  async function fetchDataContents() {
    const dataContentReservation = await getDocument(
      'reservation-id',
      'reservation-id-doc',
    )
    setReservationContent(dataContentReservation.data)
  }

  const [reserves, setReserves] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])
  const [reservesPosition, setReservesPosition] = useState([])

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const getAllReservationsPositon = async (date) => {
    try {
      const response = await axios.get(
        `${baseUrl}/reservations?reserve_date=${date}`,
      )
      if (response.status == 200) {
        const jsonData = await response.data

        setReservesPosition(jsonData)

        setIsLoading(false)
      } else {
        setIsLoading(false)
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      setIsLoading(false)
    }
  }

  const getAllReservation = async (date, position) => {
    try {
      const response = await axios.get(
        `${baseUrl}/reservations?reserve_date=${date}&position=${position}&status=settlement&pending=pending`,
      )

      if (response.status == 200) {
        const jsonData = await response.data

        setReserves(jsonData)
        const slots = jsonData.map((reserve) => ({
          startTime: reserve.reserve_start_time,
          endTime: reserve.reserve_end_time,
        }))
        setBookedSlots(slots)
        setIsLoading(false)
      } else {
        setIsLoading(false)
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      setIsLoading(false)
    }
  }

  const [positions, setPositions] = useState([])

  const getAllPositions = async () => {
    try {
      const response = await axios.get(`${baseUrl}/content-facilities`)
      if (response.status == 200) {
        const jsonData = await response.data

        setPositions(jsonData.data)

        console.log({ jsonData })

        setIsLoading(false)
      } else {
        setIsLoading(false)
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      setIsLoading(false)
    }
  }

  const [customTimeSelected, setCustomTimeSelected] = React.useState([])
  const [dateClose, setDateClose] = React.useState([])

  const getDateClosed = async () => {
    try {
      const response = await axios.get(`${baseUrl}/dates`)
      if (response.status == 200) {
        const jsonData = await response.data

        setDateClose(jsonData.data)
        console.log('DATE CLOSE', jsonData.data)
      } else {
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      setIsLoading(false)
    }
  }

  const getTimeSelected = async (date) => {
    try {
      const response = await axios.get(`${baseUrl}/times?selected_date=${date}`)
      if (response.status == 200) {
        const jsonData = await response.data

        console.log({ jsonData })

        if (jsonData.data.length > 0) {
          setCustomTimeSelected(jsonData.data)
        } else {
          setCustomTimeSelected([])
        }
      } else {
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      setIsLoading(false)
    }
  }

  /***********************************************************
   * functions & states for scaling image
   ***********************************************************/
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef(null)

  const [posisiReservasi, setPosisiReservasi] = useState(0)
  const [namaPosisiReservasi, setNamaPosisiReservasi] = useState('')

  const handleZoomIn = () => {
    setScale((scale) => scale + 0.1)
  }

  const handleZoomOut = () => {
    setScale((scale) => scale - 0.1)
  }

  const handleContinue = () => {
    const data = {
      nama: namaReservasi,
      noWhatsapp: nomorWhatsappReservasi,
      tanggal: selectedDate,
      location: location,
      startTimeReservasi: startTimeReservasi,
      endTimeReservasi: endTimeReservasi,
      position: posisiReservasi,
    }

    // Assuming you have some state variables for your input values
    if (
      namaReservasi &&
      nomorWhatsappReservasi &&
      selectedReservationPlace &&
      selectedDate &&
      startTimeReservasi &&
      endTimeReservasi &&
      posisiReservasi &&
      totalTime != 0
    ) {
      // Scroll to the top of the page
      window.scrollTo(0, 0)

      // Set isLoading to true
      setIsLoading(true)

      // Set continueTapped to true
      setContinueTapped(!continueTapped)

      // Delay setting isLoading back to false by 4 seconds (4000 milliseconds)
      setTimeout(() => {
        setIsLoading(false)
      }, 4000)
    } else {
      // Handle case where not all required inputs are filled
      alert('Please fill in all required inputs.')
    }
  }

  const handleCancle = async (alt) => {
    try {
      const response = await axios
        .delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/reservations/${idReservasi}`,
        )
        .then((response) => {
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
        })
        .catch((error) => {})
    } catch (error) {
      throw new Error(error)
    }
  }

  const fetchingAvailableReservation = async (date, position) => {
    getAllReservation(date, position)
  }

  const [date, setDate] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')

  const disableTimes =
    reserves.length > 0
      ? reserves
          .map((reserve) => {
            if (reserve.reserve_end_time) {
              const [hour, minute, second] = reserve.reserve_end_time.split(':')
              const formattedTime = `${hour}:${minute}`
              return formattedTime
            }
            return null
          })
          .filter((time) => time !== null)
      : []

  const [drawerContent, setDrawerContent] = useState('default')
  const [selectedSeat, setSelectedSeat] = React.useState(0)
  const [catalogs, setCatalogs] = React.useState([])

  const [latestUpdatedAt, setLatestUpdatedAt] = useState('')

  const handleCatalogClick = async (noSeat) => {
    setSelectedSeat(noSeat)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/catalogs?no_seat=${noSeat}`,
      )

      if (response.data && response.data.length > 0) {
        const sortedCatalogs = response.data.sort((a, b) =>
          a.catalog_txt.localeCompare(b.catalog_txt),
        ) // Sort alphabetically (A-Z)

        // Find the latest updated_at value
        const latestUpdatedAt = response.data.reduce((latest, catalog) => {
          return new Date(catalog.updated_at) > new Date(latest.updated_at)
            ? catalog
            : latest
        }, response.data[0]).updated_at

        setDrawerContent('catalog')
        setCatalogs(sortedCatalogs)
        setLatestUpdatedAt(latestUpdatedAt)
      } else {
        throw new Error('No catalog data found')
      }
    } catch (error) {
      setDrawerContent('catalog')
      setCatalogs([])
      console.error('Error fetching catalog data:', error)
    }
  }

  console.log({ catalogs })
  console.log({ latestUpdatedAt })

  const [
    selectedReservationPlace,
    setSelectedReservationPlace,
  ] = React.useState(null)

  // FILTERING CATALOGS FEATURE
  const [filterKeyword, setFilterKeyword] = React.useState('')
  const [filteredCatalogs, setFilteredCatalogs] = React.useState([])
  const handleInputFilterCatalogChange = (e) => {
    const value = e.target.value.toLowerCase()
    const filteredAndSortedCatalogs = catalogs
      .filter((catalog) => catalog.catalog_txt.toLowerCase().includes(value))
      .sort((a, b) => a.catalog_txt.localeCompare(b.catalog_txt)) // Sort alphabetically

    setFilteredCatalogs(filteredAndSortedCatalogs)
  }

  const handleCloseCatalogClick = () => {
    setDrawerContent('default')
    setFilteredCatalogs([])
    setFilterKeyword('')
  }

  const [privateSpaceData, setPrivateSpaceData] = React.useState(null)
  const [regularSpaceData, setRegularSpaceData] = React.useState(null)
  const [premiumSpaceData, setPremiumSpaceData] = React.useState(null)

  async function fetchDataTimes() {
    try {
      const responses = await Promise.all([
        getDocument('space-setting-times', 'private-space-doc'), // Index 0
        getDocument('space-setting-times', 'premium-space-doc'), // Index 1
        getDocument('space-setting-times', 'regular-space-doc'), // Index 2
      ])

      const privateData = responses[0]?.data
      const premiumData = responses[1]?.data
      const regularData = responses[2]?.data

      setPrivateSpaceData(privateData)
      setPremiumSpaceData(premiumData)
      setRegularSpaceData(regularData)
    } catch (error) {
      console.error('Error fetching space settings:', error)
    }
  }

  const getTimeSetForToday = (value) => {
    const today = getIndonesianDay(selectedDate) // Get today's day

    const times =
      value === 'regular-space'
        ? regularSpaceData.times
        : value === 'private-space'
        ? privateSpaceData.times
        : value === 'premium-space'
        ? premiumSpaceData.times
        : []

    console.log({ value, today, times })

    // Find time-set where today's day exists
    const foundItem = times.filter((item) =>
      item['time-day'].split(',').includes(today),
    )

    console.log({ foundItem })

    return foundItem.length === 1 ? foundItem[0]['time-set'] : null
  }

  const [selectedPriceToday, setSelectedPriceToday] = React.useState('')

  const getPriceSetForToday = (value, selectedDate) => {
    const today = getIndonesianDay(selectedDate)
    const valueConverted = getFacilityId(value)
    const prices =
      valueConverted === 'ps5-reguler'
        ? ps5RegulerData.prices
        : valueConverted === 'ikuzo-racing-simulator'
        ? ikuzoRacingSimulatorData.prices
        : valueConverted === 'ps4-reguler'
        ? ps4RegulerData.prices
        : valueConverted === 'family-vip-room'
        ? familyVIPRoomData.prices
        : valueConverted === 'lovebirds-vip-room'
        ? lovebirdsVIPRoomData.prices
        : valueConverted === 'family-open-space'
        ? familyOpenSpaceData.prices
        : valueConverted === 'squad-open-space'
        ? squadOpenSpaceData.prices
        : []

    console.log({ value, today, prices })

    // Find time-set where today's day exists
    const foundPrice = prices.filter((item) =>
      item['day'].split(',').includes(today),
    )

    console.log({ foundPrice })

    foundPrice.length === 1
      ? setSelectedPriceToday(foundPrice[0]['price'])
      : setSelectedPriceToday('')

    return foundPrice.length === 1 ? foundPrice[0]['price'] : ''
  }

  console.log({ getPriceSetForToday })
  console.log({ selectedPriceToday })

  const getTimeSetForTodayAgain = (value, selectedDate) => {
    const today = getIndonesianDay(selectedDate) // Get today's day

    const times =
      value === 'regular-space'
        ? regularSpaceData.times
        : value === 'private-space'
        ? privateSpaceData.times
        : value === 'premium-space'
        ? premiumSpaceData.times
        : []

    console.log({ value, today, times })

    // Find time-set where today's day exists
    const foundItem = times.filter((item) =>
      item['time-day'].split(',').includes(today),
    )

    console.log({ foundItem })

    return foundItem.length === 1 ? foundItem[0]['time-set'] : null
  }

  console.log({ regularSpaceData })
  console.log({ premiumSpaceData })
  console.log({ privateSpaceData })

  useEffect(() => {
    fetchDataTimes()

    const snapScript = 'https://app.midtrans.com/snap/snap.js'
    const clientKey = process.env.NEXT_PUBLIC_CLIENT
    const script = document.createElement('script')
    script.src = snapScript
    script.setAttribute('data-client-key', clientKey)
    script.async = true
    const getTimeDIfferent = calculateTimeDifference(
      startTimeReservasi,
      endTimeReservasi,
    )
    getDateClosed()
    setTotalTime(getTimeDIfferent)

    document.body.appendChild(script)

    const image = imageRef.current
    let isDragging = false
    let prevPosition = { x: 0, y: 0 }
    const handleMouseDown = (e) => {
      isDragging = false
      prevPosition = getEventPosition(e)
    }

    const handleMouseMove = (e) => {
      if (!isDragging) return
      const currentPosition = getEventPosition(e)
      const deltaX = currentPosition.x - prevPosition.x
      const deltaY = currentPosition.y - prevPosition.y
      prevPosition = currentPosition
      setPosition((position) => ({
        x: position.x + deltaX,
        y: position.y + deltaY,
      }))
    }

    const getEventPosition = (e) => {
      if (e.touches && e.touches.length) {
        return {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        }
      }
      return {
        x: e.clientX,
        y: e.clientY,
      }
    }

    const getAllReservationWithoutState = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/reservations?reserve_date=${selectedDate}`,
        )
        if (response.status == 200) {
          const jsonData = await response.data

          setReservesPosition(jsonData)

          setIsLoading(false)
        } else {
          setIsLoading(false)
          throw new Error('Failed to fetch data')
        }
      } catch (error) {
        setIsLoading(false)
      }
    }

    getAllPositions()
    fetchDataContents()
    fetchDataPrices()

    const intervalTime = 500
    const interval = setInterval(() => {
      getAllReservationWithoutState
    }, intervalTime)

    return () => {
      document.body.removeChild(script)
      clearInterval(interval)
    }
  }, [startTimeReservasi, endTimeReservasi, imageRef, scale])

  const timeSet = getTimeSetForTodayAgain(
    selectedReservationPlace,
    selectedDate,
  )

  console.log({ timeSet })

  const fallbackTimeArray = [
    {
      open_time: 10,
      close_time: 23,
      date: selectedDate,
    },
  ]

  let timeArrayStart =
    timeSet === null
      ? fallbackTimeArray
      : [
          {
            open_time: extractHour(timeSet['start-time']),
            close_time: extractHour(timeSet['end-time']), // Ensure using end-time
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

  return (
    <>
      {reservationContent == null ||
      regularSpaceData == null ||
      privateSpaceData == null ||
      premiumSpaceData == null ||
      familyVIPRoomData == null ||
      familyOpenSpaceData == null ||
      squadOpenSpaceData == null ||
      lovebirdsVIPRoomData == null ||
      ps4RegulerData == null ||
      ps5RegulerData == null ||
      ikuzoRacingSimulatorData == null ? (
        <div className=" z-[999999] w-full h-full absolute top-50">
          <LoaderHome />
        </div>
      ) : (
        <section className="bg-transparent w-full h-full md:max-w-4xl md:mx-auto font-jakarta px-5 py-5 md:pb-10 absolute z-50">
          <Link href="/" className="flex items-center justify-center">
            <Fade>
              <Image
                src={'/logo-orange.png'}
                alt={'Ikuzo Playstation Logo'}
                title={'Ikuzo Playstation Logo'}
                width={0}
                height={0}
                className="w-[150px] h-fit"
              />
            </Fade>
          </Link>

          <div className="px-5 py-5 text-black bg-gray-700 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 border-opacity-25 shadow-md rounded-lg flex flex-col text-center gap-3 items-center justify-center">
            <Fade>
              <Image
                src={!continueTapped ? '/reserve.png' : '/checkout.png'}
                width={0}
                height={0}
                alt={'Reservation'}
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
                      className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg px-3 py-2 active:border-orange focus:border-orange outline-none focus:outline-orange   "
                      required
                    />
                  </div>
                </Fade>

                <Fade delay={5} duration={1100}>
                  <div className="flex flex-col gap-2">
                    <label className="text-white" htmlFor="nama">
                      {reservationContent['label-whatsapp']}
                    </label>
                    <input
                      type="text"
                      name="nomor_whatsapp"
                      id="nomor_whatsapp"
                      placeholder={reservationContent['placeholder-whatsapp']}
                      className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg px-3 py-2 active:border-orange focus:border-orange outline-none focus:outline-orange "
                      value={nomorWhatsappReservasi}
                      onChange={(e) => setNoWhatsappReservasi(e.target.value)}
                      required
                    />
                  </div>
                </Fade>

                {/* Tanggal Reservasi */}
                <Fade delay={600} duration={1200}>
                  <div className="flex flex-col gap-2">
                    <label className="text-white" htmlFor="nama">
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
                            // const nextDay = addDays(date)
                            setSelectedDate(format(date, 'yyyy-MM-dd'))
                            getAllReservationsPositon(
                              format(date, 'yyyy-MM-dd'),
                            )
                            if (selectedReservationPlace != '') {
                              getTimeSetForTodayAgain(
                                selectedReservationPlace,
                                format(date, 'yyyy-MM-dd'),
                              )
                            }
                            getTimeSelected(format(date, 'yyyy-MM-dd'))
                          }}
                          // disabled={(date) => {
                          //   const today = startOfDay(new Date()) // Removes time from today
                          //   return dateClose.length !== 0
                          //     ? date > addDays(today, 14) ||
                          //         date < today ||
                          //         (date >= new Date(dateClose[0]?.start_date) &&
                          //           date <= new Date(dateClose[0]?.end_date))
                          //     : date > addDays(today, 14) || date < today
                          // }}
                          disabled={(date) => {
                            const today = startOfDay(new Date()) // Normalize today's date
                            const maxDate = addDays(today, 14) // Max selectable date
                            const minDate = subDays(today, 1) // Min selectable date

                            // Normalize the input date
                            const checkDate = startOfDay(date)

                            // Check if the date falls within any closed date range
                            const isInClosedRange = dateClose.some(
                              ({ start_date, end_date }) => {
                                const startDate = startOfDay(
                                  new Date(start_date),
                                )
                                const endDate = startOfDay(new Date(end_date))
                                return (
                                  checkDate >= startDate && checkDate <= endDate
                                ) // Ensure start_date is included
                              },
                            )

                            return (
                              checkDate > maxDate ||
                              checkDate < minDate ||
                              isInClosedRange
                            )
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </Fade>

                {/* Lantai Reservasi */}
                <Fade delay={7} duration={1300}>
                  <div className="flex flex-col gap-2">
                    <label className="text-white" htmlFor="nama">
                      {reservationContent['label-tempat-reservasi']}
                    </label>
                    <Select
                      value={selectedReservationPlace}
                      onValueChange={(value) => {
                        setSelectedReservationPlace(value)
                        getTimeSetForToday(value)
                      }}
                      required
                      className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg !px-3 !py-4"
                    >
                      <SelectTrigger className="py-5 px-3 text-base text-white">
                        <SelectValue
                          className="text-base text-white placeholder:text-white"
                          placeholder="Choose Space"
                        >
                          {selectedReservationPlace == ''
                            ? 'Choose Space'
                            : capitalizeAndFormat(
                                selectedReservationPlace || '',
                              )}
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

                                {regularSpaceData == null ||
                                premiumSpaceData == null ||
                                privateSpaceData == null ? (
                                  <></>
                                ) : (
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
                                        ).map((time, index) => (
                                          <span key={index}>
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

                <Fade delay={8} duration={1400}>
                  <div className="flex-relative w-full h-fit">
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '10px',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
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
                          <span className="material-symbols-outlined text-lg">
                            +
                          </span>
                        </button>
                        <button
                          className="border-none text-[#737373] bg-white p-3 text-lg cursor-pointer"
                          onClick={handleZoomOut}
                        >
                          <span className="material-symbols-outlined text-lg px-2">
                            -
                          </span>
                        </button>
                      </div>

                      <img
                        src={
                          selectedReservationPlace == 'regular-space'
                            ? '/first-floor.jpg'
                            : selectedReservationPlace == 'premium-space'
                            ? '/premium-space.PNG'
                            : '/private-space.PNG'
                        }
                        alt=""
                        style={{
                          width: '100%',
                          height: 'auto',
                          transform: `${
                            selectedReservationPlace == 'regular-space'
                              ? 'scale(1.4)'
                              : 'scale(1)'
                          } translate(${position.x}px, ${position.y}px)`,
                          cursor: 'move',
                        }}
                      />

                      <div className="">
                        {selectedReservationPlace == 'regular-space' &&
                          selectedDate != '' && (
                            <div className={`flex flex-col  mb-6   w-full`}>
                              <div
                                className={`flex flex-row justify-around w-full top-10 absolute z-50 gap-[${
                                  7 + scale * 10
                                }] `}
                                ref={imageRef}
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  transform: `translate(${position.x}px, ${position.y}px)`,
                                  cursor: 'move',
                                }}
                              >
                                {[1, 2, 3, 4, 5].map((number) => {
                                  return (
                                    <Drawer
                                      onClose={(e) => {
                                        setDrawerContent('default')
                                        handleCloseCatalogClick()
                                      }}
                                      key={number}
                                    >
                                      <DrawerTrigger asChild>
                                        <div
                                          key={number}
                                          className={`cursor-pointer md:w-28 md:h-28 w-8 h-8 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} text-white rounded-lg py-2 flex-col items-center justify-center flex`}
                                          onClick={() => {
                                            setPosisiReservasi(number)
                                            if (number <= 4) {
                                              setNamaPosisiReservasi(
                                                positions[6].name,
                                              )

                                              getPriceSetForToday(
                                                positions[6].name,
                                                selectedDate,
                                              )
                                              getPriceDataCustom(
                                                positions[6].name,
                                              )
                                            } else {
                                              setNamaPosisiReservasi(
                                                positions[0].name,
                                              )

                                              getPriceSetForToday(
                                                positions[0].name,
                                                selectedDate,
                                              )
                                              getPriceDataCustom(
                                                positions[0].name,
                                              )
                                            }

                                            fetchingAvailableReservation(
                                              selectedDate,
                                              number,
                                            )
                                          }}
                                          style={{
                                            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                          }}
                                        >
                                          <p className="opacity-100 text-xs py-2 text-white ">
                                            Reg
                                          </p>{' '}
                                        </div>
                                      </DrawerTrigger>
                                      <DrawerContent className="active:border-none border-none outline-none md:max-w-3xl md:mx-auto pb-5">
                                        <DrawerHeader className="text-left">
                                          <DrawerTitle>
                                            {number <= 4
                                              ? positions[6].name
                                              : positions[0].name}
                                          </DrawerTitle>
                                          <DrawerDescription>
                                            Can only accomodate{' '}
                                            {number <= 4
                                              ? positions[6].capacity
                                              : positions[0].capacity}{' '}
                                            person (position {number}).
                                          </DrawerDescription>
                                          <DrawerDescription className="flex flex-col gap-0 mt-0 pt-0">
                                            <span className="font-semibold">
                                              Price on:
                                            </span>
                                            {(() => {
                                              const facilityId = getFacilityId(
                                                number <= 4
                                                  ? positions[6].name
                                                  : positions[0].name,
                                              ) // Get the facility ID
                                              const priceData =
                                                facilityId === 'ps5-reguler'
                                                  ? ps5RegulerData.prices
                                                  : facilityId ===
                                                    'ikuzo-racing-simulator'
                                                  ? ikuzoRacingSimulatorData.prices
                                                  : facilityId === 'ps4-reguler'
                                                  ? ps4RegulerData.prices
                                                  : facilityId ===
                                                    'family-vip-room'
                                                  ? familyVIPRoomData.prices
                                                  : facilityId ===
                                                    'lovebirds-vip-room'
                                                  ? lovebirdsVIPRoomData.prices
                                                  : facilityId ===
                                                    'family-open-space'
                                                  ? familyOpenSpaceData.prices
                                                  : facilityId ===
                                                    'squad-open-space'
                                                  ? squadOpenSpaceData.prices
                                                  : []

                                              return priceData.length > 0
                                                ? priceData.map(
                                                    (price, index) => (
                                                      <span key={index}>
                                                        • {price.day} - IDR{' '}
                                                        {price.price}/hour
                                                      </span>
                                                    ),
                                                  )
                                                : null
                                            })()}
                                            {(() => {
                                              const facilityId = getFacilityId(
                                                number <= 4
                                                  ? positions[6].name
                                                  : positions[0].name,
                                              ) // Get the facility ID
                                              const priceDataCustom =
                                                facilityId === 'ps5-reguler'
                                                  ? ps5RegulerData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'ikuzo-racing-simulator'
                                                  ? ikuzoRacingSimulatorData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId === 'ps4-reguler'
                                                  ? ps4RegulerData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'family-vip-room'
                                                  ? familyVIPRoomData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'lovebirds-vip-room'
                                                  ? lovebirdsVIPRoomData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'family-open-space'
                                                  ? familyOpenSpaceData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'squad-open-space'
                                                  ? squadOpenSpaceData[
                                                      'custom-prices'
                                                    ]
                                                  : []

                                              return priceDataCustom.length > 0
                                                ? priceDataCustom.map(
                                                    (price, index) => (
                                                      <span key={index}>
                                                        • {price.keterangan},{' '}
                                                        {formatDateIndonesian(
                                                          price.date,
                                                        )}
                                                        - IDR {price.price}
                                                        /hour
                                                      </span>
                                                    ),
                                                  )
                                                : null
                                            })()}
                                          </DrawerDescription>
                                        </DrawerHeader>
                                        {drawerContent !== 'default' && (
                                          <>
                                            <input
                                              value={filterKeyword}
                                              onChange={(e) => {
                                                handleInputFilterCatalogChange(
                                                  e,
                                                )
                                                setFilterKeyword(e.target.value)
                                              }}
                                              required
                                              placeholder={'Search game'}
                                              className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 mx-5 !py-2 "
                                            />
                                            {(catalogs.length != 0 ||
                                              filteredCatalogs.length != 0) && (
                                              <span className="text-gray-400 text-sm mx-5 flex mt-2">
                                                <MdOutlineUpdate className="text-lg" />
                                                Last updated at{' '}
                                                {formatTimestampIndonesian(
                                                  latestUpdatedAt,
                                                )}
                                              </span>
                                            )}
                                          </>
                                        )}

                                        {timeSet == null ? (
                                          <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                            <div className="flex flex-col gap-1 items-center justify-center">
                                              <Image
                                                src={'/error.png'}
                                                width={0}
                                                height={0}
                                                className="w-[150px]"
                                                alt={'No content available'}
                                              />
                                              <p className="text-base font-normal text-gray-400">
                                                Oopss!!! Sorry Ikuzo, this space
                                                is closed not operating today.
                                              </p>
                                            </div>
                                          </div>
                                        ) : drawerContent === 'default' ? (
                                          <div className="flex-relative w-full h-fit px-5">
                                            <div
                                              style={{
                                                backgroundColor: '#ffffff',
                                                borderRadius: '10px',
                                                position: 'relative',
                                                overflow: 'hidden',
                                              }}
                                            >
                                              <img
                                                src={`${
                                                  process.env
                                                    .NEXT_PUBLIC_IMAGE_URL
                                                }${
                                                  number <= 4
                                                    ? positions[6].pict
                                                    : positions[0].pict
                                                }`}
                                                useMap="#image-map"
                                                alt=""
                                                style={{
                                                  width: '100%',
                                                  height: 'auto',
                                                }}
                                              />
                                            </div>

                                            {reserves.length > 0 ? (
                                              <>
                                                <Fade className="">
                                                  <div className="flex gap-1 w-full my-2">
                                                    <div className="flex flex-col gap-2 w-full flex-1">
                                                      <label
                                                        htmlFor="nama"
                                                        className="text-sm"
                                                      >
                                                        Reserved Times
                                                      </label>
                                                      <div className="flex flex-row flex-wrap gap-1">
                                                        {reserves.length > 0
                                                          ? reserves.map(
                                                              (
                                                                reserve,
                                                                index,
                                                              ) => (
                                                                <div
                                                                  className={`text-xs px-2 py-1 border ${
                                                                    reserve.status_reserve ===
                                                                    'pending'
                                                                      ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                                      : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                                  } rounded-md w-fit`}
                                                                >
                                                                  {
                                                                    reserve.reserve_start_time
                                                                  }{' '}
                                                                  -{' '}
                                                                  {
                                                                    reserve.reserve_end_time
                                                                  }{' '}
                                                                  WIB
                                                                </div>
                                                              ),
                                                            )
                                                          : null}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </Fade>
                                              </>
                                            ) : null}

                                            <Fade className="">
                                              <div className="flex gap-1 w-full mt-2 mb-3">
                                                <div className="flex flex-col gap-2 w-full flex-1">
                                                  <label
                                                    htmlFor="nama"
                                                    className="text-sm"
                                                  >
                                                    Start Time
                                                  </label>
                                                  <Select
                                                    value={startTimeReservasi}
                                                    onValueChange={(value) =>
                                                      setStartTimeReservasi(
                                                        value,
                                                      )
                                                    }
                                                    required
                                                    className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                                  >
                                                    <SelectTrigger className="py-5 px-3 text-sm">
                                                      <SelectValue
                                                        className="text-base"
                                                        placeholder="00.00"
                                                      />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectLabel className="text-sm">
                                                          Pilih Waktu Mulai
                                                        </SelectLabel>
                                                        {generatedTimes.map(
                                                          (time, index) => (
                                                            <SelectItem
                                                              key={index}
                                                              value={time}
                                                            >
                                                              {time}
                                                            </SelectItem>
                                                          ),
                                                        )}
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="flex flex-col gap-2 w-full flex-1">
                                                  <label
                                                    htmlFor="nama"
                                                    className="text-sm"
                                                  >
                                                    End Time
                                                  </label>
                                                  <Select
                                                    value={endTimeReservasi}
                                                    onValueChange={(value) =>
                                                      setEndTimeReservasi(value)
                                                    }
                                                    required
                                                    className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                                  >
                                                    <SelectTrigger className="py-5 px-3 text-sm">
                                                      <SelectValue
                                                        className="text-base"
                                                        placeholder="00.00"
                                                      />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectLabel className="text-sm">
                                                          Pilih Waktu Berakhir
                                                        </SelectLabel>
                                                        {startTimeReservasi !=
                                                          '' &&
                                                        timeArray.length !=
                                                          0 ? (
                                                          timeArray.map(
                                                            (time, index) => {
                                                              const isDisabled = disableTimes.includes(
                                                                time,
                                                              )

                                                              return (
                                                                <SelectItem
                                                                  key={index}
                                                                  value={time}
                                                                  className={
                                                                    'text-sm'
                                                                  }
                                                                  disabled={
                                                                    isDisabled
                                                                  }
                                                                >
                                                                  {time}
                                                                </SelectItem>
                                                              )
                                                            },
                                                          )
                                                        ) : (
                                                          <SelectItem
                                                            value={'00.00'}
                                                          >
                                                            <p className="text-gray-500">
                                                              Waktu yang kamu
                                                              pilih <br />
                                                              sudah terisi.
                                                              Silakan <br />
                                                              pilih waktu
                                                              bermain <br />
                                                              di jam yang lain
                                                            </p>
                                                          </SelectItem>
                                                        )}
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                            </Fade>
                                          </div>
                                        ) : catalogs.length > 0 ? (
                                          <div
                                            className={`grid ${
                                              filteredCatalogs.length == 0 &&
                                              filterKeyword != ''
                                                ? 'grid-cols-1'
                                                : 'grid-cols-3'
                                            } gap-4  ${
                                              catalogs.length > 9
                                                ? 'h-[350px]'
                                                : 'h-fit'
                                            } overflow-y-scroll py-4 px-7`}
                                          >
                                            {filteredCatalogs.length == 0 ? (
                                              filterKeyword == '' ? (
                                                catalogs.map(
                                                  (catalog, index) => (
                                                    <div
                                                      key={index}
                                                      className="flex flex-col gap-2 items-center justify-center"
                                                    >
                                                      <Image
                                                        alt={
                                                          catalog.catalog_img
                                                        }
                                                        width={0}
                                                        height={0}
                                                        className="rounded-lg w-full h-[110px] !md:[300px] object-cover"
                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${catalog.catalog_img}`}
                                                      />
                                                      <p className="text-gray-500 text-sm text-center leading-[100%]">
                                                        {catalog.catalog_txt.substring(
                                                          0,
                                                          10,
                                                        ) + '...'}
                                                      </p>
                                                    </div>
                                                  ),
                                                )
                                              ) : (
                                                <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                                  <div className="flex flex-col gap-1 items-center justify-center">
                                                    <Image
                                                      src={'/error.png'}
                                                      width={0}
                                                      height={0}
                                                      className="w-[150px]"
                                                      alt={
                                                        'No content available'
                                                      }
                                                    />
                                                    <p className="text-base font-normal text-gray-400">
                                                      There is no any contents
                                                      right now ikuzo!
                                                    </p>
                                                  </div>
                                                </div>
                                              )
                                            ) : (
                                              filteredCatalogs.map(
                                                (catalog, index) => (
                                                  <div
                                                    key={index}
                                                    className="flex flex-col gap-2 items-center justify-center"
                                                  >
                                                    <Image
                                                      alt={catalog.catalog_img}
                                                      width={0}
                                                      height={0}
                                                      className="rounded-lg w-full h-[110px] !md:[300px] object-cover"
                                                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${catalog.catalog_img}`}
                                                    />
                                                    <p className="text-gray-500 text-sm text-center leading-[100%]">
                                                      {catalog.catalog_txt.substring(
                                                        0,
                                                        10,
                                                      ) + '...'}
                                                    </p>
                                                  </div>
                                                ),
                                              )
                                            )}
                                          </div>
                                        ) : (
                                          <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                            <div className="flex flex-col gap-1 items-center justify-center">
                                              <Image
                                                src={'/error.png'}
                                                width={0}
                                                height={0}
                                                className="w-[150px]"
                                                alt={'No content available'}
                                              />
                                              <p className="text-base font-normal text-gray-400">
                                                There is no any contents right
                                                now ikuzo!
                                              </p>
                                            </div>
                                          </div>
                                        )}

                                        {drawerContent === 'default' ? (
                                          <div className="flex flex-col gap-2 px-5 mt-3">
                                            {timeSet != null ? (
                                              <DrawerClose asChild>
                                                <Button
                                                  variant="outline"
                                                  className={`bg-orange text-white border-orange py-5`}
                                                >
                                                  Continue
                                                </Button>
                                              </DrawerClose>
                                            ) : (
                                              <></>
                                            )}

                                            <Button
                                              variant="outline"
                                              className={`bg-transparent text-orange border-orange py-5`}
                                              onClick={(e) =>
                                                handleCatalogClick(number)
                                              }
                                            >
                                              <IoMdBook className="text-lg mr-2" />{' '}
                                              Lihat Catalog Game
                                            </Button>
                                          </div>
                                        ) : (
                                          <Button
                                            variant="outline"
                                            className={`bg-transparent text-orange border-orange py-5 mx-5 mt-`}
                                            onClick={handleCloseCatalogClick}
                                          >
                                            <IoMdClose className="text-lg mr-2" />{' '}
                                            Close Catalog
                                          </Button>
                                        )}
                                      </DrawerContent>
                                    </Drawer>
                                  )
                                })}
                              </div>

                              <div
                                className={`flex flex-row justify-around md:w-64 w-24 bottom-10 absolute z-50 left-7 gap-[${
                                  9 + scale * 10
                                }]  md:left-20 md:gap-[${10 + scale * 10}]`}
                                ref={imageRef}
                                style={{
                                  height: 'auto',
                                  transform: `translate(${position.x}px, ${position.y}px)`,
                                  cursor: 'move',
                                }}
                              >
                                {[6, 7].map((number) => {
                                  return (
                                    <Drawer
                                      onClose={(e) => {
                                        setDrawerContent('default')
                                        handleCloseCatalogClick()
                                      }}
                                      key={number}
                                    >
                                      <DrawerTrigger asChild>
                                        <div
                                          key={number}
                                          className={`cursor-pointer md:w-28 md:h-28 w-8 h-8 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} rounded-lg py-2 ml-2 flex-col items-center justify-center flex`}
                                          onClick={() => {
                                            setPosisiReservasi(number)
                                            setNamaPosisiReservasi(
                                              positions[1].name,
                                            )

                                            fetchingAvailableReservation(
                                              selectedDate,
                                              number,
                                            )
                                            getPriceSetForToday(
                                              positions[1].name,
                                              selectedDate,
                                            )
                                            getPriceDataCustom(
                                              positions[1].name,
                                            )
                                          }}
                                          style={{
                                            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                          }}
                                        >
                                          <p className="opacity-100 py-2 text-xs  text-white">
                                            Sim
                                          </p>{' '}
                                        </div>
                                      </DrawerTrigger>
                                      <DrawerContent className="active:border-none border-none outline-none md:max-w-3xl md:mx-auto">
                                        <DrawerHeader className="text-left">
                                          <DrawerTitle>
                                            {positions[1].name}
                                          </DrawerTitle>
                                          <DrawerDescription>
                                            Can only accomodate{' '}
                                            {positions[1].capacity} person
                                            (position {number}).
                                          </DrawerDescription>
                                          <DrawerDescription className="flex flex-col gap-0 mt-0 pt-0">
                                            <span className="font-semibold">
                                              Price on:
                                            </span>
                                            {(() => {
                                              const facilityId = getFacilityId(
                                                positions[1].name,
                                              ) // Get the facility ID
                                              const priceData =
                                                facilityId === 'ps5-reguler'
                                                  ? ps5RegulerData.prices
                                                  : facilityId ===
                                                    'ikuzo-racing-simulator'
                                                  ? ikuzoRacingSimulatorData.prices
                                                  : facilityId === 'ps4-reguler'
                                                  ? ps4RegulerData.prices
                                                  : facilityId ===
                                                    'family-vip-room'
                                                  ? familyVIPRoomData.prices
                                                  : facilityId ===
                                                    'lovebirds-vip-room'
                                                  ? lovebirdsVIPRoomData.prices
                                                  : facilityId ===
                                                    'family-open-space'
                                                  ? familyOpenSpaceData.prices
                                                  : facilityId ===
                                                    'squad-open-space'
                                                  ? squadOpenSpaceData.prices
                                                  : []

                                              return priceData.length > 0
                                                ? priceData.map(
                                                    (price, index) => (
                                                      <span key={index}>
                                                        • {price.day} - IDR{' '}
                                                        {price.price}/hour
                                                      </span>
                                                    ),
                                                  )
                                                : null
                                            })()}
                                            {(() => {
                                              const facilityId = getFacilityId(
                                                positions[1].name,
                                              ) // Get the facility ID
                                              const priceDataCustom =
                                                facilityId === 'ps5-reguler'
                                                  ? ps5RegulerData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'ikuzo-racing-simulator'
                                                  ? ikuzoRacingSimulatorData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId === 'ps4-reguler'
                                                  ? ps4RegulerData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'family-vip-room'
                                                  ? familyVIPRoomData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'lovebirds-vip-room'
                                                  ? lovebirdsVIPRoomData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'family-open-space'
                                                  ? familyOpenSpaceData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'squad-open-space'
                                                  ? squadOpenSpaceData[
                                                      'custom-prices'
                                                    ]
                                                  : []

                                              return priceDataCustom.length > 0
                                                ? priceDataCustom.map(
                                                    (price, index) => (
                                                      <span key={index}>
                                                        • {price.keterangan},{' '}
                                                        {formatDateIndonesian(
                                                          price.date,
                                                        )}
                                                        - IDR {price.price}
                                                        /hour
                                                      </span>
                                                    ),
                                                  )
                                                : null
                                            })()}
                                          </DrawerDescription>
                                        </DrawerHeader>
                                        {drawerContent !== 'default' && (
                                          <>
                                            <input
                                              value={filterKeyword}
                                              onChange={(e) => {
                                                handleInputFilterCatalogChange(
                                                  e,
                                                )
                                                setFilterKeyword(e.target.value)
                                              }}
                                              required
                                              placeholder={'Search game'}
                                              className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 mx-5 !py-2 "
                                            />
                                            {(catalogs.length != 0 ||
                                              filteredCatalogs.length != 0) && (
                                              <span className="text-gray-400 text-sm mx-5 flex mt-2">
                                                <MdOutlineUpdate className="text-lg" />
                                                Last updated at{' '}
                                                {formatTimestampIndonesian(
                                                  latestUpdatedAt,
                                                )}
                                              </span>
                                            )}
                                          </>
                                        )}
                                        {timeSet == null ? (
                                          <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                            <div className="flex flex-col gap-1 items-center justify-center">
                                              <Image
                                                src={'/error.png'}
                                                width={0}
                                                height={0}
                                                className="w-[150px]"
                                                alt={'No content available'}
                                              />
                                              <p className="text-base font-normal text-gray-400">
                                                Oopss!!! Sorry Ikuzo, this space
                                                is closed not operating today.
                                              </p>
                                            </div>
                                          </div>
                                        ) : drawerContent === 'default' ? (
                                          <div className="flex-relative w-full h-fit px-5">
                                            <div
                                              style={{
                                                backgroundColor: '#ffffff',
                                                borderRadius: '10px',
                                                position: 'relative',
                                                overflow: 'hidden',
                                              }}
                                            >
                                              <img
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${positions[1].pict}`}
                                                useMap="#image-map"
                                                alt=""
                                                style={{
                                                  width: '100%',
                                                  height: 'auto',
                                                }}
                                              />
                                            </div>
                                            {reserves.length > 0 ? (
                                              <>
                                                <Fade>
                                                  <div className="flex gap-1 w-full my-2">
                                                    <div className="flex flex-col gap-2 w-full flex-1">
                                                      <label
                                                        htmlFor="nama"
                                                        className="text-sm"
                                                      >
                                                        Reserved Times
                                                      </label>
                                                      <div className="flex flex-row flex-wrap gap-1">
                                                        {reserves.length > 0
                                                          ? reserves.map(
                                                              (
                                                                reserve,
                                                                index,
                                                              ) => (
                                                                <div
                                                                  className={`text-xs px-2 py-1 border ${
                                                                    reserve.status_reserve ===
                                                                    'pending'
                                                                      ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                                      : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                                  } rounded-md w-fit`}
                                                                >
                                                                  {
                                                                    reserve.reserve_start_time
                                                                  }{' '}
                                                                  -{' '}
                                                                  {
                                                                    reserve.reserve_end_time
                                                                  }{' '}
                                                                  WIB
                                                                </div>
                                                              ),
                                                            )
                                                          : null}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </Fade>
                                              </>
                                            ) : null}

                                            <Fade>
                                              <div className="flex gap-1 w-full mt-2 mb-3">
                                                <div className="flex flex-col gap-2 w-full flex-1">
                                                  <label
                                                    htmlFor="nama"
                                                    className="text-sm"
                                                  >
                                                    Start Time
                                                  </label>
                                                  <Select
                                                    value={startTimeReservasi}
                                                    onValueChange={(value) =>
                                                      setStartTimeReservasi(
                                                        value,
                                                      )
                                                    }
                                                    required
                                                    className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                                  >
                                                    <SelectTrigger className="py-5 px-3 text-sm">
                                                      <SelectValue
                                                        className="text-base"
                                                        placeholder="00.00"
                                                      />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectLabel className="text-sm">
                                                          Pilih Waktu Mulai
                                                        </SelectLabel>
                                                        {generatedTimes.map(
                                                          (time, index) => (
                                                            <SelectItem
                                                              key={index}
                                                              value={time}
                                                            >
                                                              {time}
                                                            </SelectItem>
                                                          ),
                                                        )}
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="flex flex-col gap-2 w-full flex-1">
                                                  <label
                                                    htmlFor="nama"
                                                    className="text-sm"
                                                  >
                                                    End Time
                                                  </label>
                                                  <Select
                                                    value={endTimeReservasi}
                                                    onValueChange={(value) =>
                                                      setEndTimeReservasi(value)
                                                    }
                                                    required
                                                    className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                                  >
                                                    <SelectTrigger className="py-5 px-3 text-sm">
                                                      <SelectValue
                                                        className="text-base"
                                                        placeholder="00.00"
                                                      />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectLabel className="text-sm">
                                                          Pilih Waktu Berakhir
                                                        </SelectLabel>
                                                        {startTimeReservasi !=
                                                          '' &&
                                                        timeArray.length !=
                                                          0 ? (
                                                          timeArray.map(
                                                            (time, index) => {
                                                              const isDisabled = disableTimes.includes(
                                                                time,
                                                              )

                                                              return (
                                                                <SelectItem
                                                                  key={index}
                                                                  value={time}
                                                                  className={
                                                                    'text-sm'
                                                                  }
                                                                  disabled={
                                                                    isDisabled
                                                                  }
                                                                >
                                                                  {time}
                                                                </SelectItem>
                                                              )
                                                            },
                                                          )
                                                        ) : (
                                                          <SelectItem
                                                            value={'00.00'}
                                                          >
                                                            <p className="text-gray-500">
                                                              Waktu yang kamu
                                                              pilih <br />
                                                              sudah terisi.
                                                              Silakan <br />
                                                              pilih waktu
                                                              bermain <br />
                                                              di jam yang lain
                                                            </p>
                                                          </SelectItem>
                                                        )}
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                            </Fade>
                                          </div>
                                        ) : catalogs.length > 0 ? (
                                          <div
                                            className={`grid ${
                                              filteredCatalogs.length == 0 &&
                                              filterKeyword != ''
                                                ? 'grid-cols-1'
                                                : 'grid-cols-3'
                                            } gap-4  ${
                                              catalogs.length > 9
                                                ? 'h-[350px]'
                                                : 'h-fit'
                                            } overflow-y-scroll py-4 px-7`}
                                          >
                                            {filteredCatalogs.length == 0 ? (
                                              filterKeyword == '' ? (
                                                catalogs.map(
                                                  (catalog, index) => (
                                                    <div
                                                      key={index}
                                                      className="flex flex-col gap-2 items-center justify-center"
                                                    >
                                                      <Image
                                                        alt={
                                                          catalog.catalog_img
                                                        }
                                                        width={0}
                                                        height={0}
                                                        className="rounded-lg w-full h-[110px] !md:[300px] object-cover"
                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${catalog.catalog_img}`}
                                                      />
                                                      <p className="text-gray-500 text-sm text-center leading-[100%]">
                                                        {catalog.catalog_txt.substring(
                                                          0,
                                                          10,
                                                        ) + '...'}
                                                      </p>
                                                    </div>
                                                  ),
                                                )
                                              ) : (
                                                <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                                  <div className="flex flex-col gap-1 items-center justify-center">
                                                    <Image
                                                      src={'/error.png'}
                                                      width={0}
                                                      height={0}
                                                      className="w-[150px]"
                                                      alt={
                                                        'No content available'
                                                      }
                                                    />
                                                    <p className="text-base font-normal text-gray-400">
                                                      There is no any contents
                                                      right now ikuzo!
                                                    </p>
                                                  </div>
                                                </div>
                                              )
                                            ) : (
                                              filteredCatalogs.map(
                                                (catalog, index) => (
                                                  <div
                                                    key={index}
                                                    className="flex flex-col gap-2 items-center justify-center"
                                                  >
                                                    <Image
                                                      alt={catalog.catalog_img}
                                                      width={0}
                                                      height={0}
                                                      className="rounded-lg w-full h-[110px] !md:[300px] object-cover"
                                                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${catalog.catalog_img}`}
                                                    />
                                                    <p className="text-gray-500 text-sm text-center leading-[100%]">
                                                      {catalog.catalog_txt.substring(
                                                        0,
                                                        10,
                                                      ) + '...'}
                                                    </p>
                                                  </div>
                                                ),
                                              )
                                            )}
                                          </div>
                                        ) : (
                                          <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                            <div className="flex flex-col gap-1 items-center justify-center">
                                              <Image
                                                src={'/error.png'}
                                                width={0}
                                                height={0}
                                                className="w-[150px]"
                                                alt={'No content available'}
                                              />
                                              <p className="text-base font-normal text-gray-400">
                                                There is no any contents right
                                                now ikuzo!
                                              </p>
                                            </div>
                                          </div>
                                        )}

                                        {drawerContent === 'default' ? (
                                          <div className="flex flex-col gap-2 px-5 mt-2">
                                            {timeSet == null ? (
                                              <></>
                                            ) : (
                                              <DrawerClose asChild>
                                                <Button
                                                  variant="outline"
                                                  className={`bg-orange text-white border-orange py-5`}
                                                >
                                                  Continue
                                                </Button>
                                              </DrawerClose>
                                            )}

                                            <Button
                                              variant="outline"
                                              className={`bg-transparent text-orange border-orange py-5`}
                                              onClick={(e) =>
                                                handleCatalogClick(number)
                                              }
                                            >
                                              <IoMdBook className="text-lg mr-2" />{' '}
                                              Lihat Catalog Game
                                            </Button>
                                          </div>
                                        ) : (
                                          <Button
                                            variant="outline"
                                            className={`bg-transparent text-orange border-orange py-5 mx-5`}
                                            onClick={handleCloseCatalogClick}
                                          >
                                            <IoMdClose className="text-lg mr-2" />{' '}
                                            Close Catalog
                                          </Button>
                                        )}
                                      </DrawerContent>
                                    </Drawer>
                                  )
                                })}
                              </div>

                              <div
                                className={`flex flex-row justify-around w-fit bottom-10 absolute z-50 left-40 -ml-2 gap-${
                                  8 + scale * 10
                                } bottom-10  md:left-[53.5%] ml-2 `}
                                ref={imageRef}
                                style={{
                                  height: 'auto',
                                  transform: `translate(${position.x}px, ${position.y}px)`,
                                  cursor: 'move',
                                }}
                              >
                                {[8].map((number) => {
                                  return (
                                    <Drawer
                                      onClose={(e) => {
                                        setDrawerContent('default')
                                        handleCloseCatalogClick()
                                      }}
                                      key={number}
                                    >
                                      <DrawerTrigger asChild>
                                        <div
                                          key={number}
                                          className={`cursor-pointer md:w-28 md:h-28 w-9  h-8 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} rounded-lg flex-col items-center justify-center flex`}
                                          onClick={() => {
                                            setPosisiReservasi(number)
                                            setNamaPosisiReservasi(
                                              positions[0].name,
                                            )

                                            getPriceSetForToday(
                                              positions[0].name,
                                              selectedDate,
                                            )
                                            fetchingAvailableReservation(
                                              selectedDate,
                                              number,
                                            )
                                            getPriceDataCustom(
                                              positions[0].name,
                                            )
                                          }}
                                          style={{
                                            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                          }}
                                        >
                                          <p className="opacity-100 text-xs py-2 text-white ">
                                            Reg
                                          </p>{' '}
                                        </div>
                                      </DrawerTrigger>
                                      <DrawerContent className="active:border-none border-none outline-none md:max-w-3xl md:mx-auto">
                                        <DrawerHeader className="text-left">
                                          <DrawerTitle>
                                            {positions[0].name}
                                          </DrawerTitle>
                                          <DrawerDescription>
                                            Can only accomodate{' '}
                                            {positions[0].capacity} person
                                            (position {number}).
                                          </DrawerDescription>
                                          <DrawerDescription className="flex flex-col gap-0 mt-0 pt-0">
                                            <span className="font-semibold">
                                              Price on:
                                            </span>
                                            {(() => {
                                              const facilityId = getFacilityId(
                                                positions[0].name,
                                              ) // Get the facility ID
                                              const priceData =
                                                facilityId === 'ps5-reguler'
                                                  ? ps5RegulerData.prices
                                                  : facilityId ===
                                                    'ikuzo-racing-simulator'
                                                  ? ikuzoRacingSimulatorData.prices
                                                  : facilityId === 'ps4-reguler'
                                                  ? ps4RegulerData.prices
                                                  : facilityId ===
                                                    'family-vip-room'
                                                  ? familyVIPRoomData.prices
                                                  : facilityId ===
                                                    'lovebirds-vip-room'
                                                  ? lovebirdsVIPRoomData.prices
                                                  : facilityId ===
                                                    'family-open-space'
                                                  ? familyOpenSpaceData.prices
                                                  : facilityId ===
                                                    'squad-open-space'
                                                  ? squadOpenSpaceData.prices
                                                  : []

                                              return priceData.length > 0
                                                ? priceData.map(
                                                    (price, index) => (
                                                      <span key={index}>
                                                        • {price.day} - IDR{' '}
                                                        {price.price}/hour
                                                      </span>
                                                    ),
                                                  )
                                                : null
                                            })()}
                                            {(() => {
                                              const facilityId = getFacilityId(
                                                positions[0].name,
                                              ) // Get the facility ID
                                              const priceDataCustom =
                                                facilityId === 'ps5-reguler'
                                                  ? ps5RegulerData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'ikuzo-racing-simulator'
                                                  ? ikuzoRacingSimulatorData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId === 'ps4-reguler'
                                                  ? ps4RegulerData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'family-vip-room'
                                                  ? familyVIPRoomData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'lovebirds-vip-room'
                                                  ? lovebirdsVIPRoomData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'family-open-space'
                                                  ? familyOpenSpaceData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'squad-open-space'
                                                  ? squadOpenSpaceData[
                                                      'custom-prices'
                                                    ]
                                                  : []

                                              return priceDataCustom.length > 0
                                                ? priceDataCustom.map(
                                                    (price, index) => (
                                                      <span key={index}>
                                                        • {price.keterangan},{' '}
                                                        {formatDateIndonesian(
                                                          price.date,
                                                        )}
                                                        - IDR {price.price}
                                                        /hour
                                                      </span>
                                                    ),
                                                  )
                                                : null
                                            })()}
                                          </DrawerDescription>
                                        </DrawerHeader>
                                        {drawerContent !== 'default' && (
                                          <>
                                            <input
                                              value={filterKeyword}
                                              onChange={(e) => {
                                                handleInputFilterCatalogChange(
                                                  e,
                                                )
                                                setFilterKeyword(e.target.value)
                                              }}
                                              required
                                              placeholder={'Search game'}
                                              className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 mx-5 !py-2 "
                                            />
                                            {(catalogs.length != 0 ||
                                              filteredCatalogs.length != 0) && (
                                              <span className="text-gray-400 text-sm mx-5 flex mt-2">
                                                <MdOutlineUpdate className="text-lg" />
                                                Last updated at{' '}
                                                {formatTimestampIndonesian(
                                                  latestUpdatedAt,
                                                )}
                                              </span>
                                            )}
                                          </>
                                        )}
                                        {timeSet == null ? (
                                          <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                            <div className="flex flex-col gap-1 items-center justify-center">
                                              <Image
                                                src={'/error.png'}
                                                width={0}
                                                height={0}
                                                className="w-[150px]"
                                                alt={'No content available'}
                                              />
                                              <p className="text-base font-normal text-gray-400">
                                                Oopss!!! Sorry Ikuzo, this space
                                                is closed not operating today.
                                              </p>
                                            </div>
                                          </div>
                                        ) : drawerContent === 'default' ? (
                                          <div className="flex-relative w-full h-fit px-5">
                                            <div
                                              style={{
                                                backgroundColor: '#ffffff',
                                                borderRadius: '10px',
                                                position: 'relative',
                                                overflow: 'hidden',
                                              }}
                                            >
                                              <img
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${positions[0].pict}`}
                                                useMap="#image-map"
                                                alt=""
                                                style={{
                                                  width: '100%',
                                                  height: 'auto',
                                                }}
                                              />
                                            </div>
                                            {reserves.length > 0 ? (
                                              <>
                                                <Fade>
                                                  <div className="flex gap-1 w-full my-2">
                                                    <div className="flex flex-col gap-2 w-full flex-1">
                                                      <label
                                                        htmlFor="nama"
                                                        className="text-sm"
                                                      >
                                                        Reserved Times
                                                      </label>
                                                      <div className="flex flex-row flex-wrap gap-1">
                                                        {reserves.length > 0
                                                          ? reserves.map(
                                                              (
                                                                reserve,
                                                                index,
                                                              ) => (
                                                                <div
                                                                  className={`text-xs px-2 py-1 border ${
                                                                    reserve.status_reserve ===
                                                                    'pending'
                                                                      ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                                      : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                                  } rounded-md w-fit`}
                                                                >
                                                                  {
                                                                    reserve.reserve_start_time
                                                                  }{' '}
                                                                  -{' '}
                                                                  {
                                                                    reserve.reserve_end_time
                                                                  }{' '}
                                                                  WIB
                                                                </div>
                                                              ),
                                                            )
                                                          : null}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </Fade>
                                              </>
                                            ) : null}

                                            <Fade>
                                              <div className="flex gap-1 w-full mt-2 mb-3">
                                                <div className="flex flex-col gap-2 w-full flex-1">
                                                  <label
                                                    htmlFor="nama"
                                                    className="text-sm"
                                                  >
                                                    Start Time
                                                  </label>
                                                  <Select
                                                    value={startTimeReservasi}
                                                    onValueChange={(value) =>
                                                      setStartTimeReservasi(
                                                        value,
                                                      )
                                                    }
                                                    required
                                                    className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                                  >
                                                    <SelectTrigger className="py-5 px-3 text-sm">
                                                      <SelectValue
                                                        className="text-base"
                                                        placeholder="00.00"
                                                      />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectLabel className="text-sm">
                                                          Pilih Waktu Mulai
                                                        </SelectLabel>
                                                        {generatedTimes.map(
                                                          (time, index) => (
                                                            <SelectItem
                                                              key={index}
                                                              value={time}
                                                            >
                                                              {time}
                                                            </SelectItem>
                                                          ),
                                                        )}
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="flex flex-col gap-2 w-full flex-1">
                                                  <label
                                                    htmlFor="nama"
                                                    className="text-sm"
                                                  >
                                                    End Time
                                                  </label>
                                                  <Select
                                                    value={endTimeReservasi}
                                                    onValueChange={(value) =>
                                                      setEndTimeReservasi(value)
                                                    }
                                                    required
                                                    className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                                  >
                                                    <SelectTrigger className="py-5 px-3 text-sm">
                                                      <SelectValue
                                                        className="text-base"
                                                        placeholder="00.00"
                                                      />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectLabel className="text-sm">
                                                          Pilih Waktu Berakhir
                                                        </SelectLabel>
                                                        {startTimeReservasi !=
                                                          '' &&
                                                        timeArray.length !=
                                                          0 ? (
                                                          timeArray.map(
                                                            (time, index) => {
                                                              const isDisabled = disableTimes.includes(
                                                                time,
                                                              )

                                                              return (
                                                                <SelectItem
                                                                  key={index}
                                                                  value={time}
                                                                  className={
                                                                    'text-sm'
                                                                  }
                                                                  disabled={
                                                                    isDisabled
                                                                  }
                                                                >
                                                                  {time}
                                                                </SelectItem>
                                                              )
                                                            },
                                                          )
                                                        ) : (
                                                          <SelectItem
                                                            value={'00.00'}
                                                          >
                                                            <p className="text-gray-500">
                                                              Waktu yang kamu
                                                              pilih <br />
                                                              sudah terisi.
                                                              Silakan <br />
                                                              pilih waktu
                                                              bermain <br />
                                                              di jam yang lain
                                                            </p>
                                                          </SelectItem>
                                                        )}
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                            </Fade>
                                          </div>
                                        ) : catalogs.length > 0 ? (
                                          <div
                                            className={`grid ${
                                              filteredCatalogs.length == 0 &&
                                              filterKeyword != ''
                                                ? 'grid-cols-1'
                                                : 'grid-cols-3'
                                            } gap-4  ${
                                              catalogs.length > 9
                                                ? 'h-[350px]'
                                                : 'h-fit'
                                            } overflow-y-scroll py-4 px-7`}
                                          >
                                            {filteredCatalogs.length == 0 ? (
                                              filterKeyword == '' ? (
                                                catalogs.map(
                                                  (catalog, index) => (
                                                    <div
                                                      key={index}
                                                      className="flex flex-col gap-2 items-center justify-center"
                                                    >
                                                      <Image
                                                        alt={
                                                          catalog.catalog_img
                                                        }
                                                        width={0}
                                                        height={0}
                                                        className="rounded-lg w-full h-[110px] !md:[300px] object-cover"
                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${catalog.catalog_img}`}
                                                      />
                                                      <p className="text-gray-500 text-sm text-center leading-[100%]">
                                                        {catalog.catalog_txt.substring(
                                                          0,
                                                          10,
                                                        ) + '...'}
                                                      </p>
                                                    </div>
                                                  ),
                                                )
                                              ) : (
                                                <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                                  <div className="flex flex-col gap-1 items-center justify-center">
                                                    <Image
                                                      src={'/error.png'}
                                                      width={0}
                                                      height={0}
                                                      className="w-[150px]"
                                                      alt={
                                                        'No content available'
                                                      }
                                                    />
                                                    <p className="text-base font-normal text-gray-400">
                                                      There is no any contents
                                                      right now ikuzo!
                                                    </p>
                                                  </div>
                                                </div>
                                              )
                                            ) : (
                                              filteredCatalogs.map(
                                                (catalog, index) => (
                                                  <div
                                                    key={index}
                                                    className="flex flex-col gap-2 items-center justify-center"
                                                  >
                                                    <Image
                                                      alt={catalog.catalog_img}
                                                      width={0}
                                                      height={0}
                                                      className="rounded-lg w-full h-[110px] !md:[300px] object-cover"
                                                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${catalog.catalog_img}`}
                                                    />
                                                    <p className="text-gray-500 text-sm text-center leading-[100%]">
                                                      {catalog.catalog_txt.substring(
                                                        0,
                                                        10,
                                                      ) + '...'}
                                                    </p>
                                                  </div>
                                                ),
                                              )
                                            )}
                                          </div>
                                        ) : (
                                          <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                            <div className="flex flex-col gap-1 items-center justify-center">
                                              <Image
                                                src={'/error.png'}
                                                width={0}
                                                height={0}
                                                className="w-[150px]"
                                                alt={'No content available'}
                                              />
                                              <p className="text-base font-normal text-gray-400">
                                                There is no any contents right
                                                now ikuzo!
                                              </p>
                                            </div>
                                          </div>
                                        )}

                                        {drawerContent === 'default' ? (
                                          <div className="flex flex-col gap-2 px-5 mt-2">
                                            {timeSet == null ? (
                                              <></>
                                            ) : (
                                              <DrawerClose asChild>
                                                <Button
                                                  variant="outline"
                                                  className={`bg-orange text-white border-orange py-5`}
                                                >
                                                  Continue
                                                </Button>
                                              </DrawerClose>
                                            )}
                                            <Button
                                              variant="outline"
                                              className={`bg-transparent text-orange border-orange py-5`}
                                              onClick={(e) =>
                                                handleCatalogClick(number)
                                              }
                                            >
                                              <IoMdBook className="text-lg mr-2" />{' '}
                                              Lihat Catalog Game
                                            </Button>
                                          </div>
                                        ) : (
                                          <Button
                                            variant="outline"
                                            className={`bg-transparent text-orange border-orange py-5 mx-5`}
                                            onClick={handleCloseCatalogClick}
                                          >
                                            <IoMdClose className="text-lg mr-2" />{' '}
                                            Close Catalog
                                          </Button>
                                        )}
                                      </DrawerContent>
                                    </Drawer>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                        {/* {selectedReservationPlace == 'second-floor' &&
                      selectedDate != '' && (
                        <div className="flex flex-col mb-6">
                          <div
                            className={`flex flex-row w-auto top-16 absolute left-[36%] md:top-48  z-50 gap-[${
                              5 + scale * 10
                            }]`}
                            ref={imageRef}
                            style={{
                              height: 'auto',
                              transform: `translate(${position.x}px, ${position.y}px)`,
                              cursor: 'move',
                            }}
                          >
                            {[9].map((number) => {
                              return (
                                <Drawer key={number}>
                                  <DrawerTrigger asChild>
                                    <div
                                      key={number}
                                      className={`cursor-pointer md:w-28 md:h-28 w-8 h-8 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} rounded-lg py-2 flex-col items-center justify-center flex`}
                                      onClick={() => {
                                        setPosisiReservasi(number)
                                        setNamaPosisiReservasi(
                                          positions[4].name,
                                        )
                                        setPricePerReserve(positions[4].price)
                                        fetchingAvailableReservation(
                                          selectedDate,
                                          number,
                                        )
                                      }}
                                      style={{
                                        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                      }}
                                    >
                                      <p className="opacity-100 text-xs py-2 text-white ">
                                        {number == '9'
                                          ? 'VIP'
                                          : number == 12
                                          ? 'PS 2'
                                          : 'Reg+'}
                                      </p>{' '}
                                    </div>
                                  </DrawerTrigger>
                                  <DrawerContent className="active:border-none border-none outline-none md:max-w-3xl md:mx-auto">
                                    <DrawerHeader className="text-left">
                                      <DrawerTitle>
                                        {positions[4].name}
                                      </DrawerTitle>
                                      <DrawerDescription>
                                        IDR {positions[4].price}/hour and can
                                        only accomodate{' '}
                                        {positions[4].capacity} person
                                        (position {number}).
                                      </DrawerDescription>
                                    </DrawerHeader>
                                    {drawerContent === 'default' ? (
                                      <div className="flex-relative w-full h-fit px-5">
                                        <div
                                          style={{
                                            backgroundColor: '#ffffff',
                                            borderRadius: '10px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                          }}
                                        >
                                          <img
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${positions[4].pict}`}
                                            useMap="#image-map"
                                            alt=""
                                            style={{
                                              width: '100%',
                                              height: 'auto',
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ) : catalogs.length > 0 ? (
                                      <div
                                        className={`grid ${
                                          filteredCatalogs.length == 0 &&
                                          filterKeyword != ''
                                            ? 'grid-cols-1'
                                            : 'grid-cols-3'
                                        } gap-4  ${
                                          catalogs.length > 9
                                            ? 'h-[350px]'
                                            : 'h-fit'
                                        } overflow-y-scroll py-4 px-7`}
                                      >
                                        {catalogs.map((catalog, index) => (
                                          <div
                                            key={index}
                                            className="flex flex-col gap-2 items-center justify-center"
                                          >
                                            <Image
                                              alt={catalog.catalog_img}
                                              width={0}
                                              height={0}
                                              className="rounded-lg w-full h-[110px] !md:[300px] object-cover"
                                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${catalog.catalog_img}`}
                                            />
                                            <p className="text-gray-500 text-sm text-center leading-[100%]">
                                              {catalog.catalog_txt.substring(
                                                0,
                                                10,
                                              ) + '...'}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                        <div className="flex flex-col gap-1 items-center justify-center">
                                          <Image
                                            src={'/error.png'}
                                            width={0}
                                            height={0}
                                            className="w-[150px]"
                                            alt={'No content available'}
                                          />
                                          <p className="text-base font-normal text-gray-400">
                                            There is no any contents right now
                                            ikuzo!
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    {reserves.length > 0 ? (
                                      <>
                                        <Fade className="px-5 ">
                                          <div className="flex gap-1 w-full my-2">
                                            <div className="flex flex-col gap-2 w-full flex-1">
                                              <label
                                                htmlFor="nama"
                                                className="text-sm"
                                              >
                                                Reserved Times
                                              </label>
                                              <div className="flex flex-row flex-wrap gap-1">
                                                {reserves.length > 0
                                                  ? reserves.map(
                                                      (reserve, index) => (
                                                        <div
                                                          className={`text-xs px-2 py-1 border ${
                                                            reserve.status_reserve ===
                                                            'pending'
                                                              ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                              : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                          } rounded-md w-fit`}
                                                        >
                                                          {
                                                            reserve.reserve_start_time
                                                          }{' '}
                                                          -{' '}
                                                          {
                                                            reserve.reserve_end_time
                                                          }{' '}
                                                          WIB
                                                        </div>
                                                      ),
                                                    )
                                                  : null}
                                              </div>
                                            </div>
                                          </div>
                                        </Fade>
                                      </>
                                    ) : null}

                                    <Fade className="px-5 ">
                                      <div className="flex gap-1 w-full mt-2 mb-3">
                                        <div className="flex flex-col gap-2 w-full flex-1">
                                          <label
                                            htmlFor="nama"
                                            className="text-sm"
                                          >
                                            Start Time
                                          </label>
                                          <Select
                                            value={startTimeReservasi}
                                            onValueChange={(value) =>
                                              setStartTimeReservasi(value)
                                            }
                                            required
                                            className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                          >
                                            <SelectTrigger className="py-5 px-3 text-sm">
                                              <SelectValue
                                                className="text-base"
                                                placeholder="00.00"
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                <SelectLabel className="text-sm">
                                                  Pilih Waktu Mulai
                                                </SelectLabel>
                                                {generateTimeArray(
                                                  customTimeSelected,
                                                  selectedDate,
                                                  bookedSlots,
                                                ).map((time, index) => (
                                                  <SelectItem
                                                    key={index}
                                                    value={time}
                                                  >
                                                    {time}
                                                  </SelectItem>
                                                ))}
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="flex flex-col gap-2 w-full flex-1">
                                          <label
                                            htmlFor="nama"
                                            className="text-sm"
                                          >
                                            End Time
                                          </label>
                                          <Select
                                            value={endTimeReservasi}
                                            onValueChange={(value) =>
                                              setEndTimeReservasi(value)
                                            }
                                            required
                                            className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                          >
                                            <SelectTrigger className="py-5 px-3 text-sm">
                                              <SelectValue
                                                className="text-base"
                                                placeholder="00.00"
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                <SelectLabel className="text-sm">
                                                  Pilih Waktu Berakhir
                                                </SelectLabel>
                                                {startTimeReservasi != '' &&
                                                timeArray.length != 0 ? (
                                                  generateTimeArrayWithStepUser(
                                                    startTimeReservasi,
                                                    bookedSlots,
                                                  ).map((time, index) => {
                                                    const isDisabled = disableTimes.includes(
                                                      time,
                                                    )

                                                    return (
                                                      <SelectItem
                                                        key={index}
                                                        value={time}
                                                        className={'text-sm'}
                                                        disabled={isDisabled}
                                                      >
                                                        {time}
                                                      </SelectItem>
                                                    )
                                                  })
                                                ) : (
                                                  <SelectItem value={'00.00'}>
                                                    <p className="text-gray-500">
                                                      Waktu yang kamu pilih{' '}
                                                      <br />
                                                      sudah terisi. Silakan{' '}
                                                      <br />
                                                      pilih waktu bermain{' '}
                                                      <br />
                                                      di jam yang lain
                                                    </p>
                                                  </SelectItem>
                                                )}
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    </Fade>

                                    {drawerContent === 'default' ? (
                                      <div className="flex flex-col gap-2 px-5 my-2">
                                        <DrawerClose asChild>
                                          <Button
                                            variant="outline"
                                            className={`bg-orange text-white border-orange py-5`}
                                          >
                                            Continue
                                          </Button>
                                        </DrawerClose>
                                        <Button
                                          variant="outline"
                                          className={`bg-transparent text-orange border-orange py-5`}
                                          onClick={(e) =>
                                            handleCatalogClick(number)
                                          }
                                        >
                                          <IoMdBook className="text-lg mr-2" />{' '}
                                          Lihat Catalog Game
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        className={`bg-transparent text-orange border-orange py-5 mx-5 mt-2`}
                                        onClick={handleCloseCatalogClick}
                                      >
                                        <IoMdClose className="text-lg mr-2" />{' '}
                                        Close Catalog
                                      </Button>
                                    )}
                                  </DrawerContent>
                                </Drawer>
                              )
                            })}
                          </div>

                          <div
                            className={`flex flex-row w-full justify-end top-24 absolute right-5 md:top-64  md:right-36 z-50 gap-[${
                              5 + scale * 10
                            }]`}
                            ref={imageRef}
                            style={{
                              height: 'auto',
                              transform: `translate(${position.x}px, ${position.y}px)`,
                              cursor: 'move',
                            }}
                          >
                            {[10, 11].map((number) => {
                              return (
                                <Drawer
                                  onClose={(e) => setDrawerContent('default')}
                                  key={number}
                                >
                                  <DrawerTrigger asChild>
                                    <div
                                      key={number}
                                      className={`cursor-pointer md:w-28 md:h-28 w-8 h-8 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} rounded-lg py-2 flex-col items-center justify-center flex ${
                                        number == 10 && 'mr-16'
                                      }`}
                                      onClick={() => {
                                        setPosisiReservasi(number)
                                        setNamaPosisiReservasi(
                                          positions[2].name,
                                        )
                                        setPricePerReserve(positions[2].price)
                                        fetchingAvailableReservation(
                                          selectedDate,
                                          number,
                                        )
                                      }}
                                      style={{
                                        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                      }}
                                    >
                                      <p className="opacity-100 text-xs py-2 text-white">
                                        {number == '9'
                                          ? 'VIP'
                                          : number == 12
                                          ? 'PS 2'
                                          : 'Reg+'}
                                      </p>
                                    </div>
                                  </DrawerTrigger>
                                  <DrawerContent className="active:border-none border-none outline-none md:max-w-3xl md:mx-auto">
                                    <DrawerHeader className="text-left">
                                      <DrawerTitle>
                                        {positions[2].name}
                                      </DrawerTitle>
                                      <DrawerDescription>
                                        IDR {positions[2].price}/hour and can
                                        only accommodate{' '}
                                        {positions[2].capacity} person
                                        (position {number}).
                                      </DrawerDescription>
                                    </DrawerHeader>

                                    {drawerContent === 'default' ? (
                                      <div className="flex-relative w-full h-fit px-5">
                                        <div
                                          style={{
                                            backgroundColor: '#ffffff',
                                            borderRadius: '10px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                          }}
                                        >
                                          <img
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${positions[2].pict}`}
                                            useMap="#image-map"
                                            alt=""
                                            style={{
                                              width: '100%',
                                              height: 'auto',
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ) : catalogs.length > 0 ? (
                                      <div
                                        className={`grid ${
                                          filteredCatalogs.length == 0 &&
                                          filterKeyword != ''
                                            ? 'grid-cols-1'
                                            : 'grid-cols-3'
                                        } gap-4  ${
                                          catalogs.length > 9
                                            ? 'h-[350px]'
                                            : 'h-fit'
                                        } overflow-y-scroll py-4 px-7`}
                                      >
                                        {catalogs.map((catalog, index) => (
                                          <div
                                            key={index}
                                            className="flex flex-col gap-2 items-center justify-center"
                                          >
                                            <Image
                                              alt={catalog.catalog_img}
                                              width={0}
                                              height={0}
                                              className="rounded-lg w-full h-[110px] !md:[300px] object-cover"
                                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${catalog.catalog_img}`}
                                            />
                                            <p className="text-gray-500 text-sm text-center leading-[100%]">
                                              {catalog.catalog_txt.substring(
                                                0,
                                                10,
                                              ) + '...'}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                        <div className="flex flex-col gap-1 items-center justify-center">
                                          <Image
                                            src={'/error.png'}
                                            width={0}
                                            height={0}
                                            className="w-[150px]"
                                            alt={'No content available'}
                                          />
                                          <p className="text-base font-normal text-gray-400">
                                            There is no any contents right now
                                            ikuzo!
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    {reserves.length > 0 ? (
                                      <>
                                        <Fade className="px-5 ">
                                          <div className="flex gap-1 w-full my-2">
                                            <div className="flex flex-col gap-2 w-full flex-1">
                                              <label
                                                htmlFor="nama"
                                                className="text-sm"
                                              >
                                                Reserved Times
                                              </label>
                                              <div className="flex flex-row flex-wrap gap-1">
                                                {reserves.length > 0
                                                  ? reserves.map(
                                                      (reserve, index) => (
                                                        <div
                                                          className={`text-xs px-2 py-1 border ${
                                                            reserve.status_reserve ===
                                                            'pending'
                                                              ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                              : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                          } rounded-md w-fit`}
                                                        >
                                                          {
                                                            reserve.reserve_start_time
                                                          }{' '}
                                                          -{' '}
                                                          {
                                                            reserve.reserve_end_time
                                                          }{' '}
                                                          WIB
                                                        </div>
                                                      ),
                                                    )
                                                  : null}
                                              </div>
                                            </div>
                                          </div>
                                        </Fade>
                                      </>
                                    ) : null}

                                    <Fade className="px-5 ">
                                      <div className="flex gap-1 w-full mt-2 mb-3">
                                        <div className="flex flex-col gap-2 w-full flex-1">
                                          <label
                                            htmlFor="nama"
                                            className="text-sm"
                                          >
                                            Start Time
                                          </label>
                                          <Select
                                            value={startTimeReservasi}
                                            onValueChange={(value) =>
                                              setStartTimeReservasi(value)
                                            }
                                            required
                                            className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                          >
                                            <SelectTrigger className="py-5 px-3 text-sm">
                                              <SelectValue
                                                className="text-base"
                                                placeholder="00.00"
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                <SelectLabel className="text-sm">
                                                  Pilih Waktu Mulai
                                                </SelectLabel>
                                                {generateTimeArray(
                                                  customTimeSelected,
                                                  selectedDate,
                                                  bookedSlots,
                                                ).map((time, index) => (
                                                  <SelectItem
                                                    key={index}
                                                    value={time}
                                                  >
                                                    {time}
                                                  </SelectItem>
                                                ))}
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="flex flex-col gap-2 w-full flex-1">
                                          <label
                                            htmlFor="nama"
                                            className="text-sm"
                                          >
                                            End Time
                                          </label>
                                          <Select
                                            value={endTimeReservasi}
                                            onValueChange={(value) =>
                                              setEndTimeReservasi(value)
                                            }
                                            required
                                            className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                          >
                                            <SelectTrigger className="py-5 px-3 text-sm">
                                              <SelectValue
                                                className="text-base"
                                                placeholder="00.00"
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                <SelectLabel className="text-sm">
                                                  Pilih Waktu Berakhir
                                                </SelectLabel>
                                                {startTimeReservasi != '' &&
                                                timeArray.length != 0 ? (
                                                  generateTimeArrayWithStepUser(
                                                    startTimeReservasi,
                                                    bookedSlots,
                                                  ).map((time, index) => {
                                                    const isDisabled = disableTimes.includes(
                                                      time,
                                                    )

                                                    return (
                                                      <SelectItem
                                                        key={index}
                                                        value={time}
                                                        className={'text-sm'}
                                                        disabled={isDisabled}
                                                      >
                                                        {time}
                                                      </SelectItem>
                                                    )
                                                  })
                                                ) : (
                                                  <SelectItem value={'00.00'}>
                                                    <p className="text-gray-500">
                                                      Waktu yang kamu pilih{' '}
                                                      <br />
                                                      sudah terisi. Silakan{' '}
                                                      <br />
                                                      pilih waktu bermain{' '}
                                                      <br />
                                                      di jam yang lain
                                                    </p>
                                                  </SelectItem>
                                                )}
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    </Fade>

                                    <DrawerFooter className="pt-2">
                                      {drawerContent === 'default' ? (
                                        <div className="flex flex-col gap-2 px-2 mt-2">
                                          <DrawerClose asChild>
                                            <Button
                                              variant="outline"
                                              className={`bg-orange text-white border-orange py-5`}
                                            >
                                              Continue
                                            </Button>
                                          </DrawerClose>
                                          <Button
                                            variant="outline"
                                            className={`bg-transparent text-orange border-orange py-5`}
                                            onClick={(e) =>
                                              handleCatalogClick(number)
                                            }
                                          >
                                            <IoMdBook className="text-lg mr-2" />{' '}
                                            Lihat Catalog Game
                                          </Button>
                                        </div>
                                      ) : (
                                        <Button
                                          variant="outline"
                                          className={`bg-transparent text-orange border-orange py-5 mt-2`}
                                          onClick={handleCloseCatalogClick}
                                        >
                                          <IoMdClose className="text-lg mr-2" />{' '}
                                          Close Catalog
                                        </Button>
                                      )}
                                    </DrawerFooter>
                                  </DrawerContent>
                                </Drawer>
                              )
                            })}
                          </div>

                          <div
                            className={`flex flex-row justify-around bottom-14 absolute left-5 md:bottom-28  md:left-16 z-50 gap-${
                              5 + scale * 10
                            }`}
                            ref={imageRef}
                            style={{
                              height: 'auto',
                              transform: `translate(${position.x}px, ${position.y}px)`,
                              cursor: 'move',
                            }}
                          >
                            {[12].map((number) => {
                              return (
                                <Drawer key={number}>
                                  <DrawerTrigger asChild>
                                    <div
                                      key={number}
                                      className={`cursor-pointer md:w-28 md:h-28 w-8 h-8 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} rounded-lg py-2 flex-col items-center justify-center flex`}
                                      onClick={() => {
                                        setPosisiReservasi(number)
                                        setNamaPosisiReservasi(
                                          positions[3].name,
                                        )
                                        setPricePerReserve(positions[3].price)
                                        fetchingAvailableReservation(
                                          selectedDate,
                                          number,
                                        )
                                      }}
                                      style={{
                                        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                      }}
                                    >
                                      <p className="opacity-100 text-xs py-2 text-white ">
                                        {number == '9'
                                          ? 'VIP'
                                          : number == 12
                                          ? 'PS 2'
                                          : 'Reg+'}
                                      </p>{' '}
                                    </div>
                                  </DrawerTrigger>
                                  <DrawerContent className="active:border-none border-none outline-none md:max-w-3xl md:mx-auto">
                                    <DrawerHeader className="text-left">
                                      <DrawerTitle>
                                        {positions[3].name}
                                      </DrawerTitle>
                                      <DrawerDescription>
                                        IDR {positions[3].price}/hour and can
                                        only accomodate{' '}
                                        {positions[3].capacity} person
                                        (position {number}).
                                      </DrawerDescription>
                                    </DrawerHeader>
                                    {drawerContent === 'default' ? (
                                      <div className="flex-relative w-full h-fit px-5">
                                        <div
                                          style={{
                                            backgroundColor: '#ffffff',
                                            borderRadius: '10px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                          }}
                                        >
                                          <img
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${positions[3].pict}`}
                                            useMap="#image-map"
                                            alt=""
                                            style={{
                                              width: '100%',
                                              height: 'auto',
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ) : catalogs.length > 0 ? (
                                      <div
                                        className={`grid ${
                                          filteredCatalogs.length == 0 &&
                                          filterKeyword != ''
                                            ? 'grid-cols-1'
                                            : 'grid-cols-3'
                                        } gap-4  ${
                                          catalogs.length > 9
                                            ? 'h-[350px]'
                                            : 'h-fit'
                                        } overflow-y-scroll py-4 px-7`}
                                      >
                                        {catalogs.map((catalog, index) => (
                                          <div
                                            key={index}
                                            className="flex flex-col gap-2 items-center justify-center"
                                          >
                                            <Image
                                              alt={catalog.catalog_img}
                                              width={0}
                                              height={0}
                                              className="rounded-lg w-full h-[110px] !md:[300px] object-cover"
                                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${catalog.catalog_img}`}
                                            />
                                            <p className="text-gray-500 text-sm text-center leading-[100%]">
                                              {catalog.catalog_txt.substring(
                                                0,
                                                10,
                                              ) + '...'}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                        <div className="flex flex-col gap-1 items-center justify-center">
                                          <Image
                                            src={'/error.png'}
                                            width={0}
                                            height={0}
                                            className="w-[150px]"
                                            alt={'No content available'}
                                          />
                                          <p className="text-base font-normal text-gray-400">
                                            There is no any contents right now
                                            ikuzo!
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    {reserves.length > 0 ? (
                                      <Fade className="px-5 ">
                                        <div className="flex gap-1 w-full my-2">
                                          <div className="flex flex-col gap-2 w-full flex-1">
                                            <label
                                              htmlFor="nama"
                                              className="text-sm"
                                            >
                                              Reserved Times
                                            </label>
                                            <div className="flex flex-row flex-wrap gap-1">
                                              {reserves.length > 0
                                                ? reserves.map(
                                                    (reserve, index) => (
                                                      <div
                                                        className={`text-xs px-2 py-1 border ${
                                                          reserve.status_reserve ===
                                                          'pending'
                                                            ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                            : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                        } rounded-md w-fit`}
                                                      >
                                                        {
                                                          reserve.reserve_start_time
                                                        }{' '}
                                                        -{' '}
                                                        {
                                                          reserve.reserve_end_time
                                                        }{' '}
                                                        WIB
                                                      </div>
                                                    ),
                                                  )
                                                : null}
                                            </div>
                                          </div>
                                        </div>
                                      </Fade>
                                    ) : null}

                                    <Fade className="px-5 ">
                                      <div className="flex gap-1 w-full mt-2 mb-3">
                                        <div className="flex flex-col gap-2 w-full flex-1">
                                          <label
                                            htmlFor="nama"
                                            className="text-sm"
                                          >
                                            Start Time
                                          </label>
                                          <Select
                                            value={startTimeReservasi}
                                            onValueChange={(value) =>
                                              setStartTimeReservasi(value)
                                            }
                                            required
                                            className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                          >
                                            <SelectTrigger className="py-5 px-3 text-sm">
                                              <SelectValue
                                                className="text-base"
                                                placeholder="00.00"
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                <SelectLabel className="text-sm">
                                                  Pilih Waktu Mulai
                                                </SelectLabel>
                                                {generateTimeArray(
                                                  customTimeSelected,
                                                  selectedDate,
                                                  bookedSlots,
                                                ).map((time, index) => (
                                                  <SelectItem
                                                    key={index}
                                                    value={time}
                                                  >
                                                    {time}
                                                  </SelectItem>
                                                ))}
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="flex flex-col gap-2 w-full flex-1">
                                          <label
                                            htmlFor="nama"
                                            className="text-sm"
                                          >
                                            End Time
                                          </label>
                                          <Select
                                            value={endTimeReservasi}
                                            onValueChange={(value) =>
                                              setEndTimeReservasi(value)
                                            }
                                            required
                                            className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                          >
                                            <SelectTrigger className="py-5 px-3 text-sm">
                                              <SelectValue
                                                className="text-base"
                                                placeholder="00.00"
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                <SelectLabel className="text-sm">
                                                  Pilih Waktu Berakhir
                                                </SelectLabel>
                                                {startTimeReservasi != '' &&
                                                timeArray.length != 0 ? (
                                                  generateTimeArrayWithStepUser(
                                                    startTimeReservasi,
                                                    bookedSlots,
                                                  ).map((time, index) => {
                                                    const isDisabled = disableTimes.includes(
                                                      time,
                                                    )

                                                    return (
                                                      <SelectItem
                                                        key={index}
                                                        value={time}
                                                        className={'text-sm'}
                                                        disabled={isDisabled}
                                                      >
                                                        {time}
                                                      </SelectItem>
                                                    )
                                                  })
                                                ) : (
                                                  <SelectItem value={'00.00'}>
                                                    <p className="text-gray-500">
                                                      Waktu yang kamu pilih{' '}
                                                      <br />
                                                      sudah terisi. Silakan{' '}
                                                      <br />
                                                      pilih waktu bermain{' '}
                                                      <br />
                                                      di jam yang lain
                                                    </p>
                                                  </SelectItem>
                                                )}
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    </Fade>

                                    {drawerContent === 'default' ? (
                                      <div className="flex flex-col gap-2 px-5 my-2">
                                        <DrawerClose asChild>
                                          <Button
                                            variant="outline"
                                            className={`bg-orange text-white border-orange py-5`}
                                          >
                                            Continue
                                          </Button>
                                        </DrawerClose>
                                        <Button
                                          variant="outline"
                                          className={`bg-transparent text-orange border-orange py-5`}
                                          onClick={(e) =>
                                            handleCatalogClick(number)
                                          }
                                        >
                                          <IoMdBook className="text-lg mr-2" />{' '}
                                          Lihat Catalog Game
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        className={`bg-transparent text-orange border-orange py-5 mx-5 mt-2`}
                                        onClick={handleCloseCatalogClick}
                                      >
                                        <IoMdClose className="text-lg mr-2" />{' '}
                                        Close Catalog
                                      </Button>
                                    )}
                                  </DrawerContent>
                                </Drawer>
                              )
                            })}
                          </div>
                        </div>
                      )} */}

                        {selectedReservationPlace == 'premium-space' &&
                          selectedDate != '' && (
                            <div className="flex flex-col mb-6">
                              <div
                                className={`flex flex-row w-full top-5 gap-8 md:gap-16 absolute left-7 md:top-10  md:left-20 z-50 gap-[${
                                  8 + scale * 10
                                }]`}
                                ref={imageRef}
                                style={{
                                  height: 'auto',
                                  transform: `translate(${position.x}px, ${position.y}px)`,
                                  cursor: 'move',
                                }}
                              >
                                {[13, 14, 15, 16].map((number) => {
                                  return (
                                    <Drawer
                                      onClose={(e) => {
                                        setDrawerContent('default')
                                        handleCloseCatalogClick()
                                      }}
                                      key={number}
                                    >
                                      <DrawerTrigger asChild>
                                        <div
                                          key={number}
                                          className={`cursor-pointer md:w-28 md:h-28 w-10 h-10 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} rounded-lg py-2 flex-col items-center justify-center flex ${
                                            number == 10 && 'mr-16'
                                          }`}
                                          onClick={() => {
                                            setPosisiReservasi(number)
                                            setNamaPosisiReservasi(
                                              positions[3].name,
                                            )

                                            getPriceSetForToday(
                                              positions[3].name,
                                              selectedDate,
                                            )
                                            fetchingAvailableReservation(
                                              selectedDate,
                                              number,
                                            )
                                            getPriceDataCustom(
                                              positions[3].name,
                                            )
                                          }}
                                          style={{
                                            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                          }}
                                        >
                                          <p className="opacity-100 text-[0.65rem] py-2  text-white leading-none text-center">
                                            Squad Open Space
                                          </p>
                                        </div>
                                      </DrawerTrigger>
                                      <DrawerContent className="active:border-none border-none outline-none md:max-w-3xl md:mx-auto">
                                        <DrawerHeader className="text-left">
                                          <DrawerTitle>
                                            {positions[3].name}
                                          </DrawerTitle>
                                          <DrawerDescription>
                                            Can only accommodate{' '}
                                            {positions[3].capacity} person
                                            (position {number}).
                                          </DrawerDescription>
                                          <DrawerDescription className="flex flex-col gap-0 mt-0 pt-0">
                                            <span className="font-semibold">
                                              Price on:
                                            </span>
                                            {(() => {
                                              const facilityId = getFacilityId(
                                                positions[3].name,
                                              ) // Get the facility ID
                                              const priceData =
                                                facilityId === 'ps5-reguler'
                                                  ? ps5RegulerData.prices
                                                  : facilityId ===
                                                    'ikuzo-racing-simulator'
                                                  ? ikuzoRacingSimulatorData.prices
                                                  : facilityId === 'ps4-reguler'
                                                  ? ps4RegulerData.prices
                                                  : facilityId ===
                                                    'family-vip-room'
                                                  ? familyVIPRoomData.prices
                                                  : facilityId ===
                                                    'lovebirds-vip-room'
                                                  ? lovebirdsVIPRoomData.prices
                                                  : facilityId ===
                                                    'family-open-space'
                                                  ? familyOpenSpaceData.prices
                                                  : facilityId ===
                                                    'squad-open-space'
                                                  ? squadOpenSpaceData.prices
                                                  : []

                                              return priceData.length > 0
                                                ? priceData.map(
                                                    (price, index) => (
                                                      <span key={index}>
                                                        • {price.day} - IDR{' '}
                                                        {price.price}/hour
                                                      </span>
                                                    ),
                                                  )
                                                : null
                                            })()}
                                            {(() => {
                                              const facilityId = getFacilityId(
                                                positions[3].name,
                                              ) // Get the facility ID
                                              const priceDataCustom =
                                                facilityId === 'ps5-reguler'
                                                  ? ps5RegulerData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'ikuzo-racing-simulator'
                                                  ? ikuzoRacingSimulatorData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId === 'ps4-reguler'
                                                  ? ps4RegulerData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'family-vip-room'
                                                  ? familyVIPRoomData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'lovebirds-vip-room'
                                                  ? lovebirdsVIPRoomData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'family-open-space'
                                                  ? familyOpenSpaceData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'squad-open-space'
                                                  ? squadOpenSpaceData[
                                                      'custom-prices'
                                                    ]
                                                  : []

                                              return priceDataCustom.length > 0
                                                ? priceDataCustom.map(
                                                    (price, index) => (
                                                      <span key={index}>
                                                        • {price.keterangan},{' '}
                                                        {formatDateIndonesian(
                                                          price.date,
                                                        )}
                                                        - IDR {price.price}
                                                        /hour
                                                      </span>
                                                    ),
                                                  )
                                                : null
                                            })()}
                                          </DrawerDescription>
                                        </DrawerHeader>
                                        {drawerContent !== 'default' && (
                                          <>
                                            <input
                                              value={filterKeyword}
                                              onChange={(e) => {
                                                handleInputFilterCatalogChange(
                                                  e,
                                                )
                                                setFilterKeyword(e.target.value)
                                              }}
                                              required
                                              placeholder={'Search game'}
                                              className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 mx-5 !py-2 "
                                            />
                                            {(catalogs.length != 0 ||
                                              filteredCatalogs.length != 0) && (
                                              <span className="text-gray-400 text-sm mx-5 flex mt-2">
                                                <MdOutlineUpdate className="text-lg" />
                                                Last updated at{' '}
                                                {formatTimestampIndonesian(
                                                  latestUpdatedAt,
                                                )}
                                              </span>
                                            )}
                                          </>
                                        )}

                                        {timeSet == null ? (
                                          <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                            <div className="flex flex-col gap-1 items-center justify-center">
                                              <Image
                                                src={'/error.png'}
                                                width={0}
                                                height={0}
                                                className="w-[150px]"
                                                alt={'No content available'}
                                              />
                                              <p className="text-base font-normal text-gray-400">
                                                Oopss!!! Sorry Ikuzo, this space
                                                is closed not operating today.
                                              </p>
                                            </div>
                                          </div>
                                        ) : drawerContent === 'default' ? (
                                          <div className="flex-relative w-full h-fit px-5">
                                            <div
                                              style={{
                                                backgroundColor: '#ffffff',
                                                borderRadius: '10px',
                                                position: 'relative',
                                                overflow: 'hidden',
                                              }}
                                            >
                                              <img
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${positions[3].pict}`}
                                                useMap="#image-map"
                                                alt=""
                                                style={{
                                                  width: '100%',
                                                  height: 'auto',
                                                }}
                                              />
                                            </div>
                                            {reserves.length > 0 ? (
                                              <>
                                                <Fade>
                                                  <div className="flex gap-1 w-full my-2">
                                                    <div className="flex flex-col gap-2 w-full flex-1">
                                                      <label
                                                        htmlFor="nama"
                                                        className="text-sm"
                                                      >
                                                        Reserved Times
                                                      </label>
                                                      <div className="flex flex-row flex-wrap gap-1">
                                                        {reserves.length > 0
                                                          ? reserves.map(
                                                              (
                                                                reserve,
                                                                index,
                                                              ) => (
                                                                <div
                                                                  className={`text-xs px-2 py-1 border ${
                                                                    reserve.status_reserve ===
                                                                    'pending'
                                                                      ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                                      : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                                  } rounded-md w-fit`}
                                                                >
                                                                  {
                                                                    reserve.reserve_start_time
                                                                  }{' '}
                                                                  -{' '}
                                                                  {
                                                                    reserve.reserve_end_time
                                                                  }{' '}
                                                                  WIB
                                                                </div>
                                                              ),
                                                            )
                                                          : null}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </Fade>
                                              </>
                                            ) : null}

                                            <Fade>
                                              <div className="flex gap-1 w-full mt-2 mb-3">
                                                <div className="flex flex-col gap-2 w-full flex-1">
                                                  <label
                                                    htmlFor="nama"
                                                    className="text-sm"
                                                  >
                                                    Start Time
                                                  </label>
                                                  <Select
                                                    value={startTimeReservasi}
                                                    onValueChange={(value) =>
                                                      setStartTimeReservasi(
                                                        value,
                                                      )
                                                    }
                                                    required
                                                    className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                                  >
                                                    <SelectTrigger className="py-5 px-3 text-sm">
                                                      <SelectValue
                                                        className="text-base"
                                                        placeholder="00.00"
                                                      />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectLabel className="text-sm">
                                                          Pilih Waktu Mulai
                                                        </SelectLabel>
                                                        {generatedTimes.map(
                                                          (time, index) => (
                                                            <SelectItem
                                                              key={index}
                                                              value={time}
                                                            >
                                                              {time}
                                                            </SelectItem>
                                                          ),
                                                        )}
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="flex flex-col gap-2 w-full flex-1">
                                                  <label
                                                    htmlFor="nama"
                                                    className="text-sm"
                                                  >
                                                    End Time
                                                  </label>
                                                  <Select
                                                    value={endTimeReservasi}
                                                    onValueChange={(value) =>
                                                      setEndTimeReservasi(value)
                                                    }
                                                    required
                                                    className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                                  >
                                                    <SelectTrigger className="py-5 px-3 text-sm">
                                                      <SelectValue
                                                        className="text-base"
                                                        placeholder="00.00"
                                                      />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectLabel className="text-sm">
                                                          Pilih Waktu Berakhir
                                                        </SelectLabel>
                                                        {startTimeReservasi !=
                                                          '' &&
                                                        timeArray.length !=
                                                          0 ? (
                                                          timeArray.map(
                                                            (time, index) => {
                                                              const isDisabled = disableTimes.includes(
                                                                time,
                                                              )

                                                              return (
                                                                <SelectItem
                                                                  key={index}
                                                                  value={time}
                                                                  className={
                                                                    'text-sm'
                                                                  }
                                                                  disabled={
                                                                    isDisabled
                                                                  }
                                                                >
                                                                  {time}
                                                                </SelectItem>
                                                              )
                                                            },
                                                          )
                                                        ) : (
                                                          <SelectItem
                                                            value={'00.00'}
                                                          >
                                                            <p className="text-gray-500">
                                                              Waktu yang kamu
                                                              pilih <br />
                                                              sudah terisi.
                                                              Silakan <br />
                                                              pilih waktu
                                                              bermain <br />
                                                              di jam yang lain
                                                            </p>
                                                          </SelectItem>
                                                        )}
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                            </Fade>
                                          </div>
                                        ) : catalogs.length > 0 ? (
                                          <div
                                            className={`grid ${
                                              filteredCatalogs.length == 0 &&
                                              filterKeyword != ''
                                                ? 'grid-cols-1'
                                                : 'grid-cols-3'
                                            } gap-4  ${
                                              catalogs.length > 9
                                                ? 'h-[350px]'
                                                : 'h-fit'
                                            } overflow-y-scroll py-4 px-7`}
                                          >
                                            {filteredCatalogs.length == 0 ? (
                                              filterKeyword == '' ? (
                                                catalogs.map(
                                                  (catalog, index) => (
                                                    <div
                                                      key={index}
                                                      className="flex flex-col gap-2 items-center justify-center"
                                                    >
                                                      <Image
                                                        alt={
                                                          catalog.catalog_img
                                                        }
                                                        width={0}
                                                        height={0}
                                                        className="rounded-lg w-full h-[110px] !md:[300px] object-cover"
                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${catalog.catalog_img}`}
                                                      />
                                                      <p className="text-gray-500 text-sm text-center leading-[100%]">
                                                        {catalog.catalog_txt.substring(
                                                          0,
                                                          10,
                                                        ) + '...'}
                                                      </p>
                                                    </div>
                                                  ),
                                                )
                                              ) : (
                                                <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                                  <div className="flex flex-col gap-1 items-center justify-center">
                                                    <Image
                                                      src={'/error.png'}
                                                      width={0}
                                                      height={0}
                                                      className="w-[150px]"
                                                      alt={
                                                        'No content available'
                                                      }
                                                    />
                                                    <p className="text-base font-normal text-gray-400">
                                                      There is no any contents
                                                      right now ikuzo!
                                                    </p>
                                                  </div>
                                                </div>
                                              )
                                            ) : (
                                              filteredCatalogs.map(
                                                (catalog, index) => (
                                                  <div
                                                    key={index}
                                                    className="flex flex-col gap-2 items-center justify-center"
                                                  >
                                                    <Image
                                                      alt={catalog.catalog_img}
                                                      width={0}
                                                      height={0}
                                                      className="rounded-lg w-full h-[110px] !md:[300px] object-cover"
                                                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${catalog.catalog_img}`}
                                                    />
                                                    <p className="text-gray-500 text-sm text-center leading-[100%]">
                                                      {catalog.catalog_txt.substring(
                                                        0,
                                                        10,
                                                      ) + '...'}
                                                    </p>
                                                  </div>
                                                ),
                                              )
                                            )}
                                          </div>
                                        ) : (
                                          <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                            <div className="flex flex-col gap-1 items-center justify-center">
                                              <Image
                                                src={'/error.png'}
                                                width={0}
                                                height={0}
                                                className="w-[150px]"
                                                alt={'No content available'}
                                              />
                                              <p className="text-base font-normal text-gray-400">
                                                There is no any contents right
                                                now ikuzo!
                                              </p>
                                            </div>
                                          </div>
                                        )}

                                        <DrawerFooter className="pt-2">
                                          {drawerContent === 'default' ? (
                                            <div className="flex flex-col gap-2 px-2 mt-2">
                                              {timeSet == null ? (
                                                <></>
                                              ) : (
                                                <DrawerClose asChild>
                                                  <Button
                                                    variant="outline"
                                                    className={`bg-orange text-white border-orange py-5`}
                                                  >
                                                    Continue
                                                  </Button>
                                                </DrawerClose>
                                              )}
                                              <Button
                                                variant="outline"
                                                className={`bg-transparent text-orange border-orange py-5`}
                                                onClick={(e) =>
                                                  handleCatalogClick(number)
                                                }
                                              >
                                                <IoMdBook className="text-lg mr-2" />{' '}
                                                Lihat Catalog Game
                                              </Button>
                                            </div>
                                          ) : (
                                            <Button
                                              variant="outline"
                                              className={`bg-transparent text-orange border-orange py-5 mt-2`}
                                              onClick={handleCloseCatalogClick}
                                            >
                                              <IoMdClose className="text-lg mr-2" />{' '}
                                              Close Catalog
                                            </Button>
                                          )}
                                        </DrawerFooter>
                                      </DrawerContent>
                                    </Drawer>
                                  )
                                })}
                              </div>
                              <div
                                className={`flex flex-row w-auto bottom-12 gap-16 absolute left-[46%] md:bottom-20  z-50 gap-[${
                                  8 + scale * 10
                                }]`}
                                ref={imageRef}
                                style={{
                                  height: 'auto',
                                  transform: `translate(${position.x}px, ${position.y}px)`,
                                  cursor: 'move',
                                }}
                              >
                                {[17].map((number) => {
                                  return (
                                    <Drawer
                                      key={number}
                                      onClose={(e) => {
                                        setDrawerContent('default')
                                        handleCloseCatalogClick()
                                      }}
                                    >
                                      <DrawerTrigger asChild>
                                        <div
                                          key={number}
                                          className={`cursor-pointer md:w-28 md:h-28 w-16 h-10 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} rounded-lg py-2 flex-col items-center justify-center flex`}
                                          onClick={() => {
                                            setPosisiReservasi(number)
                                            setNamaPosisiReservasi(
                                              positions[2].name,
                                            )

                                            getPriceSetForToday(
                                              positions[2].name,
                                              selectedDate,
                                            )
                                            fetchingAvailableReservation(
                                              selectedDate,
                                              number,
                                            )
                                            getPriceDataCustom(
                                              positions[2].name,
                                            )
                                          }}
                                          style={{
                                            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                          }}
                                        >
                                          <p className="opacity-100 text-[0.6rem] leading-none py-2 text-white text-center">
                                            Family Open Space
                                          </p>{' '}
                                        </div>
                                      </DrawerTrigger>
                                      <DrawerContent className="active:border-none border-none outline-none md:max-w-3xl md:mx-auto">
                                        <DrawerHeader className="text-left">
                                          <DrawerTitle>
                                            {positions[2].name}
                                          </DrawerTitle>
                                          <DrawerDescription>
                                            Can only accomodate{' '}
                                            {positions[2].capacity} person
                                            (position {number}).
                                          </DrawerDescription>
                                          <DrawerDescription className="flex flex-col gap-0 mt-0 pt-0">
                                            <span className="font-semibold">
                                              Price on:
                                            </span>
                                            {(() => {
                                              const facilityId = getFacilityId(
                                                positions[2].name,
                                              ) // Get the facility ID
                                              const priceData =
                                                facilityId === 'ps5-reguler'
                                                  ? ps5RegulerData.prices
                                                  : facilityId ===
                                                    'ikuzo-racing-simulator'
                                                  ? ikuzoRacingSimulatorData.prices
                                                  : facilityId === 'ps4-reguler'
                                                  ? ps4RegulerData.prices
                                                  : facilityId ===
                                                    'family-vip-room'
                                                  ? familyVIPRoomData.prices
                                                  : facilityId ===
                                                    'lovebirds-vip-room'
                                                  ? lovebirdsVIPRoomData.prices
                                                  : facilityId ===
                                                    'family-open-space'
                                                  ? familyOpenSpaceData.prices
                                                  : facilityId ===
                                                    'squad-open-space'
                                                  ? squadOpenSpaceData.prices
                                                  : []

                                              return priceData.length > 0
                                                ? priceData.map(
                                                    (price, index) => (
                                                      <span key={index}>
                                                        • {price.day} - IDR{' '}
                                                        {price.price}/hour
                                                      </span>
                                                    ),
                                                  )
                                                : null
                                            })()}
                                            {(() => {
                                              const facilityId = getFacilityId(
                                                positions[2].name,
                                              ) // Get the facility ID
                                              const priceDataCustom =
                                                facilityId === 'ps5-reguler'
                                                  ? ps5RegulerData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'ikuzo-racing-simulator'
                                                  ? ikuzoRacingSimulatorData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId === 'ps4-reguler'
                                                  ? ps4RegulerData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'family-vip-room'
                                                  ? familyVIPRoomData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'lovebirds-vip-room'
                                                  ? lovebirdsVIPRoomData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'family-open-space'
                                                  ? familyOpenSpaceData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'squad-open-space'
                                                  ? squadOpenSpaceData[
                                                      'custom-prices'
                                                    ]
                                                  : []

                                              return priceDataCustom.length > 0
                                                ? priceDataCustom.map(
                                                    (price, index) => (
                                                      <span key={index}>
                                                        • {price.keterangan},{' '}
                                                        {formatDateIndonesian(
                                                          price.date,
                                                        )}
                                                        - IDR {price.price}
                                                        /hour
                                                      </span>
                                                    ),
                                                  )
                                                : null
                                            })()}
                                          </DrawerDescription>
                                        </DrawerHeader>{' '}
                                        {drawerContent !== 'default' && (
                                          <>
                                            <input
                                              value={filterKeyword}
                                              onChange={(e) => {
                                                handleInputFilterCatalogChange(
                                                  e,
                                                )
                                                setFilterKeyword(e.target.value)
                                              }}
                                              required
                                              placeholder={'Search game'}
                                              className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 mx-5 !py-2 "
                                            />
                                            {(catalogs.length != 0 ||
                                              filteredCatalogs.length != 0) && (
                                              <span className="text-gray-400 text-sm mx-5 flex mt-2">
                                                <MdOutlineUpdate className="text-lg" />
                                                Last updated at{' '}
                                                {formatTimestampIndonesian(
                                                  latestUpdatedAt,
                                                )}
                                              </span>
                                            )}
                                          </>
                                        )}
                                        {timeSet == null ? (
                                          <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                            <div className="flex flex-col gap-1 items-center justify-center">
                                              <Image
                                                src={'/error.png'}
                                                width={0}
                                                height={0}
                                                className="w-[150px]"
                                                alt={'No content available'}
                                              />
                                              <p className="text-base font-normal text-gray-400">
                                                Oopss!!! Sorry Ikuzo, this space
                                                is closed not operating today.
                                              </p>
                                            </div>
                                          </div>
                                        ) : drawerContent === 'default' ? (
                                          <div className="flex-relative w-full h-fit px-5">
                                            <div
                                              style={{
                                                backgroundColor: '#ffffff',
                                                borderRadius: '10px',
                                                position: 'relative',
                                                overflow: 'hidden',
                                              }}
                                            >
                                              <img
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${positions[2].pict}`}
                                                useMap="#image-map"
                                                alt=""
                                                style={{
                                                  width: '100%',
                                                  height: 'auto',
                                                }}
                                              />
                                            </div>
                                            {reserves.length > 0 ? (
                                              <>
                                                <Fade>
                                                  <div className="flex gap-1 w-full my-2">
                                                    <div className="flex flex-col gap-2 w-full flex-1">
                                                      <label
                                                        htmlFor="nama"
                                                        className="text-sm"
                                                      >
                                                        Reserved Times
                                                      </label>
                                                      <div className="flex flex-row flex-wrap gap-1">
                                                        {reserves.length > 0
                                                          ? reserves.map(
                                                              (
                                                                reserve,
                                                                index,
                                                              ) => (
                                                                <div
                                                                  className={`text-xs px-2 py-1 border ${
                                                                    reserve.status_reserve ===
                                                                    'pending'
                                                                      ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                                      : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                                  } rounded-md w-fit`}
                                                                >
                                                                  {
                                                                    reserve.reserve_start_time
                                                                  }{' '}
                                                                  -{' '}
                                                                  {
                                                                    reserve.reserve_end_time
                                                                  }{' '}
                                                                  WIB
                                                                </div>
                                                              ),
                                                            )
                                                          : null}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </Fade>
                                              </>
                                            ) : null}
                                            <Fade>
                                              <div className="flex gap-1 w-full mt-2 mb-3">
                                                <div className="flex flex-col gap-2 w-full flex-1">
                                                  <label
                                                    htmlFor="nama"
                                                    className="text-sm"
                                                  >
                                                    Start Time
                                                  </label>
                                                  <Select
                                                    value={startTimeReservasi}
                                                    onValueChange={(value) =>
                                                      setStartTimeReservasi(
                                                        value,
                                                      )
                                                    }
                                                    required
                                                    className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                                  >
                                                    <SelectTrigger className="py-5 px-3 text-sm">
                                                      <SelectValue
                                                        className="text-base"
                                                        placeholder="00.00"
                                                      />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectLabel className="text-sm">
                                                          Pilih Waktu Mulai
                                                        </SelectLabel>
                                                        {generatedTimes.map(
                                                          (time, index) => (
                                                            <SelectItem
                                                              key={index}
                                                              value={time}
                                                            >
                                                              {time}
                                                            </SelectItem>
                                                          ),
                                                        )}
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="flex flex-col gap-2 w-full flex-1">
                                                  <label
                                                    htmlFor="nama"
                                                    className="text-sm"
                                                  >
                                                    End Time
                                                  </label>
                                                  <Select
                                                    value={endTimeReservasi}
                                                    onValueChange={(value) =>
                                                      setEndTimeReservasi(value)
                                                    }
                                                    required
                                                    className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                                  >
                                                    <SelectTrigger className="py-5 px-3 text-sm">
                                                      <SelectValue
                                                        className="text-base"
                                                        placeholder="00.00"
                                                      />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectLabel className="text-sm">
                                                          Pilih Waktu Berakhir
                                                        </SelectLabel>
                                                        {startTimeReservasi !=
                                                          '' &&
                                                        timeArray.length !=
                                                          0 ? (
                                                          timeArray.map(
                                                            (time, index) => {
                                                              const isDisabled = disableTimes.includes(
                                                                time,
                                                              )

                                                              return (
                                                                <SelectItem
                                                                  key={index}
                                                                  value={time}
                                                                  className={
                                                                    'text-sm'
                                                                  }
                                                                  disabled={
                                                                    isDisabled
                                                                  }
                                                                >
                                                                  {time}
                                                                </SelectItem>
                                                              )
                                                            },
                                                          )
                                                        ) : (
                                                          <SelectItem
                                                            value={'00.00'}
                                                          >
                                                            <p className="text-gray-500">
                                                              Waktu yang kamu
                                                              pilih <br />
                                                              sudah terisi.
                                                              Silakan <br />
                                                              pilih waktu
                                                              bermain <br />
                                                              di jam yang lain
                                                            </p>
                                                          </SelectItem>
                                                        )}
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                            </Fade>
                                          </div>
                                        ) : catalogs.length > 0 ? (
                                          <div
                                            className={`grid ${
                                              filteredCatalogs.length == 0 &&
                                              filterKeyword != ''
                                                ? 'grid-cols-1'
                                                : 'grid-cols-3'
                                            } gap-4  ${
                                              catalogs.length > 9
                                                ? 'h-[350px]'
                                                : 'h-fit'
                                            } overflow-y-scroll py-4 px-7`}
                                          >
                                            {filteredCatalogs.length == 0 ? (
                                              filterKeyword == '' ? (
                                                catalogs.map(
                                                  (catalog, index) => (
                                                    <div
                                                      key={index}
                                                      className="flex flex-col gap-2 items-center justify-center"
                                                    >
                                                      <Image
                                                        alt={
                                                          catalog.catalog_img
                                                        }
                                                        width={0}
                                                        height={0}
                                                        className="rounded-lg w-full h-[110px] !md:[300px] object-cover"
                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${catalog.catalog_img}`}
                                                      />
                                                      <p className="text-gray-500 text-sm text-center leading-[100%]">
                                                        {catalog.catalog_txt.substring(
                                                          0,
                                                          10,
                                                        ) + '...'}
                                                      </p>
                                                    </div>
                                                  ),
                                                )
                                              ) : (
                                                <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                                  <div className="flex flex-col gap-1 items-center justify-center">
                                                    <Image
                                                      src={'/error.png'}
                                                      width={0}
                                                      height={0}
                                                      className="w-[150px]"
                                                      alt={
                                                        'No content available'
                                                      }
                                                    />
                                                    <p className="text-base font-normal text-gray-400">
                                                      There is no any contents
                                                      right now ikuzo!
                                                    </p>
                                                  </div>
                                                </div>
                                              )
                                            ) : (
                                              filteredCatalogs.map(
                                                (catalog, index) => (
                                                  <div
                                                    key={index}
                                                    className="flex flex-col gap-2 items-center justify-center"
                                                  >
                                                    <Image
                                                      alt={catalog.catalog_img}
                                                      width={0}
                                                      height={0}
                                                      className="rounded-lg w-full h-[110px] !md:[300px] object-cover"
                                                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${catalog.catalog_img}`}
                                                    />
                                                    <p className="text-gray-500 text-sm text-center leading-[100%]">
                                                      {catalog.catalog_txt.substring(
                                                        0,
                                                        10,
                                                      ) + '...'}
                                                    </p>
                                                  </div>
                                                ),
                                              )
                                            )}
                                          </div>
                                        ) : (
                                          <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                            <div className="flex flex-col gap-1 items-center justify-center">
                                              <Image
                                                src={'/error.png'}
                                                width={0}
                                                height={0}
                                                className="w-[150px]"
                                                alt={'No content available'}
                                              />
                                              <p className="text-base font-normal text-gray-400">
                                                There is no any contents right
                                                now ikuzo!
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                        {drawerContent === 'default' ? (
                                          <div className="flex flex-col gap-2 px-5 my-2">
                                            <DrawerClose asChild>
                                              {timeSet == null ? (
                                                <></>
                                              ) : (
                                                <Button
                                                  variant="outline"
                                                  className={`bg-orange text-white border-orange py-5`}
                                                >
                                                  Continue
                                                </Button>
                                              )}
                                            </DrawerClose>
                                            <Button
                                              variant="outline"
                                              className={`bg-transparent text-orange border-orange py-5`}
                                              onClick={(e) =>
                                                handleCatalogClick(number)
                                              }
                                            >
                                              <IoMdBook className="text-lg mr-2" />{' '}
                                              Lihat Catalog Game
                                            </Button>
                                          </div>
                                        ) : (
                                          <Button
                                            variant="outline"
                                            className={`bg-transparent text-orange border-orange py-5 mx-5 mt-2`}
                                            onClick={handleCloseCatalogClick}
                                          >
                                            <IoMdClose className="text-lg mr-2" />{' '}
                                            Close Catalog
                                          </Button>
                                        )}
                                      </DrawerContent>
                                    </Drawer>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                        {selectedReservationPlace == 'private-space' &&
                          selectedDate != '' && (
                            <div className="flex flex-col mb-6">
                              <div
                                className={`flex flex-row w-auto top-7 gap-16 md:gap-64 absolute left-[16%] md:top-16  z-50 gap-[${
                                  10 + scale * 10
                                }]`}
                                ref={imageRef}
                                style={{
                                  height: 'auto',
                                  transform: `translate(${position.x}px, ${position.y}px)`,
                                  cursor: 'move',
                                }}
                              >
                                {[18, 19].map((number) => {
                                  return (
                                    <Drawer
                                      key={number}
                                      onClose={(e) => {
                                        setDrawerContent('default')
                                        handleCloseCatalogClick()
                                      }}
                                    >
                                      <DrawerTrigger asChild>
                                        <div
                                          key={number}
                                          className={`cursor-pointer md:w-28 md:h-28 w-20 h-10 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} rounded-lg py-2 flex-col items-center justify-center flex`}
                                          onClick={() => {
                                            setPosisiReservasi(number)
                                            setNamaPosisiReservasi(
                                              positions[4].name,
                                            )

                                            getPriceSetForToday(
                                              positions[4].name,
                                              selectedDate,
                                            )
                                            fetchingAvailableReservation(
                                              selectedDate,
                                              number,
                                            )
                                            getPriceDataCustom(
                                              positions[4].name,
                                            )
                                          }}
                                          style={{
                                            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                          }}
                                        >
                                          <p className="opacity-100 text-[0.65rem] py-2 text-white text-center leading-none">
                                            Family VIP Room
                                          </p>{' '}
                                        </div>
                                      </DrawerTrigger>
                                      <DrawerContent className="active:border-none border-none outline-none md:max-w-3xl md:mx-auto">
                                        <DrawerHeader className="text-left">
                                          <DrawerTitle>
                                            {positions[4].name}
                                          </DrawerTitle>
                                          <DrawerDescription>
                                            Can only accomodate{' '}
                                            {positions[4].capacity} person
                                            (position {number}).
                                          </DrawerDescription>
                                          <DrawerDescription className="flex flex-col gap-0 mt-0 pt-0">
                                            <span className="font-semibold">
                                              Price on:
                                            </span>
                                            {(() => {
                                              const facilityId = getFacilityId(
                                                positions[4].name,
                                              ) // Get the facility ID
                                              const priceData =
                                                facilityId === 'ps5-reguler'
                                                  ? ps5RegulerData.prices
                                                  : facilityId ===
                                                    'ikuzo-racing-simulator'
                                                  ? ikuzoRacingSimulatorData.prices
                                                  : facilityId === 'ps4-reguler'
                                                  ? ps4RegulerData.prices
                                                  : facilityId ===
                                                    'family-vip-room'
                                                  ? familyVIPRoomData.prices
                                                  : facilityId ===
                                                    'lovebirds-vip-room'
                                                  ? lovebirdsVIPRoomData.prices
                                                  : facilityId ===
                                                    'family-open-space'
                                                  ? familyOpenSpaceData.prices
                                                  : facilityId ===
                                                    'squad-open-space'
                                                  ? squadOpenSpaceData.prices
                                                  : []

                                              return priceData.length > 0
                                                ? priceData.map(
                                                    (price, index) => (
                                                      <span key={index}>
                                                        • {price.day} - IDR{' '}
                                                        {price.price}/hour
                                                      </span>
                                                    ),
                                                  )
                                                : null
                                            })()}
                                            {(() => {
                                              const facilityId = getFacilityId(
                                                positions[4].name,
                                              ) // Get the facility ID
                                              const priceDataCustom =
                                                facilityId === 'ps5-reguler'
                                                  ? ps5RegulerData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'ikuzo-racing-simulator'
                                                  ? ikuzoRacingSimulatorData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId === 'ps4-reguler'
                                                  ? ps4RegulerData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'family-vip-room'
                                                  ? familyVIPRoomData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'lovebirds-vip-room'
                                                  ? lovebirdsVIPRoomData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'family-open-space'
                                                  ? familyOpenSpaceData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'squad-open-space'
                                                  ? squadOpenSpaceData[
                                                      'custom-prices'
                                                    ]
                                                  : []

                                              return priceDataCustom.length > 0
                                                ? priceDataCustom.map(
                                                    (price, index) => (
                                                      <span key={index}>
                                                        • {price.keterangan},{' '}
                                                        {formatDateIndonesian(
                                                          price.date,
                                                        )}
                                                        - IDR {price.price}
                                                        /hour
                                                      </span>
                                                    ),
                                                  )
                                                : null
                                            })()}
                                          </DrawerDescription>
                                        </DrawerHeader>{' '}
                                        {drawerContent !== 'default' && (
                                          <>
                                            <input
                                              value={filterKeyword}
                                              onChange={(e) => {
                                                handleInputFilterCatalogChange(
                                                  e,
                                                )
                                                setFilterKeyword(e.target.value)
                                              }}
                                              required
                                              placeholder={'Search game'}
                                              className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 mx-5 !py-2 "
                                            />
                                            {(catalogs.length != 0 ||
                                              filteredCatalogs.length != 0) && (
                                              <span className="text-gray-400 text-sm mx-5 flex mt-2">
                                                <MdOutlineUpdate className="text-lg" />
                                                Last updated at{' '}
                                                {formatTimestampIndonesian(
                                                  latestUpdatedAt,
                                                )}
                                              </span>
                                            )}
                                          </>
                                        )}
                                        {timeSet == null ? (
                                          <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                            <div className="flex flex-col gap-1 items-center justify-center">
                                              <Image
                                                src={'/error.png'}
                                                width={0}
                                                height={0}
                                                className="w-[150px]"
                                                alt={'No content available'}
                                              />
                                              <p className="text-base font-normal text-gray-400">
                                                Oopss!!! Sorry Ikuzo, this space
                                                is closed not operating today.
                                              </p>
                                            </div>
                                          </div>
                                        ) : drawerContent === 'default' ? (
                                          <div className="flex-relative w-full h-fit px-5">
                                            <div
                                              style={{
                                                backgroundColor: '#ffffff',
                                                borderRadius: '10px',
                                                position: 'relative',
                                                overflow: 'hidden',
                                              }}
                                            >
                                              <img
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${positions[4].pict}`}
                                                useMap="#image-map"
                                                alt=""
                                                style={{
                                                  width: '100%',
                                                  height: 'auto',
                                                }}
                                              />
                                            </div>
                                            {reserves.length > 0 ? (
                                              <>
                                                <Fade>
                                                  <div className="flex gap-1 w-full my-2">
                                                    <div className="flex flex-col gap-2 w-full flex-1">
                                                      <label
                                                        htmlFor="nama"
                                                        className="text-sm"
                                                      >
                                                        Reserved Times
                                                      </label>
                                                      <div className="flex flex-row flex-wrap gap-1">
                                                        {reserves.length > 0
                                                          ? reserves.map(
                                                              (
                                                                reserve,
                                                                index,
                                                              ) => (
                                                                <div
                                                                  className={`text-xs px-2 py-1 border ${
                                                                    reserve.status_reserve ===
                                                                    'pending'
                                                                      ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                                      : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                                  } rounded-md w-fit`}
                                                                >
                                                                  {
                                                                    reserve.reserve_start_time
                                                                  }{' '}
                                                                  -{' '}
                                                                  {
                                                                    reserve.reserve_end_time
                                                                  }{' '}
                                                                  WIB
                                                                </div>
                                                              ),
                                                            )
                                                          : null}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </Fade>
                                              </>
                                            ) : null}
                                            <Fade>
                                              <div className="flex gap-1 w-full mt-2 mb-3">
                                                <div className="flex flex-col gap-2 w-full flex-1">
                                                  <label
                                                    htmlFor="nama"
                                                    className="text-sm"
                                                  >
                                                    Start Time
                                                  </label>
                                                  <Select
                                                    value={startTimeReservasi}
                                                    onValueChange={(value) =>
                                                      setStartTimeReservasi(
                                                        value,
                                                      )
                                                    }
                                                    required
                                                    className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                                  >
                                                    <SelectTrigger className="py-5 px-3 text-sm">
                                                      <SelectValue
                                                        className="text-base"
                                                        placeholder="00.00"
                                                      />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectLabel className="text-sm">
                                                          Pilih Waktu Mulai
                                                        </SelectLabel>
                                                        {generatedTimes.map(
                                                          (time, index) => (
                                                            <SelectItem
                                                              key={index}
                                                              value={time}
                                                            >
                                                              {time}
                                                            </SelectItem>
                                                          ),
                                                        )}
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="flex flex-col gap-2 w-full flex-1">
                                                  <label
                                                    htmlFor="nama"
                                                    className="text-sm"
                                                  >
                                                    End Time
                                                  </label>
                                                  <Select
                                                    value={endTimeReservasi}
                                                    onValueChange={(value) =>
                                                      setEndTimeReservasi(value)
                                                    }
                                                    required
                                                    className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                                  >
                                                    <SelectTrigger className="py-5 px-3 text-sm">
                                                      <SelectValue
                                                        className="text-base"
                                                        placeholder="00.00"
                                                      />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectLabel className="text-sm">
                                                          Pilih Waktu Berakhir
                                                        </SelectLabel>
                                                        {startTimeReservasi !=
                                                          '' &&
                                                        timeArray.length !=
                                                          0 ? (
                                                          timeArray.map(
                                                            (time, index) => {
                                                              const isDisabled = disableTimes.includes(
                                                                time,
                                                              )

                                                              return (
                                                                <SelectItem
                                                                  key={index}
                                                                  value={time}
                                                                  className={
                                                                    'text-sm'
                                                                  }
                                                                  disabled={
                                                                    isDisabled
                                                                  }
                                                                >
                                                                  {time}
                                                                </SelectItem>
                                                              )
                                                            },
                                                          )
                                                        ) : (
                                                          <SelectItem
                                                            value={'00.00'}
                                                          >
                                                            <p className="text-gray-500">
                                                              Waktu yang kamu
                                                              pilih <br />
                                                              sudah terisi.
                                                              Silakan <br />
                                                              pilih waktu
                                                              bermain <br />
                                                              di jam yang lain
                                                            </p>
                                                          </SelectItem>
                                                        )}
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                            </Fade>
                                          </div>
                                        ) : catalogs.length > 0 ? (
                                          <div
                                            className={`grid ${
                                              filteredCatalogs.length == 0 &&
                                              filterKeyword != ''
                                                ? 'grid-cols-1'
                                                : 'grid-cols-3'
                                            } gap-4  ${
                                              catalogs.length > 9
                                                ? 'h-[350px]'
                                                : 'h-fit'
                                            } overflow-y-scroll py-4 px-7`}
                                          >
                                            {filteredCatalogs.length == 0 ? (
                                              filterKeyword == '' ? (
                                                catalogs.map(
                                                  (catalog, index) => (
                                                    <div
                                                      key={index}
                                                      className="flex flex-col gap-2 items-center justify-center"
                                                    >
                                                      <Image
                                                        alt={
                                                          catalog.catalog_img
                                                        }
                                                        width={0}
                                                        height={0}
                                                        className="rounded-lg w-full h-[110px] !md:[300px] object-cover"
                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${catalog.catalog_img}`}
                                                      />
                                                      <p className="text-gray-500 text-sm text-center leading-[100%]">
                                                        {catalog.catalog_txt.substring(
                                                          0,
                                                          10,
                                                        ) + '...'}
                                                      </p>
                                                    </div>
                                                  ),
                                                )
                                              ) : (
                                                <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                                  <div className="flex flex-col gap-1 items-center justify-center">
                                                    <Image
                                                      src={'/error.png'}
                                                      width={0}
                                                      height={0}
                                                      className="w-[150px]"
                                                      alt={
                                                        'No content available'
                                                      }
                                                    />
                                                    <p className="text-base font-normal text-gray-400">
                                                      There is no any contents
                                                      right now ikuzo!
                                                    </p>
                                                  </div>
                                                </div>
                                              )
                                            ) : (
                                              filteredCatalogs.map(
                                                (catalog, index) => (
                                                  <div
                                                    key={index}
                                                    className="flex flex-col gap-2 items-center justify-center"
                                                  >
                                                    <Image
                                                      alt={catalog.catalog_img}
                                                      width={0}
                                                      height={0}
                                                      className="rounded-lg w-full h-[110px] !md:[300px] object-cover"
                                                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${catalog.catalog_img}`}
                                                    />
                                                    <p className="text-gray-500 text-sm text-center leading-[100%]">
                                                      {catalog.catalog_txt.substring(
                                                        0,
                                                        10,
                                                      ) + '...'}
                                                    </p>
                                                  </div>
                                                ),
                                              )
                                            )}
                                          </div>
                                        ) : (
                                          <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                            <div className="flex flex-col gap-1 items-center justify-center">
                                              <Image
                                                src={'/error.png'}
                                                width={0}
                                                height={0}
                                                className="w-[150px]"
                                                alt={'No content available'}
                                              />
                                              <p className="text-base font-normal text-gray-400">
                                                There is no any contents right
                                                now ikuzo!
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                        {drawerContent === 'default' ? (
                                          <div className="flex flex-col gap-2 px-5 my-2">
                                            {timeSet == null ? (
                                              <></>
                                            ) : (
                                              <DrawerClose asChild>
                                                <Button
                                                  variant="outline"
                                                  className={`bg-orange text-white border-orange py-5`}
                                                >
                                                  Continue
                                                </Button>
                                              </DrawerClose>
                                            )}
                                            <Button
                                              variant="outline"
                                              className={`bg-transparent text-orange border-orange py-5`}
                                              onClick={(e) =>
                                                handleCatalogClick(number)
                                              }
                                            >
                                              <IoMdBook className="text-lg mr-2" />{' '}
                                              Lihat Catalog Game
                                            </Button>
                                          </div>
                                        ) : (
                                          <Button
                                            variant="outline"
                                            className={`bg-transparent text-orange border-orange py-5 mx-5 mt-2`}
                                            onClick={handleCloseCatalogClick}
                                          >
                                            <IoMdClose className="text-lg mr-2" />{' '}
                                            Close Catalog
                                          </Button>
                                        )}
                                      </DrawerContent>
                                    </Drawer>
                                  )
                                })}
                              </div>

                              <div
                                className={`flex flex-row w-full top-[11rem] md:top-[26rem] gap-3 md:gap-24 absolute left-6  md:left-32 z-50 gap-[${
                                  10 + scale * 10
                                }]`}
                                ref={imageRef}
                                style={{
                                  height: 'auto',
                                  transform: `translate(${position.x}px, ${position.y}px)`,
                                  cursor: 'move',
                                }}
                              >
                                {[20, 21, 22].map((number) => {
                                  return (
                                    <Drawer
                                      onClose={(e) => {
                                        setDrawerContent('default')
                                        handleCloseCatalogClick()
                                      }}
                                      key={number}
                                    >
                                      <DrawerTrigger asChild>
                                        <div
                                          key={number}
                                          className={`cursor-pointer md:w-28 md:h-28 w-20 h-10 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} rounded-lg py-2 flex-col items-center justify-center flex ${
                                            number == 10 && 'mr-16'
                                          }`}
                                          onClick={() => {
                                            setPosisiReservasi(number)
                                            setNamaPosisiReservasi(
                                              positions[5].name,
                                            )

                                            getPriceSetForToday(
                                              positions[5].name,
                                              selectedDate,
                                            )
                                            fetchingAvailableReservation(
                                              selectedDate,
                                              number,
                                            )
                                            getPriceDataCustom(
                                              positions[5].name,
                                            )
                                          }}
                                          style={{
                                            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                          }}
                                        >
                                          <p className="opacity-100 text-[0.65rem] text-center leading-none py-2 text-white">
                                            LoveBirds VIP Room
                                          </p>
                                        </div>
                                      </DrawerTrigger>
                                      <DrawerContent className="active:border-none border-none outline-none md:max-w-3xl md:mx-auto">
                                        <DrawerHeader className="text-left">
                                          <DrawerTitle>
                                            {positions[5].name}
                                          </DrawerTitle>
                                          <DrawerDescription>
                                            Can only accommodate{' '}
                                            {positions[5].capacity} person
                                            (position {number}).
                                          </DrawerDescription>
                                          <DrawerDescription className="flex flex-col gap-0 mt-0 pt-0">
                                            <span className="font-semibold">
                                              Price on:
                                            </span>
                                            {(() => {
                                              const facilityId = getFacilityId(
                                                positions[5].name,
                                              ) // Get the facility ID
                                              const priceData =
                                                facilityId === 'ps5-reguler'
                                                  ? ps5RegulerData.prices
                                                  : facilityId ===
                                                    'ikuzo-racing-simulator'
                                                  ? ikuzoRacingSimulatorData.prices
                                                  : facilityId === 'ps4-reguler'
                                                  ? ps4RegulerData.prices
                                                  : facilityId ===
                                                    'family-vip-room'
                                                  ? familyVIPRoomData.prices
                                                  : facilityId ===
                                                    'lovebirds-vip-room'
                                                  ? lovebirdsVIPRoomData.prices
                                                  : facilityId ===
                                                    'family-open-space'
                                                  ? familyOpenSpaceData.prices
                                                  : facilityId ===
                                                    'squad-open-space'
                                                  ? squadOpenSpaceData.prices
                                                  : []

                                              return priceData.length > 0
                                                ? priceData.map(
                                                    (price, index) => (
                                                      <span key={index}>
                                                        • {price.day} - IDR{' '}
                                                        {price.price}/hour
                                                      </span>
                                                    ),
                                                  )
                                                : null
                                            })()}
                                            {(() => {
                                              const facilityId = getFacilityId(
                                                positions[5].name,
                                              ) // Get the facility ID
                                              const priceDataCustom =
                                                facilityId === 'ps5-reguler'
                                                  ? ps5RegulerData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'ikuzo-racing-simulator'
                                                  ? ikuzoRacingSimulatorData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId === 'ps4-reguler'
                                                  ? ps4RegulerData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'family-vip-room'
                                                  ? familyVIPRoomData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'lovebirds-vip-room'
                                                  ? lovebirdsVIPRoomData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'family-open-space'
                                                  ? familyOpenSpaceData[
                                                      'custom-prices'
                                                    ]
                                                  : facilityId ===
                                                    'squad-open-space'
                                                  ? squadOpenSpaceData[
                                                      'custom-prices'
                                                    ]
                                                  : []

                                              return priceDataCustom.length > 0
                                                ? priceDataCustom.map(
                                                    (price, index) => (
                                                      <span key={index}>
                                                        • {price.keterangan},{' '}
                                                        {formatDateIndonesian(
                                                          price.date,
                                                        )}
                                                        - IDR {price.price}
                                                        /hour
                                                      </span>
                                                    ),
                                                  )
                                                : null
                                            })()}
                                          </DrawerDescription>
                                        </DrawerHeader>{' '}
                                        {drawerContent !== 'default' && (
                                          <>
                                            <input
                                              value={filterKeyword}
                                              onChange={(e) => {
                                                handleInputFilterCatalogChange(
                                                  e,
                                                )
                                                setFilterKeyword(e.target.value)
                                              }}
                                              required
                                              placeholder={'Search game'}
                                              className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 mx-5 !py-2 "
                                            />
                                            {(catalogs.length != 0 ||
                                              filteredCatalogs.length != 0) && (
                                              <span className="text-gray-400 text-sm mx-5 flex mt-2">
                                                <MdOutlineUpdate className="text-lg" />
                                                Last updated at{' '}
                                                {formatTimestampIndonesian(
                                                  latestUpdatedAt,
                                                )}
                                              </span>
                                            )}
                                          </>
                                        )}
                                        {timeSet == null ? (
                                          <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                            <div className="flex flex-col gap-1 items-center justify-center">
                                              <Image
                                                src={'/error.png'}
                                                width={0}
                                                height={0}
                                                className="w-[150px]"
                                                alt={'No content available'}
                                              />
                                              <p className="text-base font-normal text-gray-400">
                                                Oopss!!! Sorry Ikuzo, this space
                                                is closed not operating today.
                                              </p>
                                            </div>
                                          </div>
                                        ) : drawerContent === 'default' ? (
                                          <div className="flex-relative w-full h-fit px-5">
                                            <div
                                              style={{
                                                backgroundColor: '#ffffff',
                                                borderRadius: '10px',
                                                position: 'relative',
                                                overflow: 'hidden',
                                              }}
                                            >
                                              <img
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${positions[5].pict}`}
                                                useMap="#image-map"
                                                alt=""
                                                style={{
                                                  width: '100%',
                                                  height: 'auto',
                                                }}
                                              />
                                            </div>
                                            {reserves.length > 0 ? (
                                              <>
                                                <Fade>
                                                  <div className="flex gap-1 w-full my-2">
                                                    <div className="flex flex-col gap-2 w-full flex-1">
                                                      <label
                                                        htmlFor="nama"
                                                        className="text-sm"
                                                      >
                                                        Reserved Times
                                                      </label>
                                                      <div className="flex flex-row flex-wrap gap-1">
                                                        {reserves.length > 0
                                                          ? reserves.map(
                                                              (
                                                                reserve,
                                                                index,
                                                              ) => (
                                                                <div
                                                                  className={`text-xs px-2 py-1 border ${
                                                                    reserve.status_reserve ===
                                                                    'pending'
                                                                      ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                                      : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                                  } rounded-md w-fit`}
                                                                >
                                                                  {
                                                                    reserve.reserve_start_time
                                                                  }{' '}
                                                                  -{' '}
                                                                  {
                                                                    reserve.reserve_end_time
                                                                  }{' '}
                                                                  WIB
                                                                </div>
                                                              ),
                                                            )
                                                          : null}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </Fade>
                                              </>
                                            ) : null}

                                            <Fade>
                                              <div className="flex gap-1 w-full mt-2 mb-3">
                                                <div className="flex flex-col gap-2 w-full flex-1">
                                                  <label
                                                    htmlFor="nama"
                                                    className="text-sm"
                                                  >
                                                    Start Time
                                                  </label>
                                                  <Select
                                                    value={startTimeReservasi}
                                                    onValueChange={(value) =>
                                                      setStartTimeReservasi(
                                                        value,
                                                      )
                                                    }
                                                    required
                                                    className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                                  >
                                                    <SelectTrigger className="py-5 px-3 text-sm">
                                                      <SelectValue
                                                        className="text-base"
                                                        placeholder="00.00"
                                                      />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectLabel className="text-sm">
                                                          Pilih Waktu Mulai
                                                        </SelectLabel>
                                                        {generatedTimes.map(
                                                          (time, index) => (
                                                            <SelectItem
                                                              key={index}
                                                              value={time}
                                                            >
                                                              {time}
                                                            </SelectItem>
                                                          ),
                                                        )}
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="flex flex-col gap-2 w-full flex-1">
                                                  <label
                                                    htmlFor="nama"
                                                    className="text-sm"
                                                  >
                                                    End Time
                                                  </label>
                                                  <Select
                                                    value={endTimeReservasi}
                                                    onValueChange={(value) =>
                                                      setEndTimeReservasi(value)
                                                    }
                                                    required
                                                    className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                                                  >
                                                    <SelectTrigger className="py-5 px-3 text-sm">
                                                      <SelectValue
                                                        className="text-base"
                                                        placeholder="00.00"
                                                      />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectLabel className="text-sm">
                                                          Pilih Waktu Berakhir
                                                        </SelectLabel>
                                                        {startTimeReservasi !=
                                                          '' &&
                                                        timeArray.length !=
                                                          0 ? (
                                                          timeArray.map(
                                                            (time, index) => {
                                                              const isDisabled = disableTimes.includes(
                                                                time,
                                                              )

                                                              return (
                                                                <SelectItem
                                                                  key={index}
                                                                  value={time}
                                                                  className={
                                                                    'text-sm'
                                                                  }
                                                                  disabled={
                                                                    isDisabled
                                                                  }
                                                                >
                                                                  {time}
                                                                </SelectItem>
                                                              )
                                                            },
                                                          )
                                                        ) : (
                                                          <SelectItem
                                                            value={'00.00'}
                                                          >
                                                            <p className="text-gray-500">
                                                              Waktu yang kamu
                                                              pilih <br />
                                                              sudah terisi.
                                                              Silakan <br />
                                                              pilih waktu
                                                              bermain <br />
                                                              di jam yang lain
                                                            </p>
                                                          </SelectItem>
                                                        )}
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                            </Fade>
                                          </div>
                                        ) : catalogs.length > 0 ? (
                                          <div
                                            className={`grid ${
                                              filteredCatalogs.length == 0 &&
                                              filterKeyword != ''
                                                ? 'grid-cols-1'
                                                : 'grid-cols-3'
                                            } gap-4  ${
                                              catalogs.length > 9
                                                ? 'h-[350px]'
                                                : 'h-fit'
                                            } overflow-y-scroll py-4 px-7`}
                                          >
                                            {filteredCatalogs.length == 0 ? (
                                              filterKeyword == '' ? (
                                                catalogs.map(
                                                  (catalog, index) => (
                                                    <div
                                                      key={index}
                                                      className="flex flex-col gap-2 items-center justify-center"
                                                    >
                                                      <Image
                                                        alt={
                                                          catalog.catalog_img
                                                        }
                                                        width={0}
                                                        height={0}
                                                        className="rounded-lg w-full h-[110px] !md:[300px] object-cover"
                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${catalog.catalog_img}`}
                                                      />
                                                      <p className="text-gray-500 text-sm text-center leading-[100%]">
                                                        {catalog.catalog_txt.substring(
                                                          0,
                                                          10,
                                                        ) + '...'}
                                                      </p>
                                                    </div>
                                                  ),
                                                )
                                              ) : (
                                                <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                                  <div className="flex flex-col gap-1 items-center justify-center">
                                                    <Image
                                                      src={'/error.png'}
                                                      width={0}
                                                      height={0}
                                                      className="w-[150px]"
                                                      alt={
                                                        'No content available'
                                                      }
                                                    />
                                                    <p className="text-base font-normal text-gray-400">
                                                      There is no any contents
                                                      right now ikuzo!
                                                    </p>
                                                  </div>
                                                </div>
                                              )
                                            ) : (
                                              filteredCatalogs.map(
                                                (catalog, index) => (
                                                  <div
                                                    key={index}
                                                    className="flex flex-col gap-2 items-center justify-center"
                                                  >
                                                    <Image
                                                      alt={catalog.catalog_img}
                                                      width={0}
                                                      height={0}
                                                      className="rounded-lg w-full h-[110px] !md:[300px] object-cover"
                                                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${catalog.catalog_img}`}
                                                    />
                                                    <p className="text-gray-500 text-sm text-center leading-[100%]">
                                                      {catalog.catalog_txt.substring(
                                                        0,
                                                        10,
                                                      ) + '...'}
                                                    </p>
                                                  </div>
                                                ),
                                              )
                                            )}
                                          </div>
                                        ) : (
                                          <div className="w-full mt-10 mb-8  flex items-center justify-center">
                                            <div className="flex flex-col gap-1 items-center justify-center">
                                              <Image
                                                src={'/error.png'}
                                                width={0}
                                                height={0}
                                                className="w-[150px]"
                                                alt={'No content available'}
                                              />
                                              <p className="text-base font-normal text-gray-400">
                                                There is no any contents right
                                                now ikuzo!
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                        <DrawerFooter className="pt-2">
                                          {drawerContent === 'default' ? (
                                            <div className="flex flex-col gap-2 px-2 mt-2">
                                              {timeSet == null ? (
                                                <></>
                                              ) : (
                                                <DrawerClose asChild>
                                                  <Button
                                                    variant="outline"
                                                    className={`bg-orange text-white border-orange py-5`}
                                                  >
                                                    Continue
                                                  </Button>
                                                </DrawerClose>
                                              )}
                                              <Button
                                                variant="outline"
                                                className={`bg-transparent text-orange border-orange py-5`}
                                                onClick={(e) =>
                                                  handleCatalogClick(number)
                                                }
                                              >
                                                <IoMdBook className="text-lg mr-2" />{' '}
                                                Lihat Catalog Game
                                              </Button>
                                            </div>
                                          ) : (
                                            <Button
                                              variant="outline"
                                              className={`bg-transparent text-orange border-orange py-5 mt-2`}
                                              onClick={handleCloseCatalogClick}
                                            >
                                              <IoMdClose className="text-lg mr-2" />{' '}
                                              Close Catalog
                                            </Button>
                                          )}
                                        </DrawerFooter>
                                      </DrawerContent>
                                    </Drawer>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </Fade>

                <Fade delay={7} duration={1300}>
                  <div className="flex flex-row gap-2 items-center justify-center mb-8">
                    <div className="flex gap-1 items-center">
                      <div className="w-4 h-4 border border-green-500 bg-green-500 bg-opacity-25 rounded-sm"></div>
                      <p className="text-xs text-white">selected</p>
                    </div>
                    <div className="flex gap-1 items-center">
                      <div className="w-4 h-4 border border-yellow-500 bg-yellow-500 bg-opacity-25 rounded-sm"></div>
                      <p className="text-xs text-white">in hold</p>
                    </div>
                    <div className="flex gap-1 items-center">
                      <div className="w-4 h-4 border border-red-500 bg-red-500 bg-opacity-25 rounded-sm"></div>
                      <p className="text-xs text-white">reserved</p>
                    </div>
                    <div className="flex gap-1 items-center">
                      <div className="w-4 h-4 border border-gray-500 bg-gray-500 bg-opacity-25 rounded-sm"></div>
                      <p className="text-xs text-white">available</p>
                    </div>
                  </div>
                </Fade>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-3 px-5 bg-gray-700  bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 border-opacity-25 shadow-md rounded-lg mt-5 py-7">
                <div className="p-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center w-full">
                      {' '}
                      <LoaderHome />
                    </div>
                  ) : (
                    <div>
                      <Fade>
                        <div className="space-y-1">
                          <h4 className="text-base font-jakarta font-medium leading-none text-white">
                            ID Reservasi
                          </h4>
                          <p className="text-base font-jakarta text-gray-300">
                            {idReservasi}
                          </p>
                        </div>
                      </Fade>
                      <Separator className="my-2" />
                      <Fade>
                        <div className="space-y-1">
                          <h4 className="text-base font-jakarta font-medium leading-none text-white">
                            Nama
                          </h4>
                          <p className="text-base font-jakarta text-gray-300">
                            {namaReservasi}
                          </p>
                        </div>
                      </Fade>
                      <Separator className="my-2" />
                      <Fade>
                        <div className="space-y-1">
                          <h4 className="text-base font-jakarta font-medium leading-none text-white">
                            No Whatsapp
                          </h4>
                          <p className="text-base font-jakarta text-gray-300">
                            {nomorWhatsappReservasi}
                          </p>
                        </div>
                      </Fade>
                      <Separator className="my-2" />
                      <Fade>
                        <div className="space-y-1">
                          <h4 className="text-base font-jakarta font-medium leading-none text-white">
                            Tanggal Reservasi
                          </h4>
                          <p className="text-base font-jakarta text-gray-300">
                            {formatDate(selectedDate)}
                          </p>
                        </div>
                      </Fade>
                      <Separator className="my-2" />
                      <Fade>
                        <div className="space-y-1">
                          <h4 className="text-base font-jakarta font-medium leading-none text-white">
                            Waktu Reservasi
                          </h4>
                          <p className="text-base font-jakarta text-gray-300">
                            {startTimeReservasi} - {endTimeReservasi} -{' '}
                            {totalTime} Hours
                          </p>
                        </div>
                      </Fade>
                      <Separator className="my-2" />
                      <Fade>
                        <div className="space-y-1">
                          <h4 className="text-base font-jakarta font-medium leading-none text-white">
                            Detail Tempat
                          </h4>
                          <p className="text-base font-jakarta text-gray-300">
                            in {namaPosisiReservasi}, Position {posisiReservasi}
                          </p>
                        </div>
                      </Fade>
                      <Separator className="my-2" />
                      <Fade>
                        <div className="space-y-1">
                          <h4 className="text-base font-jakarta font-medium leading-none text-white">
                            Total Harga
                          </h4>
                          <p className="text-base font-jakarta text-gray-300">
                            Rp{' '}
                            {pricePackageDetermination(
                              posisiReservasi,
                              totalTime,
                              selectedCustomPrices != null
                                ? selectedCustomPrices
                                : parseInt(selectedPriceToday),
                            )}
                          </p>
                        </div>
                      </Fade>
                      <Separator className="my-2" />

                      <Fade>
                        <div className="space-y-1">
                          <h4 className="text-base font-jakarta font-medium leading-none text-white">
                            Service Charge
                          </h4>
                          <p className="ttext-base font-jakarta text-gray-300">
                            Rp {4000}
                          </p>
                        </div>
                      </Fade>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {/* Button Continue */}
          {!continueTapped ? (
            <Button
              type="button"
              onClick={(e) => handleContinue()}
              className="font-medium text-white bg-orange w-full px-5 py-6 rounded-full hover:bg-orange text-base mt-5"
            >
              Continue
            </Button>
          ) : (
            <div className="flex flex-col gap-1 w-full mt-5">
              <Checkout
                id={idReservasi}
                price={
                  pricePackageDetermination(
                    posisiReservasi,
                    totalTime,
                    selectedCustomPrices != null
                      ? selectedCustomPrices
                      : parseInt(selectedPriceToday),
                  ) + 4000
                }
                productName={`Reservation ${namaPosisiReservasi}`}
                detailCustomer={{
                  name: namaReservasi,
                  no: nomorWhatsappReservasi,
                  reserve_date: selectedDate,
                  reserve_start_time: startTimeReservasi,
                  reserve_end_time: endTimeReservasi,
                  position: posisiReservasi,
                  location:
                    selectedReservationPlace == 'second-floor'
                      ? `${namaPosisiReservasi}`
                      : `${namaPosisiReservasi}`,
                }}
              />
              <Button
                variant="outline"
                onClick={(e) => handleCancle()}
                className="rounded-lg px-5 py-6 text-base font-jakarta"
              >
                Cancel
              </Button>
            </div>
          )}
        </section>
      )}
    </>
  )
}
