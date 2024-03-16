'use client'

import Image from 'next/image'
import Checkout from '../components/Checkout'
import React, { useEffect, useRef, useState } from 'react'

// REVEAL
import { Fade } from 'react-awesome-reveal'

// UI COMPONENTS
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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
import Loading from '../loading'

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
  const [pricePerReserve, setPricePerReserve] = React.useState(0)

  const [reserves, setReserves] = useState([])
  const [reservesPosition, setReservesPosition] = useState([])

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
        `${baseUrl}/reservations?reserve_date=${date}&position=${position}`,
      )
      console.log(`${baseUrl}/reservations?reserve_date=${date}`)
      if (response.status == 200) {
        const jsonData = await response.data

        setReserves(jsonData)
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

  /***********************************************************
   * functions & states for scaling image
   ***********************************************************/
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef(null)

  const [posisiReservasi, setPosisiReservasi] = useState(0)

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
      posisiReservasi
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
          setFloorSelected('')
          setSelectedDate('')
          setStartTimeReservasi('')
          setEndTimeReservasi('')
          setIdReservasi('')
          setPosisiReservasi(0)
          setContinueTapped(!continueTapped)
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
    } catch (error) {
      throw new Error(error)
    }
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
      isDragging = true
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

    image?.addEventListener('mousedown', handleMouseDown)
    image?.addEventListener('touchstart', handleMouseDown)
    image?.addEventListener('mousemove', handleMouseMove)
    image?.addEventListener('touchmove', handleMouseMove)
    image?.addEventListener('mouseup', handleMouseUp)
    image?.addEventListener('touchend', handleMouseUp)

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

    const intervalTime = 500
    const interval = setInterval(() => {
      getAllReservationWithoutState
      // const availableTimeSlots = generateTimeSlots(selectedDate, bookedSlots);
      // setAvailableTimes(availableTimeSlots)
    }, intervalTime)

    return () => {
      image?.removeEventListener('mousedown', handleMouseDown)
      image?.removeEventListener('touchstart', handleMouseDown)
      image?.removeEventListener('mousemove', handleMouseMove)
      image?.removeEventListener('touchmove', handleMouseMove)
      image?.removeEventListener('mouseup', handleMouseUp)
      image?.removeEventListener('touchend', handleMouseUp)
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
      <section className="bg-transparent w-full h-full font-jakarta px-5 py-5 absolute z-50">
        <div className="flex items-center justify-between">
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
        </div>

        <div className="px-5 py-5 text-black bg-gray-700 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 border-opacity-25 shadow-md rounded-lg flex flex-row gap-3 items-center">
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
              <h1 className="text-3xl font-bold font-montserrat text-orange">
                {!continueTapped ? 'Reservation' : 'Payment'}
              </h1>
              <p className="text-sm font-normal text-white">
                {!continueTapped
                  ? 'Lakukan reservasi sebelum bermain'
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
                    Nama
                  </label>
                  <input
                    type="text"
                    value={namaReservasi}
                    onChange={(e) => setNamaReservasi(e.target.value)}
                    name="nama"
                    id="nama"
                    placeholder="Masukkan namamu"
                    className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg px-3 py-2 active:border-orange focus:border-orange outline-none focus:outline-orange   "
                    required
                  />
                </div>
              </Fade>

              <Fade delay={5} duration={1100}>
                <div className="flex flex-col gap-2">
                  <label className="text-white" htmlFor="nama">
                    No Whatsapp
                  </label>
                  <input
                    type="number"
                    name="nomor_whatsapp"
                    id="nomor_whatsapp"
                    placeholder="Masukkan nomor Whatsapp"
                    className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg px-3 py-2 active:border-orange focus:border-orange outline-none focus:outline-orange "
                    value={nomorWhatsappReservasi}
                    onChange={(e) => setNoWhatsappReservasi(e.target.value)}
                    required
                  />
                </div>
              </Fade>

              {/* Tanggal Reservasi */}
              <Fade delay={6} duration={1200}>
                <div className="flex flex-col gap-2">
                  <label className="text-white" htmlFor="nama">
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
                        className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg px-3 py-2 active:border-orange focus:border-orange outline-none focus:outline-orange  w-full "
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
                  <label className="text-white" htmlFor="nama">
                    Lantai Reservasi
                  </label>
                  <Select
                    value={floorSelected}
                    onValueChange={(value) => setFloorSelected(value)}
                    required
                    className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                  >
                    <SelectTrigger className="py-5 px-3 text-base text-white">
                      <SelectValue
                        className="text-base text-white placeholder:text-white"
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
                        flexDirection: 'column',
                        gap: '8px',
                        backgroundColor: 'white',
                        borderRadius: '8px 0 8px',
                        overflow: 'hidden',
                        position: 'absolute',
                        top: 0,
                        left: 0,
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
                      ref={imageRef}
                      src={`/${
                        floorSelected == 'first-floor'
                          ? 'first-floor.jpg'
                          : 'second-floor.jpg'
                      }`}
                      useMap="#image-map"
                      alt=""
                      style={{
                        width: '100%',
                        height: 'auto',
                        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                        cursor: 'move',
                      }}
                      draggable={false}
                    />
                  </div>
                </div>
              </Fade>

              <Fade delay={7} duration={1300}>
                {/* Lantai 1 */}
                {floorSelected == 'first-floor'
                  ? selectedDate != '' && (
                      <div className="flex flex-col gap-4 mb-6">
                        <div className="flex flex-row justify-evenly gap-2">
                          {[1, 2, 3, 4, 5].map((number) => {
                            return (
                              <Drawer key={number}>
                                <DrawerTrigger asChild>
                                  <div
                                    key={number}
                                    className={`cursor-pointer w-full h-fit border ${'border-gray-400 bg-gray-400 bg-opacity-10'} rounded-lg py-2 flex-col items-center justify-center flex`}
                                    onClick={() => {
                                      setPosisiReservasi(number)
                                      setPricePerReserve(20000)
                                      fetchingAvailableReservation(
                                        selectedDate,
                                        number,
                                      )
                                    }}
                                  >
                                    <p className="opacity-100 text-xs py-2">
                                      Reg
                                    </p>{' '}
                                  </div>
                                </DrawerTrigger>
                                <DrawerContent className="active:border-none border-none outline-none">
                                  <DrawerHeader className="text-left">
                                    <DrawerTitle>
                                      Detail Tempat & Waktu
                                    </DrawerTitle>
                                    <DrawerDescription>
                                      Lihat detail tempat yang ingin direservasi
                                      dan pilih waktu yang tersedia.
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
                                        src={'/fasilitas/regular.png'}
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
                                    <Fade
                                      delay={9}
                                      duration={1500}
                                      className="px-5 "
                                    >
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
                                                      {reserve.reserve_end_time}{' '}
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

                                  <Fade
                                    delay={9}
                                    duration={1500}
                                    className="px-5 "
                                  >
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
                                          className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
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
                                                selectedDate,
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
                                          className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
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
                                              {startTimeReservasi != '' ? (
                                                generateTimeArrayWithStep(
                                                  startTimeReservasi,
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
                                                  00.00
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

                        <div className="flex flex-row gap-2 ml-10">
                          {[6, 7].map((number) => {
                            return (
                              <Drawer key={number}>
                                <DrawerTrigger asChild>
                                  <div
                                    key={number}
                                    className={`cursor-pointer w-fit h-fit border ${'border-gray-400 bg-gray-400 bg-opacity-10'} rounded-lg py-10 flex-col items-center justify-center flex`}
                                    onClick={() => {
                                      setPosisiReservasi(number)
                                      setPricePerReserve(20000)
                                      fetchingAvailableReservation(
                                        selectedDate,
                                        number,
                                      )
                                    }}
                                  >
                                    <p className="opacity-100 text-xs rotate-[290deg]">
                                      Simulator
                                    </p>{' '}
                                  </div>
                                </DrawerTrigger>
                                <DrawerContent className="active:border-none border-none outline-none">
                                  <DrawerHeader className="text-left">
                                    <DrawerTitle>
                                      Detail Tempat & Waktu
                                    </DrawerTitle>
                                    <DrawerDescription>
                                      Lihat detail tempat yang ingin direservasi
                                      dan pilih waktu yang tersedia.
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
                                        src={'/fasilitas/simulator.png'}
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
                                    <Fade
                                      delay={9}
                                      duration={1500}
                                      className="px-5 "
                                    >
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
                                                      {reserve.reserve_end_time}{' '}
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

                                  <Fade
                                    delay={9}
                                    duration={1500}
                                    className="px-5 "
                                  >
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
                                          className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
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
                                                selectedDate,
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
                                          className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
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
                                              {startTimeReservasi != '' ? (
                                                generateTimeArrayWithStep(
                                                  startTimeReservasi,
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
                                                  00.00
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

                          {[8].map((number) => {
                            return (
                              <Drawer key={number}>
                                <DrawerTrigger asChild>
                                  <div
                                    key={number}
                                    className={`cursor-pointer w-fit px-5 h-fit border ${'border-gray-400 bg-gray-400 bg-opacity-10'} rounded-lg py-2 flex-col items-center justify-center flex`}
                                    onClick={() => {
                                      setPosisiReservasi(number)
                                      setPricePerReserve(20000)
                                      fetchingAvailableReservation(
                                        selectedDate,
                                        number,
                                      )
                                    }}
                                  >
                                    <p className="opacity-100 text-xs py-2">
                                      Reg
                                    </p>{' '}
                                  </div>
                                </DrawerTrigger>
                                <DrawerContent className="active:border-none border-none outline-none">
                                  <DrawerHeader className="text-left">
                                    <DrawerTitle>
                                      Detail Tempat & Waktu
                                    </DrawerTitle>
                                    <DrawerDescription>
                                      Lihat detail tempat yang ingin direservasi
                                      dan pilih waktu yang tersedia.
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
                                        src={'/fasilitas/regular.png'}
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
                                    <Fade
                                      delay={9}
                                      duration={1500}
                                      className="px-5 "
                                    >
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
                                                      {reserve.reserve_end_time}{' '}
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

                                  <Fade
                                    delay={9}
                                    duration={1500}
                                    className="px-5 "
                                  >
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
                                          className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
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
                                                selectedDate,
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
                                          className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
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
                                              {startTimeReservasi != '' ? (
                                                generateTimeArrayWithStep(
                                                  startTimeReservasi,
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
                                                  00.00
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
                    )
                  : selectedDate != '' && (
                      <div className="flex flex-col gap-4 mb-6">
                        <div className="flex flex-row justify-evenly gap-2">
                          {[9, 10, 11].map((number) => {
                            return (
                              <Drawer key={number}>
                                <DrawerTrigger asChild>
                                  <div
                                    key={number}
                                    className={`cursor-pointer w-[100px] h-fit border ${'border-gray-400 bg-gray-400 bg-opacity-10'} rounded-lg py-2 flex-col items-center justify-center flex`}
                                    onClick={() => {
                                      setPosisiReservasi(number)
                                      setPricePerReserve(20000)
                                      fetchingAvailableReservation(
                                        selectedDate,
                                        number,
                                      )
                                    }}
                                  >
                                    <p className="opacity-100 text-xs py-2">
                                      {number == '9'
                                        ? 'VIP'
                                        : number == 12
                                        ? 'PS 2'
                                        : 'Reg+'}
                                    </p>{' '}
                                  </div>
                                </DrawerTrigger>
                                <DrawerContent className="active:border-none border-none outline-none">
                                  <DrawerHeader className="text-left">
                                    <DrawerTitle>
                                      Detail Tempat & Waktu
                                    </DrawerTitle>
                                    <DrawerDescription>
                                      Lihat detail tempat yang ingin direservasi
                                      dan pilih waktu yang tersedia.
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
                                        src={`/fasilitas/${
                                          number == 9
                                            ? 'vip-plus'
                                            : 'regular-plus'
                                        }.png`}
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
                                    <Fade
                                      delay={9}
                                      duration={1500}
                                      className="px-5 "
                                    >
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
                                                        inHold
                                                          ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                          : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                      } rounded-md w-fit`}
                                                    >
                                                      {
                                                        reserve.reserve_start_time
                                                      }{' '}
                                                      -{' '}
                                                      {reserve.reserve_end_time}{' '}
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

                                  <Fade
                                    delay={9}
                                    duration={1500}
                                    className="px-5 "
                                  >
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
                                          className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
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
                                                selectedDate,
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
                                          className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
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
                                              {startTimeReservasi != '' ? (
                                                generateTimeArrayWithStep(
                                                  startTimeReservasi,
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
                                                  00.00
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

                        <div className="flex flex-row justify-start gap-2">
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
                                    className={`cursor-pointer w-[100px] h-fit ml-1 border ${'border-gray-400 bg-gray-400 bg-opacity-10'} rounded-lg py-2 flex-col items-center justify-center flex`}
                                    onClick={() => {
                                      setPosisiReservasi(number)
                                      setPricePerReserve(20000)
                                      fetchingAvailableReservation(
                                        selectedDate,
                                        number,
                                      )
                                    }}
                                  >
                                    <p className="opacity-100 text-xs py-2">
                                      PS 2
                                    </p>{' '}
                                  </div>
                                </DrawerTrigger>
                                <DrawerContent className="active:border-none border-none outline-none">
                                  <DrawerHeader className="text-left">
                                    <DrawerTitle>
                                      Detail Tempat & Waktu
                                    </DrawerTitle>
                                    <DrawerDescription>
                                      Lihat detail tempat yang ingin direservasi
                                      dan pilih waktu yang tersedia.
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
                                        src={'/fasilitas/ps2.png'}
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
                                    <Fade
                                      delay={9}
                                      duration={1500}
                                      className="px-5 "
                                    >
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
                                                        inHold
                                                          ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                                                          : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                                                      } rounded-md w-fit`}
                                                    >
                                                      {
                                                        reserve.reserve_start_time
                                                      }{' '}
                                                      -{' '}
                                                      {reserve.reserve_end_time}{' '}
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

                                  <Fade
                                    delay={9}
                                    duration={1500}
                                    className="px-5 "
                                  >
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
                                          className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
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
                                                selectedDate,
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
                                          className="border border-border duration-500 bg-transparent text-white placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
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
                                              {startTimeReservasi != '' ? (
                                                generateTimeArrayWithStep(
                                                  startTimeReservasi,
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
                                                  00.00
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
                    <Loading />
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
                          in
                          {floorSelected == 'second-floor'
                            ? ' 2nd Floor'
                            : ' 1st Floor'}
                          , Position {posisiReservasi}
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
                          Rp {totalTime * pricePerReserve}
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
              price={totalTime * pricePerReserve}
              productName={`Reservation ${
                floorSelected == 'second-floor'
                  ? '2nd Floor Position 1'
                  : '1st Floor Position 2'
              } in ${totalTime} hours`}
              detailCustomer={{
                name: namaReservasi,
                no: nomorWhatsappReservasi,
                reserve_date: selectedDate,
                reserve_start_time: startTimeReservasi,
                reserve_end_time: endTimeReservasi,
                position: posisiReservasi,
                location:
                  floorSelected == 'second-floor'
                    ? `2nd Floor Position ${posisiReservasi}`
                    : `1st Floor Position ${posisiReservasi}`,
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
    </>
  )
}
