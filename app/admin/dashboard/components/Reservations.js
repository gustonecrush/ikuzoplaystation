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
  formatDate,
  generateTimeArray,
  generateTimeArrayWithStep,
  getCurrentDate,
  getCurrentTime,
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
import { addDays, subDays } from 'date-fns'
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
import { redirect, useRouter } from 'next/navigation'
import Toast from '@/app/components/Toast'
import { pricePackageDetermination } from '@/utils/price'

export default function Reservation() {
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
  const [currentTime, setCurrentTime] = React.useState(getCurrentTime)
  const [maxTime, setMaxTime] = React.useState(getMaxTime)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSelectPay, setIsSelectPay] = React.useState(false)
  const [selectedPay, setSelectedPay] = React.useState('')
  const [pricePerReserve, setPricePerReserve] = React.useState(0)

  const [reserves, setReserves] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])
  const [reservesPosition, setReservesPosition] = useState([])
  const timeArray = generateTimeArrayWithStep(startTimeReservasi, bookedSlots)

  const [open, setOpen] = React.useState(false)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const getAllReservationsPositon = async (date) => {
    try {
      const response = await axios.get(
        `${baseUrl}/reservations?reserve_date=${date}`,
      )
      console.log(`${baseUrl}/reservations?reserve_date=${date}`)
      if (response.status == 200) {
        const jsonData = await response.data

        setReservesPosition(jsonData)
        console.log(response.data)

        setIsLoading(false)
      } else {
        setIsLoading(false)
        console.log({ response })
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      console.log(error)

      setIsLoading(false)
    }
  }

  const getAllReservation = async (date, position) => {
    try {
      const response = await axios.get(
        `${baseUrl}/reservations?reserve_date=${date}&position=${position}&status=settlement&pending=pending`,
      )
      console.log(`${baseUrl}/reservations?reserve_date=${date}`)
      if (response.status == 200) {
        const jsonData = await response.data

        setReserves(jsonData)
        const slots = jsonData.map((reserve) => ({
          startTime: reserve.reserve_start_time,
          endTime: reserve.reserve_end_time,
        }))
        setBookedSlots(slots)
        console.log(response.data)

        setIsLoading(false)
      } else {
        setIsLoading(false)
        console.log({ response })
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      console.log(error)

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
        console.log(response.data)

        setIsLoading(false)
      } else {
        setIsLoading(false)
        console.log({ response })
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  const [customTimeSelected, setCustomTimeSelected] = React.useState(null)

  const getTimeSelected = async (date) => {
    try {
      const response = await axios.get(`${baseUrl}/times?selected_date=${date}`)
      console.log(`${baseUrl}/times?selected_date=${date}`)
      if (response.status == 200) {
        const jsonData = await response.data

        if (jsonData.data.length > 0) {
          setCustomTimeSelected(jsonData.data[0])
        } else {
          setCustomTimeSelected(null)
        }

        console.log({ customTimeSelected })
      } else {
        console.log({ response })
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  console.log({ bookedSlots })

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

    console.log({ data })
    // Assuming you have some state variables for your input values
    if (
      namaReservasi &&
      nomorWhatsappReservasi &&
      floorSelected &&
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
          setContinueTapped(!continueTapped)
          setDiscountPrice('')
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
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
          discountPrice != ''
            ? discountPrice
            : (totalTime * pricePerReserve).toString(),
        position: posisiReservasi,
      }

      const reserveResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reservations`,
        reserveData,
      )
      console.log(reserveResponse.data)
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
    console.log('fetching')
    getAllReservation(date, position)
    console.log('fetching', reserves)
  }

  useEffect(() => {
    const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js'
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

    const handleMouseUp = () => {
      isDragging = false
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
          console.log(response.data)

          setIsLoading(false)
        } else {
          setIsLoading(false)
          console.log({ response })
          throw new Error('Failed to fetch data')
        }
      } catch (error) {
        console.log(error)

        setIsLoading(false)
      }
    }

    getAllPositions()

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

  return (
    <>
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
          <>
            <div className="flex flex-col gap-3 px-5 bg-white shadow-md rounded-lg mt-5 py-7">
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

              {/* Tanggal Reservasi */}
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
                          const nextDay = addDays(date, 1)
                          setSelectedDate(nextDay.toISOString().split('T')[0])
                          getAllReservationsPositon(
                            nextDay.toISOString().split('T')[0],
                          )
                          getTimeSelected(nextDay.toISOString().split('T')[0])
                        }}
                        disabled={(date) =>
                          date > new addDays(new Date(), 15) ||
                          date < subDays(new Date(), 1)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </Fade>

              {/* Lantai Reservasi */}
              <Fade delay={7} duration={1300}>
                <div className="flex flex-col gap-2">
                  <label className="text-black" htmlFor="nama">
                    Lantai Reservasi
                  </label>
                  <Select
                    value={floorSelected}
                    onValueChange={(value) => setFloorSelected(value)}
                    required
                    className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                  >
                    <SelectTrigger className="py-5 px-3 text-base text-black">
                      <SelectValue
                        className="text-base text-black placeholder:text-black"
                        placeholder="Pilih Lantai"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="">
                        <SelectLabel className="text-base">
                          Pilih Lantai Reservasi
                        </SelectLabel>
                        <SelectItem className="text-base" value="first-floor">
                          1st Floor
                        </SelectItem>
                        <SelectItem className="text-base" value="second-floor">
                          2nd Floor
                        </SelectItem>
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
                      src={`/${
                        floorSelected == 'first-floor'
                          ? 'first-floor.jpg'
                          : 'second-floor.jpg'
                      }`}
                      alt=""
                      style={{
                        width: '100%',
                        height: 'auto',
                        transform: `scale(1.4) translate(${position.x}px, ${position.y}px)`,
                        cursor: 'move',
                      }}
                    />

                    <div className="">
                      {floorSelected == 'first-floor' && selectedDate != '' && (
                        <div className={`flex flex-col  mb-6   w-full`}>
                          <div
                            className={`flex flex-row justify-around w-full top-16 absolute z-50 gap-[${
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
                                <Drawer key={number}>
                                  <DrawerTrigger asChild>
                                    <div
                                      key={number}
                                      className={`cursor-pointer w-28 h-28 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} text-white rounded-lg py-2 flex-col items-center justify-center flex`}
                                      onClick={() => {
                                        setPosisiReservasi(number)
                                        setNamaPosisiReservasi(
                                          positions[0].name,
                                        )

                                        setPricePerReserve(positions[0].price)
                                        fetchingAvailableReservation(
                                          selectedDate,
                                          number,
                                        )
                                      }}
                                      style={{
                                        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                      }}
                                    >
                                      <p className="opacity-100 text-lg py-2 text-white ">
                                        Reg
                                      </p>{' '}
                                    </div>
                                  </DrawerTrigger>
                                  <DrawerContent className="active:border-none border-none outline-none max-w-3xl mx-auto">
                                    <DrawerHeader className="text-left">
                                      <DrawerTitle>
                                        {positions[0].name}
                                      </DrawerTitle>
                                      <DrawerDescription>
                                        IDR {positions[0].price}/hour and can
                                        only accomodate {positions[0].capacity}{' '}
                                        person (position {number}).
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
                                                        key={index}
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
                                                  generateTimeArrayWithStep(
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
                                                      pilih waktu bermain <br />
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
                                      <DrawerClose asChild>
                                        <Button
                                          variant="outline"
                                          className={`bg-orange text-white border-orange py-5`}
                                        >
                                          Continue
                                        </Button>
                                      </DrawerClose>
                                    </DrawerFooter>
                                  </DrawerContent>
                                </Drawer>
                              )
                            })}
                          </div>

                          <div
                            className={`flex flex-row justify-around w-64 bottom-12 absolute z-50 left-24 gap-[${
                              10 + scale * 10
                            }] `}
                            ref={imageRef}
                            style={{
                              height: 'auto',
                              transform: `translate(${position.x}px, ${position.y}px)`,
                              cursor: 'move',
                            }}
                          >
                            {[6, 7].map((number) => {
                              return (
                                <Drawer key={number}>
                                  <DrawerTrigger asChild>
                                    <div
                                      key={number}
                                      className={`cursor-pointer w-28 h-28 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} text-white rounded-lg py-2 flex-col items-center justify-center flex`}
                                      onClick={() => {
                                        setPosisiReservasi(number)
                                        setNamaPosisiReservasi(
                                          positions[1].name,
                                        )
                                        setPricePerReserve(positions[1].price)
                                        fetchingAvailableReservation(
                                          selectedDate,
                                          number,
                                        )
                                      }}
                                      style={{
                                        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                      }}
                                    >
                                      <p className="opacity-100 py-2 text-lg text-white">
                                        Sim
                                      </p>{' '}
                                    </div>
                                  </DrawerTrigger>
                                  <DrawerContent className="active:border-none border-none outline-none max-w-3xl mx-auto">
                                    <DrawerHeader className="text-left">
                                      <DrawerTitle>
                                        {positions[1].name}
                                      </DrawerTitle>
                                      <DrawerDescription>
                                        IDR {positions[1].price}/hour and can
                                        only accomodate {positions[1].capacity}{' '}
                                        person (position {number}).
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
                                                  generateTimeArrayWithStep(
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
                                                      pilih waktu bermain <br />
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
                                      <DrawerClose asChild>
                                        <Button
                                          variant="outline"
                                          className={`bg-orange text-white border-orange py-5`}
                                        >
                                          Continue
                                        </Button>
                                      </DrawerClose>
                                    </DrawerFooter>
                                  </DrawerContent>
                                </Drawer>
                              )
                            })}
                          </div>

                          <div
                            className={`flex flex-row justify-around w-fit bottom-12 absolute z-50 left-[53%] -ml-2 gap-${
                              8 + scale * 10
                            } `}
                            ref={imageRef}
                            style={{
                              height: 'auto',
                              transform: `translate(${position.x}px, ${position.y}px)`,
                              cursor: 'move',
                            }}
                          >
                            {[8].map((number) => {
                              return (
                                <Drawer key={number}>
                                  <DrawerTrigger asChild>
                                    <div
                                      key={number}
                                      className={`cursor-pointer w-28  h-28 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} rounded-lg flex-col items-center justify-center flex`}
                                      onClick={() => {
                                        setPosisiReservasi(number)
                                        setNamaPosisiReservasi(
                                          positions[0].name,
                                        )
                                        setPricePerReserve(positions[0].price)
                                        fetchingAvailableReservation(
                                          selectedDate,
                                          number,
                                        )
                                      }}
                                      style={{
                                        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                      }}
                                    >
                                      <p className="opacity-100 text-lg py-2 text-white ">
                                        Reg
                                      </p>{' '}
                                    </div>
                                  </DrawerTrigger>
                                  <DrawerContent className="active:border-none border-none outline-none max-w-3xl mx-auto">
                                    <DrawerHeader className="text-left">
                                      <DrawerTitle>
                                        {positions[0].name}
                                      </DrawerTitle>
                                      <DrawerDescription>
                                        IDR {positions[0].price}/hour and can
                                        only accomodate {positions[0].capacity}{' '}
                                        person (position {number}).
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
                                                  generateTimeArrayWithStep(
                                                    startTimeReservasi,
                                                    bookedSlots,
                                                  ).map((time, index) => {
                                                    return (
                                                      <SelectItem
                                                        key={index}
                                                        value={time}
                                                        className={'text-sm'}
                                                      >
                                                        {time}
                                                      </SelectItem>
                                                    )
                                                  })
                                                ) : (
                                                  <SelectItem value={'00.00'}>
                                                    <p className="text-gray-500">
                                                      {' '}
                                                      Waktu yang kamu pilih{' '}
                                                      <br />
                                                      sudah terisi. Silakan{' '}
                                                      <br />
                                                      pilih waktu bermain <br />
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
                                      <DrawerClose asChild>
                                        <Button
                                          variant="outline"
                                          className={`bg-orange text-white border-orange py-5`}
                                        >
                                          Continue
                                        </Button>
                                      </DrawerClose>
                                    </DrawerFooter>
                                  </DrawerContent>
                                </Drawer>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {floorSelected == 'second-floor' && selectedDate != '' && (
                        <div className="flex flex-col mb-6">
                          <div
                            className={`flex flex-row w-auto top-48 absolute left-[36%] z-50 gap-[${
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
                                      className={`cursor-pointer w-28 h-28 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} rounded-lg py-2 flex-col items-center justify-center flex`}
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
                                      <p className="opacity-100 text-lg py-2 text-white ">
                                        {number == '9'
                                          ? 'VIP'
                                          : number == 12
                                          ? 'PS 2'
                                          : 'Reg+'}
                                      </p>{' '}
                                    </div>
                                  </DrawerTrigger>
                                  <DrawerContent className="active:border-none border-none outline-none max-w-3xl mx-auto">
                                    <DrawerHeader className="text-left">
                                      <DrawerTitle>
                                        {positions[4].name}
                                      </DrawerTitle>
                                      <DrawerDescription>
                                        IDR {positions[4].price}/hour and can
                                        only accomodate {positions[4].capacity}{' '}
                                        person (position {number}).
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
                                                  generateTimeArrayWithStep(
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
                                                      pilih waktu bermain <br />
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
                                      <DrawerClose asChild>
                                        <Button
                                          variant="outline"
                                          className={`bg-orange text-white border-orange py-5`}
                                        >
                                          Continue
                                        </Button>
                                      </DrawerClose>
                                    </DrawerFooter>
                                  </DrawerContent>
                                </Drawer>
                              )
                            })}
                          </div>

                          <div
                            className={`flex flex-row w-full justify-end top-64 absolute right-40 z-50 gap-[${
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
                                <Drawer key={number}>
                                  <DrawerTrigger asChild>
                                    <div
                                      key={number}
                                      className={`cursor-pointer w-28 h-28 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} rounded-lg py-2 flex-col items-center justify-center flex ${
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
                                      <p className="opacity-100 text-lg py-2 text-white ">
                                        {number == '9'
                                          ? 'VIP'
                                          : number == 12
                                          ? 'PS 2'
                                          : 'Reg+'}
                                      </p>{' '}
                                    </div>
                                  </DrawerTrigger>
                                  <DrawerContent className="active:border-none border-none outline-none max-w-3xl mx-auto">
                                    <DrawerHeader className="text-left">
                                      <DrawerTitle>
                                        {positions[2].name}
                                      </DrawerTitle>
                                      <DrawerDescription>
                                        IDR {positions[2].price}/hour and can
                                        only accomodate {positions[2].capacity}{' '}
                                        person (position {number}).
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
                                                  generateTimeArrayWithStep(
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
                                                      pilih waktu bermain <br />
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
                                      <DrawerClose asChild>
                                        <Button
                                          variant="outline"
                                          className={`bg-orange text-white border-orange py-5`}
                                        >
                                          Continue
                                        </Button>
                                      </DrawerClose>
                                    </DrawerFooter>
                                  </DrawerContent>
                                </Drawer>
                              )
                            })}
                          </div>

                          <div
                            className={`flex flex-row justify-around bottom-20 absolute left-10 z-50 gap-${
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
                              const reserveExists =
                                reservesPosition.length > 0 &&
                                reservesPosition.some(
                                  (reserve) =>
                                    parseInt(reserve.position) === number &&
                                    reserve.status_reserve === 'settlement',
                                )

                              const inHold =
                                reservesPosition.length > 0 &&
                                reservesPosition.some(
                                  (reserve) =>
                                    parseInt(reserve.position) === number &&
                                    reserve.status_reserve === 'pending',
                                )
                              return (
                                <Drawer key={number}>
                                  <DrawerTrigger asChild>
                                    <div
                                      key={number}
                                      className={`cursor-pointer w-28 h-28 ml-1 border ${'border-gray-400 bg-gray-900 bg-opacity-20'} rounded-lg py-2 flex-col items-center justify-center flex`}
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
                                      <p className="opacity-100 text-lg py-2 text-white ">
                                        PS 2
                                      </p>{' '}
                                    </div>
                                  </DrawerTrigger>
                                  <DrawerContent className="active:border-none border-none outline-none max-w-3xl mx-auto">
                                    <DrawerHeader className="text-left">
                                      <DrawerTitle>
                                        {positions[3].name}
                                      </DrawerTitle>
                                      <DrawerDescription>
                                        IDR {positions[3].price}/hour and can
                                        only accomodate {positions[3].capacity}{' '}
                                        person (position {number}).
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
                                                  generateTimeArrayWithStep(
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
                                                      pilih waktu bermain <br />
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
                                      <DrawerClose asChild>
                                        <Button
                                          variant="outline"
                                          className={`bg-orange text-white border-orange py-5`}
                                        >
                                          Continue
                                        </Button>
                                      </DrawerClose>
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
                    <p className="text-xs text-black">selected</p>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="w-4 h-4 border border-yellow-500 bg-yellow-500 bg-opacity-25 rounded-sm"></div>
                    <p className="text-xs text-black">in hold</p>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="w-4 h-4 border border-red-500 bg-red-500 bg-opacity-25 rounded-sm"></div>
                    <p className="text-xs text-black">reserved</p>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="w-4 h-4 border border-gray-500 bg-gray-500 bg-opacity-25 rounded-sm"></div>
                    <p className="text-xs text-black">available</p>
                  </div>
                </div>
              </Fade>
            </div>
          </>
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
                        <h1 className="text-2xl font-semibold">{'Non Cash'}</h1>
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
                            pricePerReserve,
                          )}
                        </p>
                      </div>
                    </Fade>
                    <Separator className="my-2" />

                    <Fade>
                      <div className="space-y-1">
                        <h4 className="text-base font-jakarta font-medium leading-none text-black">
                          Pajak (Bila Non Cash)
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
                price={
                  pricePackageDetermination(
                    posisiReservasi,
                    totalTime,
                    pricePerReserve,
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
              Pastikan customer telah membayar kepada kasir dengan nominal
              sebesar{' '}
              <span className="font-bold text-orange text-lg">{`IDR ${
                totalTime * pricePerReserve
              }`}</span>{' '}
              untuk waktu{' '}
              <span className=" font-semibold">
                permainan {`${totalTime}`} jam di{' '}
                {`${namaPosisiReservasi} posisi ${posisiReservasi}`}
              </span>
            </div>
            <input
              type="text"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              name="nama"
              id="nama"
              placeholder="Masukkan Harga Setelah Discount"
              className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg px-3 py-2 active:border-orange focus:border-orange outline-none focus:outline-orange   "
            />
            <DialogFooter>
              <Button
                type="submit"
                onClick={() => handleCashPaymentConfirmation()}
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
      </section>
    </>
  )
}
