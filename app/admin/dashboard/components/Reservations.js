'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

// REVEAL
import { Fade } from 'react-awesome-reveal'

// UI COMPONENTS
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog-custom'
import {
  calculateTimeDifference,
  convertToStandardTime,
  extractHour,
  formatDate,
  generateTimeArray,
  generateTimeArrayWithStep,
  generateTimeArrayWithStepUser,
  getCurrentDate,
  getCurrentTime,
  getIndonesianDay,
  getMaxDate,
  getMaxTime,
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
import { addDays, format, startOfDay, subDays } from 'date-fns'
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
import Checkout from '@/app/components/Checkout'
import Loading from '@/app/reservation/loading'
import { BiMoney } from 'react-icons/bi'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import Toast from '@/app/components/Toast'
import { pricePackageDetermination } from '@/utils/price'
import { RESERVATION_PLACE } from '@/constans/reservations'
import getDocument from '@/firebase/firestore/getData'
import LoaderHome from '@/app/components/LoaderHome'
import { capitalizeAndFormat, getFacilityId } from '@/utils/text'
import { useFetchPositions } from '@/hooks/useFetchPositions'
import { apiBaseUrl } from '@/utils/urls'

export default function Reservation() {
  const [drawerContent, setDrawerContent] = useState('default')
  // RESERVATION STATE DATA
  const [continueTapped, setContinueTapped] = React.useState(false)
  const [idReservasi, setIdReservasi] = React.useState(generateRandomString)
  const [namaReservasi, setNamaReservasi] = React.useState('')
  const [nomorWhatsappReservasi, setNoWhatsappReservasi] = React.useState('')
  const [floorSelected, setFloorSelected] = React.useState('')
  const [startTimeReservasi, setStartTimeReservasi] = React.useState('')
  const [endTimeReservasi, setEndTimeReservasi] = React.useState('')
  const [totalTime, setTotalTime] = React.useState(null)
  const [currentDate, setCurrentDate] = React.useState(getCurrentDate)
  const [maxDate, setMaxDate] = React.useState(getMaxDate)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSelectPay, setIsSelectPay] = React.useState(false)
  const [selectedPay, setSelectedPay] = React.useState('')
  const [pricePerReserve, setPricePerReserve] = React.useState(0)

  const [reservesPosition, setReservesPosition] = useState([])
  const [reserves, setReserves] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])

  const [open, setOpen] = React.useState(false)

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

  const [dateClose, setDateClose] = React.useState([])

  const getDateClosed = async () => {
    try {
      const response = await axios.get(`${baseUrl}/dates`)
      if (response.status == 200) {
        const jsonData = await response.data
        setDateClose(jsonData.data)
      } else {
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      setIsLoading(false)
    }
  }

  const getAllReservation = async (date, position) => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/reservations?reserve_date=${date}&position=${position}&status=settlement&pending=pending`,
      )

      if (response.status === 200) {
        setReserves(response.data)

        const slots = response.data.map((reserve) => {
          // Find saving_times that match the date AND is_active = 'Active'
          const matchingSavingTime = reserve.saving_times?.find((saveTime) => {
            const savingDate =
              saveTime.date_saving?.split('T')[0] || saveTime.date_saving
            const isActive = saveTime.is_active?.trim() === 'Active'
            return savingDate === date && isActive
          })

          if (matchingSavingTime) {
            return {
              startTime: matchingSavingTime.start_time_saving,
              endTime: matchingSavingTime.end_time_saving,
            }
          } else {
            return {
              startTime: reserve.reserve_start_time,
              endTime: reserve.reserve_end_time,
            }
          }
        })
        setBookedSlots(slots)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.error(error)
    }
  }

  const {
    positions,
    isLoading: isLoadingPositions,
    error,
    fetchPositions,
  } = useFetchPositions()

  React.useEffect(() => {
    fetchPositions()
  }, [fetchPositions])

  const [customTimeSelected, setCustomTimeSelected] = React.useState([])

  const getTimeSelected = async (date) => {
    try {
      const response = await axios.get(`${baseUrl}/times?selected_date=${date}`)
      if (response.status == 200) {
        const jsonData = await response.data

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

  const [discountPrice, setDiscountPrice] = React.useState('')

  const handleCancle = async (alt) => {
    try {
      const response = await axios
        .delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/reservations/${idReservasi}`,
        )
        .then((response) => {
          setNamaReservasi('')
          setNoWhatsappReservasi('')
          setFloorSelected('')
          setSelectedDate('')
          setStartTimeReservasi('')
          setEndTimeReservasi('')
          setIdReservasi('')
          setPosisiReservasi(0)
          setNamaPosisiReservasi('')
          setSelectedPriceToday('')
          setContinueTapped(!continueTapped)
          setDiscountPrice('')
        })
        .catch((error) => {})
    } catch (error) {
      throw new Error(error)
    }
  }

  const handleCashPayment = () => {
    setOpen(true)
  }
  const router = useRouter()
  const handleCashPaymentConfirmation = async () => {
    try {
      const reserveData = {
        reserve_id: idReservasi,
        reserve_name: namaReservasi,
        location: namaPosisiReservasi,
        reserve_contact: nomorWhatsappReservasi.toString(),
        reserve_date: selectedDate,
        reserve_start_time: startTimeReservasi,
        reserve_end_time: endTimeReservasi,
        status_reserve: 'settlement',
        price:
          selectedCustomPrices != null
            ? totalTime * selectedCustomPrices
            : totalTime * parseInt(selectedPriceToday),
        position: posisiReservasi,
        is_membership:
          idMembership != '' || idMembership != null ? 'Active' : '',
        id_membership: idMembership,
      }

      const reserveResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reservations`,
        reserveData,
      )
      setOpen(false)
      router.push(
        `/payment/success/invoice?order_id=${idReservasi}&status_code=200&transaction_status=settlement&cash=true`,
      )
      Toast.fire({
        icon: 'success',
        title: `Pembayaran Berhasil Dilakukan!`,
      })
      clearForm()
    } catch (error) {
      console.error(error)
      setOpen(false)
      Toast.fire({
        icon: 'error',
        title: `Pembayaran Gagal Dilakukan Karena Terdapat Kesalahan Sistem!`,
      })
    }
  }

  const clearForm = () => {
    setContinueTapped(false)
    setNamaReservasi('')
    setNoWhatsappReservasi('')
    setSelectedDate('')
    setStartTimeReservasi('')
    setEndTimeReservasi('')
    setPosisiReservasi(null)
    setNamaPosisiReservasi('')
    setPricePerReserve(null)
    setTotalTime(0)
    setDiscountPrice('')
    setIdReservasi('')
  }

  const fetchingAvailableReservation = async (date, position) => {
    getAllReservation(date, position)
  }

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

    getPriceByDate(facilityPriceMap[facilityId] || [], selectedDate)
    return facilityPriceMap[facilityId] || []
  }

  const getPriceByDate = (data, selectedDate) => {
    const found = data.find((item) => item.date === selectedDate)
    setSelectedCustomPrices(found ? found.price : null)
    return found ? found.price : null
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

    const foundItem = times.filter((item) =>
      item['time-day'].split(',').includes(today),
    )

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

    const foundPrice = prices.filter((item) =>
      item['day'].split(',').includes(today),
    )

    foundPrice.length === 1
      ? setSelectedPriceToday(foundPrice[0]['price'])
      : setSelectedPriceToday(foundPrice[0]['price'])

    return foundPrice.length === 1
      ? foundPrice[0]['price']
      : foundPrice[0]['price']
  }

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

    const foundItem = times.filter((item) =>
      item['time-day'].split(',').includes(today),
    )

    return foundItem.length === 1 ? foundItem[0]['time-set'] : null
  }

  useEffect(() => {
    fetchDataTimes()
    fetchDataPrices()

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
    setTotalTime(getTimeDIfferent)

    getDateClosed()

    document.body.appendChild(script)

    const image = imageRef.current
    let isDragging = false
    let prevPosition = { x: 0, y: 0 }
    const handleMouseDown = (e) => {
      isDragging = false
      prevPosition = getEventPosition(e)
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

    const intervalTime = 500
    const interval = setInterval(() => {
      getAllReservationWithoutState
    }, intervalTime)

    return () => {
      document.body.removeChild(script)
      clearInterval(interval)
    }
  }, [startTimeReservasi, endTimeReservasi, imageRef, scale])

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

  const [
    selectedReservationPlace,
    setSelectedReservationPlace,
  ] = React.useState(null)

  const timeSet = getTimeSetForTodayAgain(
    selectedReservationPlace,
    selectedDate,
  )

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

  const fallbackPrice = parseInt(selectedPriceToday)
  const actualPrice = fallbackPrice

  const finalPrice = pricePackageDetermination(
    posisiReservasi,
    totalTime,
    actualPrice,
  )

  const safePrice = isNaN(finalPrice) ? 0 : finalPrice + 4000

  // USER OPTIONS
  const [userType, setUserType] = React.useState('guest')

  // MEMBERS
  const [idMembership, setIdMembership] = React.useState('')
  const [members, setMembers] = React.useState([])
  const getAllMembers = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/customers`,
      )
      setMembers(response.data.data)
    } catch (error) {
      const message =
        error.code === 'ERR_NETWORK'
          ? 'Data tidak dapat ditampilkan. Cek jaringan Anda!'
          : 'Server error, coba lagi nanti!'
      Toast.fire({ icon: 'error', title: message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectMember = (member) => {
    setNamaReservasi(member.full_name)
    setNoWhatsappReservasi(member.phone_number)
    setIdMembership(member.id)
  }

  React.useEffect(() => {
    getAllMembers()
  }, [])

  return (
    <>
      {regularSpaceData == null ||
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
        <section className="bg-white w-full h-full font-jakarta px-5 py-5">
          <div className=" w-fit py-5 text-black bg-white rounded-lg  flex flex-row gap-3 items-center">
            <Fade>
              <Image
                src={!continueTapped ? '/reserve.png' : '/checkout.png'}
                width={0}
                height={0}
                alt={'Reservation'}
                className="w-20"
              />
            </Fade>

            <Fade>
              <div className="flex flex-col">
                <h1 className="text-4xl font-semibold">
                  {!continueTapped ? 'Reservation' : 'Payment'}
                </h1>
                <p className="text-base font-normal text-gray-400">
                  {!continueTapped
                    ? 'Lakukan reservasi sebelum bermain'
                    : 'Lakukan pembayaran segera untuk reservasi'}
                </p>
              </div>
            </Fade>
          </div>

          {!continueTapped ? (
            <div className="flex flex-col gap-3 px-5 bg-white shadow-md rounded-lg mt-5 py-7">
              <UserOptions selected={userType} onChange={setUserType} />
              {userType == 'membership' && (
                <MemberSelector
                  members={members}
                  onSelect={handleSelectMember}
                  selectedId={idMembership}
                />
              )}

              {(userType == 'guest' ||
                (userType == 'membership' && idMembership != '')) && (
                <>
                  <Fade>
                    <div className="flex flex-col gap-2">
                      <label className="text-black" htmlFor="nama">
                        Nama
                      </label>
                      <input
                        type="text"
                        value={namaReservasi}
                        onChange={(e) => setNamaReservasi(e.target.value)}
                        name="nama"
                        id="nama"
                        placeholder="Masukkan namamu"
                        className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg px-3 py-2 active:border-orange focus:border-orange outline-none focus:outline-orange   "
                        required
                      />
                    </div>
                  </Fade>

                  <Fade delay={5} duration={1100}>
                    <div className="flex flex-col gap-2">
                      <label className="text-black" htmlFor="nama">
                        No Whatsapp
                      </label>
                      <input
                        type="text"
                        name="nomor_whatsapp"
                        id="nomor_whatsapp"
                        placeholder="Masukkan nomor Whatsapp"
                        className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg px-3 py-2 active:border-orange focus:border-orange outline-none focus:outline-orange "
                        value={nomorWhatsappReservasi}
                        onChange={(e) => setNoWhatsappReservasi(e.target.value)}
                        required
                      />
                    </div>
                  </Fade>

                  <Fade delay={6} duration={1200}>
                    <div className="flex flex-col gap-2">
                      <label className="text-black" htmlFor="nama">
                        Tanggal Reservasi
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <input
                            type="text"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            name="tanggal_reservasi"
                            id="tanggal_reservasi"
                            placeholder="Pilih tanggal reservasi"
                            className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg px-3 py-2 active:border-orange focus:border-orange outline-none focus:outline-orange  w-full "
                            min={currentDate}
                            max={maxDate}
                            required
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
                            disabled={(date) => {
                              const today = startOfDay(new Date())
                              const maxDate = addDays(today, 14)
                              const checkDate = startOfDay(date)

                              const isInClosedRange = dateClose.some(
                                ({ start_date, end_date }) => {
                                  const startDate = startOfDay(
                                    new Date(start_date),
                                  )
                                  const endDate = startOfDay(new Date(end_date))
                                  return (
                                    checkDate >= startDate &&
                                    checkDate <= endDate
                                  )
                                },
                              )

                              return (
                                checkDate > maxDate ||
                                checkDate < today || // ← Ganti minDate dengan today
                                isInClosedRange
                              )
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </Fade>

                  <Fade delay={7} duration={1300}>
                    <div className="flex flex-col gap-2">
                      <label className="text-black" htmlFor="nama">
                        Tempat Reservasi
                      </label>
                      <Select
                        value={selectedReservationPlace}
                        onValueChange={(value) => {
                          setSelectedReservationPlace(value)
                          getTimeSetForToday(value)
                        }}
                        required
                        className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-800 rounded-lg !px-3 !py-4 "
                      >
                        <SelectTrigger className="py-5 px-3 text-base text-black">
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
                        <SelectContent>
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
                                  className={`flex flex-row justify-around w-full top-24 absolute z-50 gap-[${
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
                                        onClose={(e) =>
                                          setDrawerContent('default')
                                        }
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
                                                setPricePerReserve(
                                                  positions[6].price,
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
                                                setPricePerReserve(
                                                  positions[0].price,
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
                                              IDR{' '}
                                              {number <= 4
                                                ? positions[6].price
                                                : positions[0].price}
                                              /hour and can only accomodate{' '}
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
                                                    : facilityId ===
                                                      'ps4-reguler'
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
                                                    : facilityId ===
                                                      'ps4-reguler'
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

                                                return priceDataCustom.length >
                                                  0
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
                                          </div>

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
                                                      {reserves.map(
                                                        (reserve, index) => {
                                                          // Find saving_times that match the date AND is_active = 'Active'
                                                          const matchingSavingTime = reserve.saving_times?.find(
                                                            (saveTime) => {
                                                              const savingDate =
                                                                saveTime.date_saving?.split(
                                                                  'T',
                                                                )[0] ||
                                                                saveTime.date_saving
                                                              const isActive =
                                                                saveTime.is_active?.trim() ===
                                                                'Active'
                                                              return (
                                                                savingDate ===
                                                                  selectedDate &&
                                                                isActive
                                                              )
                                                            },
                                                          )

                                                          const startTime = matchingSavingTime
                                                            ? matchingSavingTime.start_time_saving
                                                            : reserve.reserve_start_time

                                                          const endTime = matchingSavingTime
                                                            ? matchingSavingTime.end_time_saving
                                                            : reserve.reserve_end_time

                                                          return (
                                                            <div
                                                              key={index}
                                                              className={`text-xs px-2 py-1 border ${
                                                                reserve.status_reserve ===
                                                                'pending'
                                                                  ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                                  : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                              } rounded-md w-fit`}
                                                            >
                                                              {startTime} -{' '}
                                                              {endTime} WIB
                                                            </div>
                                                          )
                                                        },
                                                      )}
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
                                                      timeArray.length != 0 ? (
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

                                          <div className="flex flex-col gap-2 px-5 mt-3">
                                            <DrawerClose asChild>
                                              <Button
                                                variant="outline"
                                                className={`bg-orange text-white border-orange py-5`}
                                              >
                                                Continue
                                              </Button>
                                            </DrawerClose>
                                          </div>
                                        </DrawerContent>
                                      </Drawer>
                                    )
                                  })}
                                </div>

                                <div
                                  className={`flex flex-row justify-around w-72 bottom-10 absolute z-50 left-10  md:left-32`}
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
                                        onClose={(e) =>
                                          setDrawerContent('default')
                                        }
                                        key={number}
                                      >
                                        <DrawerTrigger asChild>
                                          <div
                                            key={number}
                                            className={`cursor-pointer md:w-28 md:h-28 w-8 h-8 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} rounded-lg py-2  ${
                                              number == 7 ? 'ml-10' : 'ml-0'
                                            } flex-col items-center justify-center flex`}
                                            onClick={() => {
                                              setPosisiReservasi(number)
                                              setNamaPosisiReservasi(
                                                positions[1].name,
                                              )
                                              setPricePerReserve(
                                                positions[1].price,
                                              )
                                              getPriceSetForToday(
                                                positions[1].name,
                                                selectedDate,
                                              )
                                              fetchingAvailableReservation(
                                                selectedDate,
                                                number,
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
                                              IDR {positions[1].price}/hour and
                                              can only accomodate{' '}
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
                                                    : facilityId ===
                                                      'ps4-reguler'
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
                                                    : facilityId ===
                                                      'ps4-reguler'
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

                                                return priceDataCustom.length >
                                                  0
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
                                          </div>

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
                                                      {reserves.map(
                                                        (reserve, index) => {
                                                          // Find saving_times that match the date AND is_active = 'Active'
                                                          const matchingSavingTime = reserve.saving_times?.find(
                                                            (saveTime) => {
                                                              const savingDate =
                                                                saveTime.date_saving?.split(
                                                                  'T',
                                                                )[0] ||
                                                                saveTime.date_saving
                                                              const isActive =
                                                                saveTime.is_active?.trim() ===
                                                                'Active'
                                                              return (
                                                                savingDate ===
                                                                  selectedDate &&
                                                                isActive
                                                              )
                                                            },
                                                          )

                                                          const startTime = matchingSavingTime
                                                            ? matchingSavingTime.start_time_saving
                                                            : reserve.reserve_start_time

                                                          const endTime = matchingSavingTime
                                                            ? matchingSavingTime.end_time_saving
                                                            : reserve.reserve_end_time

                                                          return (
                                                            <div
                                                              key={index}
                                                              className={`text-xs px-2 py-1 border ${
                                                                reserve.status_reserve ===
                                                                'pending'
                                                                  ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                                  : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                              } rounded-md w-fit`}
                                                            >
                                                              {startTime} -{' '}
                                                              {endTime} WIB
                                                            </div>
                                                          )
                                                        },
                                                      )}
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
                                                      timeArray.length != 0 ? (
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

                                          <div className="flex flex-col gap-2 px-5 mt-2">
                                            <DrawerClose asChild>
                                              <Button
                                                variant="outline"
                                                className={`bg-orange text-white border-orange py-5`}
                                              >
                                                Continue
                                              </Button>
                                            </DrawerClose>
                                          </div>
                                        </DrawerContent>
                                      </Drawer>
                                    )
                                  })}
                                </div>

                                <div
                                  className={`flex flex-row justify-around w-fit bottom-10 absolute z-50 left-40 -ml-2 gap-${
                                    8 + scale * 10
                                  } bottom-10  md:left-[53.5%] `}
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
                                        onClose={(e) =>
                                          setDrawerContent('default')
                                        }
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
                                              setPricePerReserve(
                                                positions[0].price,
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
                                              IDR {positions[0].price}/hour and
                                              can only accomodate{' '}
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
                                                    : facilityId ===
                                                      'ps4-reguler'
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
                                                    : facilityId ===
                                                      'ps4-reguler'
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

                                                return priceDataCustom.length >
                                                  0
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
                                          </div>

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
                                                      {reserves.map(
                                                        (reserve, index) => {
                                                          // Find saving_times that match the date AND is_active = 'Active'
                                                          const matchingSavingTime = reserve.saving_times?.find(
                                                            (saveTime) => {
                                                              const savingDate =
                                                                saveTime.date_saving?.split(
                                                                  'T',
                                                                )[0] ||
                                                                saveTime.date_saving
                                                              const isActive =
                                                                saveTime.is_active?.trim() ===
                                                                'Active'
                                                              return (
                                                                savingDate ===
                                                                  selectedDate &&
                                                                isActive
                                                              )
                                                            },
                                                          )

                                                          const startTime = matchingSavingTime
                                                            ? matchingSavingTime.start_time_saving
                                                            : reserve.reserve_start_time

                                                          const endTime = matchingSavingTime
                                                            ? matchingSavingTime.end_time_saving
                                                            : reserve.reserve_end_time

                                                          return (
                                                            <div
                                                              key={index}
                                                              className={`text-xs px-2 py-1 border ${
                                                                reserve.status_reserve ===
                                                                'pending'
                                                                  ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                                  : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                              } rounded-md w-fit`}
                                                            >
                                                              {startTime} -{' '}
                                                              {endTime} WIB
                                                            </div>
                                                          )
                                                        },
                                                      )}
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
                                                      timeArray.length != 0 ? (
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

                                          <div className="flex flex-col gap-2 px-5 mt-2">
                                            <DrawerClose asChild>
                                              <Button
                                                variant="outline"
                                                className={`bg-orange text-white border-orange py-5`}
                                              >
                                                Continue
                                              </Button>
                                            </DrawerClose>
                                          </div>
                                        </DrawerContent>
                                      </Drawer>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                          {selectedReservationPlace == 'premium-space' &&
                            selectedDate != '' && (
                              <div className="flex flex-col mb-6">
                                <div
                                  className={`flex flex-row w-[80%] gap-32 md:gap-44 absolute left-7 md:top-20  ml-20 md:ml-40 z-50 gap-[${
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
                                        onClose={(e) =>
                                          setDrawerContent('default')
                                        }
                                        key={number}
                                      >
                                        <DrawerTrigger asChild>
                                          <div
                                            key={number}
                                            className={`cursor-pointer md:w-32 md:h-32 w-10 h-10 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} rounded-lg py-2 flex-col items-center justify-center flex ${
                                              number == 10 && 'mr-16'
                                            }`}
                                            onClick={() => {
                                              setPosisiReservasi(number)
                                              setNamaPosisiReservasi(
                                                positions[3].name,
                                              )
                                              setPricePerReserve(
                                                positions[3].price,
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
                                              IDR {positions[3].price}/hour and
                                              can only accommodate{' '}
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
                                                    : facilityId ===
                                                      'ps4-reguler'
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
                                                    : facilityId ===
                                                      'ps4-reguler'
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

                                                return priceDataCustom.length >
                                                  0
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
                                                      {reserves.map(
                                                        (reserve, index) => {
                                                          // Find saving_times that match the date AND is_active = 'Active'
                                                          const matchingSavingTime = reserve.saving_times?.find(
                                                            (saveTime) => {
                                                              const savingDate =
                                                                saveTime.date_saving?.split(
                                                                  'T',
                                                                )[0] ||
                                                                saveTime.date_saving
                                                              const isActive =
                                                                saveTime.is_active?.trim() ===
                                                                'Active'
                                                              return (
                                                                savingDate ===
                                                                  selectedDate &&
                                                                isActive
                                                              )
                                                            },
                                                          )

                                                          const startTime = matchingSavingTime
                                                            ? matchingSavingTime.start_time_saving
                                                            : reserve.reserve_start_time

                                                          const endTime = matchingSavingTime
                                                            ? matchingSavingTime.end_time_saving
                                                            : reserve.reserve_end_time

                                                          return (
                                                            <div
                                                              key={index}
                                                              className={`text-xs px-2 py-1 border ${
                                                                reserve.status_reserve ===
                                                                'pending'
                                                                  ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                                  : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                              } rounded-md w-fit`}
                                                            >
                                                              {startTime} -{' '}
                                                              {endTime} WIB
                                                            </div>
                                                          )
                                                        },
                                                      )}
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
                                                      timeArray.length != 0 ? (
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
                                            <div className="flex flex-col gap-2 px-2 mt-2">
                                              <DrawerClose asChild>
                                                <Button
                                                  variant="outline"
                                                  className={`bg-orange text-white border-orange py-5`}
                                                >
                                                  Continue
                                                </Button>
                                              </DrawerClose>
                                            </div>
                                          </DrawerFooter>
                                        </DrawerContent>
                                      </Drawer>
                                    )
                                  })}
                                </div>
                                <div
                                  className={`flex flex-row w-auto bottom-32 gap-16 absolute left-[46%]   z-50 gap-[${
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
                                      <Drawer key={number}>
                                        <DrawerTrigger asChild>
                                          <div
                                            key={number}
                                            className={`cursor-pointer md:w-32 md:h-32 w-16 h-10 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} rounded-lg py-2 flex-col items-center justify-center flex`}
                                            onClick={() => {
                                              setPosisiReservasi(number)
                                              setNamaPosisiReservasi(
                                                positions[2].name,
                                              )
                                              setPricePerReserve(
                                                positions[2].price,
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
                                              IDR {positions[2].price}/hour and
                                              can only accomodate{' '}
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
                                                    : facilityId ===
                                                      'ps4-reguler'
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
                                                    : facilityId ===
                                                      'ps4-reguler'
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

                                                return priceDataCustom.length >
                                                  0
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
                                                      {reserves.map(
                                                        (reserve, index) => {
                                                          // Find saving_times that match the date AND is_active = 'Active'
                                                          const matchingSavingTime = reserve.saving_times?.find(
                                                            (saveTime) => {
                                                              const savingDate =
                                                                saveTime.date_saving?.split(
                                                                  'T',
                                                                )[0] ||
                                                                saveTime.date_saving
                                                              const isActive =
                                                                saveTime.is_active?.trim() ===
                                                                'Active'
                                                              return (
                                                                savingDate ===
                                                                  selectedDate &&
                                                                isActive
                                                              )
                                                            },
                                                          )

                                                          const startTime = matchingSavingTime
                                                            ? matchingSavingTime.start_time_saving
                                                            : reserve.reserve_start_time

                                                          const endTime = matchingSavingTime
                                                            ? matchingSavingTime.end_time_saving
                                                            : reserve.reserve_end_time

                                                          return (
                                                            <div
                                                              key={index}
                                                              className={`text-xs px-2 py-1 border ${
                                                                reserve.status_reserve ===
                                                                'pending'
                                                                  ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                                  : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                              } rounded-md w-fit`}
                                                            >
                                                              {startTime} -{' '}
                                                              {endTime} WIB
                                                            </div>
                                                          )
                                                        },
                                                      )}
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
                                                      timeArray.length != 0 ? (
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

                                          <div className="flex flex-col gap-2 px-5 my-2">
                                            <DrawerClose asChild>
                                              <Button
                                                variant="outline"
                                                className={`bg-orange text-white border-orange py-5`}
                                              >
                                                Continue
                                              </Button>
                                            </DrawerClose>
                                          </div>
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
                                  className={`flex flex-row w-full justify-between items-center absolute md:top-36  z-50 px-56`}
                                  ref={imageRef}
                                  style={{
                                    height: 'auto',
                                    transform: `translate(${position.x}px, ${position.y}px)`,
                                    cursor: 'move',
                                  }}
                                >
                                  {[18, 19].map((number) => {
                                    return (
                                      <Drawer key={number}>
                                        <DrawerTrigger asChild>
                                          <div
                                            key={number}
                                            className={`cursor-pointer md:w-28 md:h-28 w-20 h-10 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} rounded-lg py-2 flex-col items-center justify-center flex`}
                                            onClick={() => {
                                              setPosisiReservasi(number)
                                              setNamaPosisiReservasi(
                                                positions[4].name,
                                              )
                                              setPricePerReserve(
                                                positions[4].price,
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
                                              IDR {positions[4].price}/hour and
                                              can only accomodate{' '}
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
                                                    : facilityId ===
                                                      'ps4-reguler'
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
                                                    : facilityId ===
                                                      'ps4-reguler'
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

                                                return priceDataCustom.length >
                                                  0
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
                                                      {reserves.map(
                                                        (reserve, index) => {
                                                          // Find saving_times that match the date AND is_active = 'Active'
                                                          const matchingSavingTime = reserve.saving_times?.find(
                                                            (saveTime) => {
                                                              const savingDate =
                                                                saveTime.date_saving?.split(
                                                                  'T',
                                                                )[0] ||
                                                                saveTime.date_saving
                                                              const isActive =
                                                                saveTime.is_active?.trim() ===
                                                                'Active'
                                                              return (
                                                                savingDate ===
                                                                  selectedDate &&
                                                                isActive
                                                              )
                                                            },
                                                          )

                                                          const startTime = matchingSavingTime
                                                            ? matchingSavingTime.start_time_saving
                                                            : reserve.reserve_start_time

                                                          const endTime = matchingSavingTime
                                                            ? matchingSavingTime.end_time_saving
                                                            : reserve.reserve_end_time

                                                          return (
                                                            <div
                                                              key={index}
                                                              className={`text-xs px-2 py-1 border ${
                                                                reserve.status_reserve ===
                                                                'pending'
                                                                  ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                                  : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                              } rounded-md w-fit`}
                                                            >
                                                              {startTime} -{' '}
                                                              {endTime} WIB
                                                            </div>
                                                          )
                                                        },
                                                      )}
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
                                                      timeArray.length != 0 ? (
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

                                          <div className="flex flex-col gap-2 px-5 my-2">
                                            <DrawerClose asChild>
                                              <Button
                                                variant="outline"
                                                className={`bg-orange text-white border-orange py-5`}
                                              >
                                                Continue
                                              </Button>
                                            </DrawerClose>
                                          </div>
                                        </DrawerContent>
                                      </Drawer>
                                    )
                                  })}
                                </div>

                                <div
                                  className={`flex flex-row w-full bottom-52 gap-60  md:gap-80 absolute left-6  md:left-48 z-50 gap-[${
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
                                        onClose={(e) =>
                                          setDrawerContent('default')
                                        }
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
                                              setPricePerReserve(
                                                positions[5].price,
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
                                              IDR {positions[5].price}/hour and
                                              can only accommodate{' '}
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
                                                    : facilityId ===
                                                      'ps4-reguler'
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
                                                    : facilityId ===
                                                      'ps4-reguler'
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

                                                return priceDataCustom.length >
                                                  0
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
                                          </div>

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
                                                      {reserves.map(
                                                        (reserve, index) => {
                                                          // Find saving_times that match the date AND is_active = 'Active'
                                                          const matchingSavingTime = reserve.saving_times?.find(
                                                            (saveTime) => {
                                                              const savingDate =
                                                                saveTime.date_saving?.split(
                                                                  'T',
                                                                )[0] ||
                                                                saveTime.date_saving
                                                              const isActive =
                                                                saveTime.is_active?.trim() ===
                                                                'Active'
                                                              return (
                                                                savingDate ===
                                                                  selectedDate &&
                                                                isActive
                                                              )
                                                            },
                                                          )

                                                          const startTime = matchingSavingTime
                                                            ? matchingSavingTime.start_time_saving
                                                            : reserve.reserve_start_time

                                                          const endTime = matchingSavingTime
                                                            ? matchingSavingTime.end_time_saving
                                                            : reserve.reserve_end_time

                                                          return (
                                                            <div
                                                              key={index}
                                                              className={`text-xs px-2 py-1 border ${
                                                                reserve.status_reserve ===
                                                                'pending'
                                                                  ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                                  : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                              } rounded-md w-fit`}
                                                            >
                                                              {startTime} -{' '}
                                                              {endTime} WIB
                                                            </div>
                                                          )
                                                        },
                                                      )}
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
                                                      timeArray.length != 0 ? (
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
                                            <div className="flex flex-col gap-2 px-2 mt-2">
                                              <DrawerClose asChild>
                                                <Button
                                                  variant="outline"
                                                  className={`bg-orange text-white border-orange py-5`}
                                                >
                                                  Continue
                                                </Button>
                                              </DrawerClose>
                                            </div>
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

                  <ReservationLegend delay={5} duration={1000} />
                </>
              )}
            </div>
          ) : (
            <>
              <div
                className={`${
                  isSelectPay
                    ? ''
                    : 'flex flex-col gap-3 px-5 bg-white shadow-md rounded-lg mt-5 py-7'
                }`}
              >
                <div className={`${isSelectPay ? 'mt-5' : 'p-4'}`}>
                  {isLoading ? (
                    <div className="flex items-center justify-center w-full">
                      {' '}
                      <Loading />
                    </div>
                  ) : isSelectPay ? (
                    <div className="flex gap-2 -mb-2">
                      <div
                        onClick={(e) => setSelectedPay('cash')}
                        className={`${
                          selectedPay == 'cash' ? 'bg-gray-100' : 'bg-white'
                        } shadow-md px-5 py-9 cursor-pointer rounded-lg w-full flex flex-col gap-2 items-center justify-center hover:scale-95 duration-700`}
                      >
                        <Image
                          width={0}
                          height={0}
                          alt={'Payment'}
                          className={'w-[100px]'}
                          src={'/cash.png'}
                        />
                        <div className="flex flex-col items-center justify-center">
                          <h1 className="text-2xl font-semibold">{'Cash'}</h1>
                          <p className="text-sm font-normal text-gray-400">
                            Pay with cash if customer is in location
                          </p>
                        </div>
                      </div>
                      <div
                        onClick={(e) => setSelectedPay('non-cash')}
                        className={`${
                          selectedPay == 'non-cash' ? 'bg-gray-100' : 'bg-white'
                        } shadow-md px-5 py-9 cursor-pointer rounded-lg w-full flex flex-col gap-2 items-center justify-center hover:scale-95 duration-700`}
                      >
                        <Image
                          width={0}
                          height={0}
                          alt={'Payment'}
                          className={'w-[100px]'}
                          src={'/non-cash.png'}
                        />
                        <div className="flex flex-col items-center justify-center">
                          <h1 className="text-2xl font-semibold">
                            {'Non Cash'}
                          </h1>
                          <p className="text-sm font-normal text-gray-400">
                            {'Do payment easily with non-cash method available'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Fade>
                        <div className="space-y-1">
                          <h4 className="text-base font-jakarta font-medium leading-none text-black">
                            ID Reservasi
                          </h4>
                          <p className="text-base font-jakarta text-gray-600">
                            {idReservasi}
                          </p>
                        </div>
                      </Fade>
                      <Separator className="my-2" />
                      <Fade>
                        <div className="space-y-1">
                          <h4 className="text-base font-jakarta font-medium leading-none text-black">
                            Nama
                          </h4>
                          <p className="text-base font-jakarta text-gray-600">
                            {namaReservasi}
                          </p>
                        </div>
                      </Fade>
                      <Separator className="my-2" />
                      <Fade>
                        <div className="space-y-1">
                          <h4 className="text-base font-jakarta font-medium leading-none text-black">
                            No Whatsapp
                          </h4>
                          <p className="text-base font-jakarta text-gray-600">
                            {nomorWhatsappReservasi}
                          </p>
                        </div>
                      </Fade>
                      <Separator className="my-2" />
                      <Fade>
                        <div className="space-y-1">
                          <h4 className="text-base font-jakarta font-medium leading-none text-black">
                            Tanggal Reservasi
                          </h4>
                          <p className="text-base font-jakarta text-gray-600">
                            {formatDate(selectedDate)}
                          </p>
                        </div>
                      </Fade>
                      <Separator className="my-2" />
                      <Fade>
                        <div className="space-y-1">
                          <h4 className="text-base font-jakarta font-medium leading-none text-black">
                            Waktu Reservasi
                          </h4>
                          <p className="text-base font-jakarta text-gray-600">
                            {startTimeReservasi} - {endTimeReservasi} -{' '}
                            {totalTime} Hours
                          </p>
                        </div>
                      </Fade>
                      <Separator className="my-2" />
                      <Fade>
                        <div className="space-y-1">
                          <h4 className="text-base font-jakarta font-medium leading-none text-black">
                            Detail Tempat
                          </h4>
                          <p className="text-base font-jakarta text-gray-600">
                            in {namaPosisiReservasi}, Position {posisiReservasi}
                          </p>
                        </div>
                      </Fade>
                      <Separator className="my-2" />
                      <Fade>
                        <div className="space-y-1">
                          <h4 className="text-base font-jakarta font-medium leading-none text-black">
                            Harga Reservasi
                          </h4>
                          <p className="text-base font-jakarta text-gray-600">
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
                          <h4 className="text-base font-jakarta font-medium leading-none text-black">
                            Service Charge (Bila Non Cash)
                          </h4>
                          <p className="text-base font-jakarta text-gray-600">
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
              className="font-medium text-white bg-orange w-full px-5 py-6 rounded-lg hover:bg-orange text-base mt-5"
            >
              Continue
            </Button>
          ) : (
            <div className="flex flex-col gap-1 w-full mt-5">
              {selectedPay == 'non-cash' && (
                <Checkout
                  id={idReservasi}
                  idMembership={idMembership != '' ? idMembership : ''}
                  price={safePrice}
                  productName={`Reservation ${namaPosisiReservasi}`}
                  detailCustomer={{
                    name: namaReservasi,
                    no: nomorWhatsappReservasi,
                    reserve_date: selectedDate,
                    reserve_start_time: startTimeReservasi,
                    reserve_end_time: endTimeReservasi,
                    position: posisiReservasi,
                    location:
                      floorSelected == 'second-floor'
                        ? `${namaPosisiReservasi}`
                        : `${namaPosisiReservasi}`,
                  }}
                />
              )}
              {selectedPay == 'cash' && (
                <Button
                  type="button"
                  onClick={(e) => handleCashPayment()}
                  className="font-medium text-white bg-orange w-full px-5 py-6 rounded-lg hover:bg-orange text-base"
                >
                  Pay Cash
                </Button>
              )}
              {selectedPay != 'cash' && selectedPay != 'non-cash' && (
                <Button
                  type="button"
                  onClick={(e) => setIsSelectPay(true)}
                  className="font-medium text-white bg-orange w-full px-5 py-6 rounded-lg hover:bg-orange text-base mt-5"
                >
                  Continue
                </Button>
              )}
              <Button
                variant="outline"
                onClick={(e) => handleCancle()}
                className="rounded-lg px-5 py-6 text-base font-jakarta"
              >
                Cancel
              </Button>
            </div>
          )}

          <CashPaymentDialog
            open={open}
            setOpen={setOpen}
            selectedCustomPrices={selectedCustomPrices}
            totalTime={totalTime}
            selectedPriceToday={selectedPriceToday}
            namaPosisiReservasi={namaPosisiReservasi}
            posisiReservasi={posisiReservasi}
            discountPrice={discountPrice}
            setDiscountPrice={setDiscountPrice}
            handleCashPaymentConfirmation={handleCashPaymentConfirmation}
          />
        </section>
      )}
    </>
  )
}

const UserOptions = ({ selected, onChange }) => {
  return (
    <div className="w-fit py-5 text-black bg-white rounded-lg flex flex-row gap-3 items-center">
      <button
        onClick={() => onChange('guest')}
        className={`px-6 py-2 rounded-lg font-medium transition-all ${
          selected === 'guest'
            ? 'bg-orange text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Guest
      </button>
      <button
        onClick={() => onChange('membership')}
        className={`px-6 py-2 rounded-lg font-medium transition-all ${
          selected === 'membership'
            ? 'bg-orange text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Membership
      </button>
    </div>
  )
}
const MemberSelector = ({ members, onSelect, selectedId }) => {
  const [search, setSearch] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(!selectedId)

  const selectedMember = members.find((m) => m.id === selectedId)

  const filteredMembers = members.filter(
    (member) =>
      member.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      member.phone_number?.includes(search),
  )

  const handleSelect = (member) => {
    onSelect(member)
    setIsOpen(false)
    setSearch('')
  }

  const handleGanti = () => {
    onSelect({ id: '', full_name: '', phone_number: '' }) // Clear selection
    setIsOpen(true)
  }

  if (selectedMember && !isOpen) {
    return (
      <div className="w-full bg-gradient-to-br from-orange-50 to-orange-50 rounded-xl p-6 border-2 border-orange-200 shadow-sm">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              {selectedMember.full_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">
                {selectedMember.full_name}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {selectedMember.phone_number}
              </p>
              {selectedMember.username && (
                <p className="text-xs text-gray-500 mt-1">
                  @{selectedMember.username}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleGanti}
            className="px-4 py-2 bg-white text-orange rounded-lg font-medium hover:bg-orange/50 transition-all shadow-sm border border-orange-200"
          >
            Ganti
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Cari nama atau nomor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
          />
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto p-2">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-gray-500 font-medium">Tidak ada data</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => handleSelect(member)}
                className="group p-4 border-2 border-transparent rounded-xl cursor-pointer transition-all hover:border-orange hover:bg-orange-50 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange to-orange rounded-full flex items-center justify-center text-white font-semibold shadow-sm group-hover:scale-110 transition-transform">
                    {member.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 group-hover:text-orange transition-colors">
                      {member.full_name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {member.phone_number}
                    </p>
                    {member.username && (
                      <p className="text-xs text-gray-500 mt-1">
                        @{member.username}
                      </p>
                    )}
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-orange transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ReservationLegend({ delay = 7, duration = 1300 }) {
  const legends = [
    { color: 'green', label: 'selected' },
    { color: 'yellow', label: 'in hold' },
    { color: 'red', label: 'reserved' },
    { color: 'gray', label: 'available' },
  ]

  return (
    <Fade delay={delay} duration={duration}>
      <div className="flex flex-row gap-2 items-center justify-center mb-8">
        {legends.map((legend, index) => (
          <div key={index} className="flex gap-1 items-center">
            <div
              className={`w-4 h-4 border border-${legend.color}-500 bg-${legend.color}-500 bg-opacity-25 rounded-sm`}
            ></div>
            <p className="text-xs text-black">{legend.label}</p>
          </div>
        ))}
      </div>
    </Fade>
  )
}

function CashPaymentDialog({
  open,
  setOpen,
  selectedCustomPrices,
  totalTime,
  selectedPriceToday,
  namaPosisiReservasi,
  posisiReservasi,
  discountPrice,
  setDiscountPrice,
  handleCashPaymentConfirmation,
}) {
  const totalPrice =
    selectedCustomPrices != null
      ? totalTime * selectedCustomPrices
      : totalTime * parseInt(selectedPriceToday)

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex gap-2 items-center border-b border-b-slate-300 pb-3">
            <BiMoney className="w-10 text-3xl" />
            <div className="flex flex-col gap-1">
              <DialogTitle>Cash Payment Reservation</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        <div className="py-2 text-gray-600">
          Pastikan customer telah membayar kepada kasir dengan nominal sebesar{' '}
          <span className="font-bold text-orange text-lg">
            IDR {totalPrice}
          </span>{' '}
          untuk waktu permainan{' '}
          <span className="font-semibold">
            {totalTime} jam di {namaPosisiReservasi} posisi {posisiReservasi}
          </span>
        </div>
        <input
          type="text"
          value={discountPrice}
          onChange={(e) => setDiscountPrice(e.target.value)}
          placeholder="Masukkan Harga Setelah Discount"
          className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg px-3 py-2 active:border-orange focus:border-orange outline-none focus:outline-orange"
        />
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleCashPaymentConfirmation}
            className="bg-orange hover:bg-orange"
          >
            Pay
          </Button>
        </DialogFooter>
        <DialogClose
          onClick={() => setOpen(!open)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <Cross2Icon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
