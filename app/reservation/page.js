'use client'

import Image from 'next/image'
import Checkout from '../components/Checkout'
import React, { useEffect, useRef, useState } from 'react'

// FRAMER MOTION
import { motion } from 'framer-motion'

// REVEAL
import { Fade } from 'react-awesome-reveal'

// UI COMPONENTS
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  calculateTimeDifference,
  formatDate,
  generateTimeArray,
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

export default function Reservation() {
  // RESERVATION STATE DATA
  const [continueTapped, setContinueTapped] = React.useState(false)
  const [idReservasi, setIdReservasi] = React.useState(generateRandomString)
  const [namaReservasi, setNamaReservasi] = React.useState('')
  const [nomorWhatsappReservasi, setNoWhatsappReservasi] = React.useState('')
  const [floorSelected, setFloorSelected] = React.useState('')
  const [tanggalReservasi, setTanggalReservasi] = React.useState('')
  const [startTimeReservasi, setStartTimeReservasi] = React.useState('')
  const [endTimeReservasi, setEndTimeReservasi] = React.useState('')
  const [totalTime, setTotalTime] = React.useState(null)
  const [currentDate, setCurrentDate] = React.useState(getCurrentDate)
  const [maxDate, setMaxDate] = React.useState(getMaxDate)
  const [currentTime, setCurrentTime] = React.useState(getCurrentTime)
  const [maxTime, setMaxTime] = React.useState(getMaxTime)
  const [isLoading, setIsLoading] = React.useState(false)

  /***********************************************************
   * functions & states for scaling image
   ***********************************************************/
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef(null)

  const handleZoomIn = () => {
    setScale((scale) => scale + 0.1)
  }

  const handleZoomOut = () => {
    setScale((scale) => scale - 0.1)
  }

  const handleContinue = () => {
    // Assuming you have some state variables for your input values
    if (
      namaReservasi &&
      nomorWhatsappReservasi &&
      floorSelected &&
      selectedDate &&
      startTimeReservasi &&
      endTimeReservasi
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

  const handleClick = (alt) => {
    alert(alt)
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

    return () => {
      image?.removeEventListener('mousedown', handleMouseDown)
      image?.removeEventListener('touchstart', handleMouseDown)
      image?.removeEventListener('mousemove', handleMouseMove)
      image?.removeEventListener('touchmove', handleMouseMove)
      image?.removeEventListener('mouseup', handleMouseUp)
      image?.removeEventListener('touchend', handleMouseUp)
      document.body.removeChild(script)
    }
  }, [startTimeReservasi, endTimeReservasi, imageRef, scale])

  const [date, setDate] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')

  console.log(floorSelected)

  return (
    <>
      <section className="bg-white w-full h-full font-jakarta px-5 py-5">
        {/* Header Navigation & Logo */}
        <div className="flex items-center justify-between border-b border-b-white">
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

        {/* Testing */}
        <div className="px-5 py-5 text-black bg-white shadow-md rounded-lg flex flex-row gap-3 items-center">
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
              <h1 className="text-2xl font-semibold">
                {!continueTapped ? 'Reservation' : 'Payment'}
              </h1>
              <p className="text-sm font-normal text-gray-400">
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
              {/* /Input Nama */}
              <Fade>
                <div className="flex flex-col gap-2">
                  <label htmlFor="nama">Nama</label>
                  <input
                    type="text"
                    value={namaReservasi}
                    onChange={(e) => setNamaReservasi(e.target.value)}
                    name="nama"
                    id="nama"
                    placeholder="Masukkan namamu"
                    className="border border-border duration-500 rounded-lg px-3 py-2 active:border-orange focus:border-orange focus:outline-orange"
                    required
                  />
                </div>
              </Fade>

              <Fade delay={5} duration={1100}>
                {/* Input No Whatsapp */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="nama">No Whatsapp</label>
                  <input
                    type="number"
                    name="nomor_whatsapp"
                    id="nomor_whatsapp"
                    placeholder="Masukkan nomor Whatsapp"
                    className="border border-border duration-500 rounded-lg px-3 py-2 active:border-orange focus:border-orange focus:outline-orange"
                    value={nomorWhatsappReservasi}
                    onChange={(e) => setNoWhatsappReservasi(e.target.value)}
                    required
                  />
                </div>
              </Fade>

              {/* Tanggal Reservasi */}
              <Fade delay={6} duration={1200}>
                <div className="flex flex-col gap-2">
                  <label htmlFor="nama">Tanggal Reservasi</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        name="tanggal_reservasi"
                        id="tanggal_reservasi"
                        placeholder="Masukkan nomor Whatsapp"
                        className="border border-border duration-500 rounded-lg px-3 py-2 active:border-orange focus:border-orange focus:outline-orange w-full bg-white"
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
                  <label htmlFor="nama">Lantai Reservasi</label>
                  <Select
                    value={floorSelected}
                    onValueChange={(value) => setFloorSelected(value)}
                    required
                    className="border border-border duration-500 rounded-lg !px-3 !py-4 "
                  >
                    <SelectTrigger className="py-5 px-3 text-base">
                      <SelectValue
                        className="text-base"
                        placeholder="Pilih Lantai"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
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
                      src={'/first-floor.jpg'}
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

                    <map name="image-map">
                      <area
                        target="_blank"
                        alt="Position 1"
                        title="Position 1"
                        href="https://google.com"
                        coords="1527,590,1201,892"
                        shape="rect"
                        className="w-8 h-8 bg-orange"
                      />
                      <area
                        target="_blank"
                        alt="Position 2"
                        title="Position 2"
                        href="https://google.com"
                        coords="3192,862,2866,560"
                        shape="rect"
                        className="w-8 h-8 bg-orange"
                      />
                      <area
                        target="_blank"
                        alt="Position 3"
                        title="Position 3"
                        href="https://google.com"
                        coords="1969,1486,2288,1785,3580,1863,3071,1479,3394,1771"
                        shape="rect"
                        className="w-8 h-8 bg-orange"
                      />
                      <area
                        target="_blank"
                        alt="Position 4"
                        title="Position 4"
                        href="https://google.com"
                        coords="1742,583,2081,892"
                        shape="rect"
                        className="w-8 h-8 bg-orange"
                      />
                      <area
                        target="_blank"
                        alt="Position 5"
                        title="Position 5"
                        href="https://google.com"
                        coords="2308,576,2627,875"
                        shape="rect"
                        className="w-8 h-8 bg-orange"
                      />
                      <area
                        target="_blank"
                        alt="Position 6"
                        title="Position 6"
                        href="https://google.com"
                        coords="650,597,962,888"
                        shape="rect"
                        className="w-8 h-8 bg-orange"
                      />
                      <area
                        target="_blank"
                        alt="Position 7"
                        title="Position 7"
                        href="https://google.com"
                        coords="820,1343,1145,1913"
                        shape="rect"
                        className="w-8 h-8 bg-orange"
                      />
                      <area
                        target="_blank"
                        alt="Position 8"
                        title="Position 8"
                        href="https://google.com"
                        coords="1331,1343,1654,1899"
                        shape="rect"
                        className="w-8 h-8 bg-orange"
                      />
                    </map>
                  </div>
                </div>
              </Fade>

              {/* Waktu Reservasi */}
              <Fade delay={9} duration={1500}>
                <div className="flex gap-1 w-full">
                  <div className="flex flex-col gap-2 w-full flex-1">
                    <label htmlFor="nama">Start Time</label>
                    <Select
                      value={startTimeReservasi}
                      onValueChange={(value) => setStartTimeReservasi(value)}
                      required
                      className="border border-border duration-500 rounded-lg !px-3 !py-4 "
                    >
                      <SelectTrigger className="py-5 px-3 text-base">
                        <SelectValue
                          className="text-base"
                          placeholder="00.00"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="text-base">
                            Pilih Waktu Mulai
                          </SelectLabel>
                          {generateTimeArray().map((time, index) => (
                            <SelectItem key={index} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2 w-full flex-1">
                    <label htmlFor="nama">End Time</label>
                    <Select
                      value={endTimeReservasi}
                      onValueChange={(value) => setEndTimeReservasi(value)}
                      required
                      className="border border-border duration-500 rounded-lg !px-3 !py-4 "
                    >
                      <SelectTrigger className="py-5 px-3 text-base">
                        <SelectValue
                          className="text-base"
                          placeholder="00.00"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="text-base">
                            Pilih Waktu Berakhir
                          </SelectLabel>
                          {generateTimeArray().map((time, index) => (
                            <SelectItem key={index} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Fade>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-3 px-5 bg-white shadow-md rounded-lg mt-5 py-7">
              <div className="p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center w-full">
                    {' '}
                    <HashLoader color="#FF6200" />
                  </div>
                ) : (
                  <div>
                    <Fade>
                      <div className="space-y-1">
                        <h4 className="text-base font-jakarta font-medium leading-none">
                          ID Reservasi
                        </h4>
                        <p className="text-base font-jakarta text-muted-foreground">
                          {idReservasi}
                        </p>
                      </div>
                    </Fade>
                    <Separator className="my-2" />
                    <Fade>
                      <div className="space-y-1">
                        <h4 className="text-base font-jakarta font-medium leading-none">
                          Nama
                        </h4>
                        <p className="text-base font-jakarta text-muted-foreground">
                          {namaReservasi}
                        </p>
                      </div>
                    </Fade>
                    <Separator className="my-2" />
                    <Fade>
                      <div className="space-y-1">
                        <h4 className="text-base font-jakarta font-medium leading-none">
                          No Whatsapp
                        </h4>
                        <p className="text-base font-jakarta text-muted-foreground">
                          {nomorWhatsappReservasi}
                        </p>
                      </div>
                    </Fade>
                    <Separator className="my-2" />
                    <Fade>
                      <div className="space-y-1">
                        <h4 className="text-base font-jakarta font-medium leading-none">
                          Tanggal Reservasi
                        </h4>
                        <p className="text-base font-jakarta text-muted-foreground">
                          {formatDate(selectedDate)}
                        </p>
                      </div>
                    </Fade>
                    <Separator className="my-2" />
                    <Fade>
                      <div className="space-y-1">
                        <h4 className="text-base font-jakarta font-medium leading-none">
                          Waktu Reservasi
                        </h4>
                        <p className="text-base font-jakarta text-muted-foreground">
                          {startTimeReservasi} - {endTimeReservasi} |{' '}
                          {totalTime} hours
                        </p>
                      </div>
                    </Fade>
                    <Separator className="my-2" />
                    <Fade>
                      <div className="space-y-1">
                        <h4 className="text-base font-jakarta font-medium leading-none">
                          Detail Tempat
                        </h4>
                        <p className="text-base font-jakarta text-muted-foreground">
                          in
                          {floorSelected == 'second-floor'
                            ? ' 2nd Floor'
                            : ' 1st Floor'}
                          , Position 5
                        </p>
                      </div>
                    </Fade>
                    <Separator className="my-2" />
                    <Fade>
                      <div className="space-y-1">
                        <h4 className="text-base font-jakarta font-medium leading-none">
                          Total Harga
                        </h4>
                        <p className="text-base font-jakarta text-muted-foreground">
                          Rp 50.000
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
            <Checkout
              id={idReservasi}
              price={totalTime * 10000}
              productName={`Reservation ${
                floorSelected == 'second-floor'
                  ? '2nd Floor Position 1'
                  : '1st Floor Position 2'
              } in ${totalTime} hours`}
              detailCustomer={{
                name: namaReservasi,
                no: nomorWhatsappReservasi,
              }}
            />
            <Button
              variant="outline"
              onClick={(e) => handleContinue()}
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
