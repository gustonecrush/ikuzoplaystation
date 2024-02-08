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
  getCurrentDate,
  getCurrentTime,
  getMaxDate,
  getMaxTime,
} from '@/utils/date'
import { generateRandomString } from '@/utils/id'
import { HashLoader } from 'react-spinners'

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
      tanggalReservasi &&
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
      prevPosition = { x: e.clientX, y: e.clientY }
    }

    const handleMouseMove = (e) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevPosition.x
      const deltaY = e.clientY - prevPosition.y
      prevPosition = { x: e.clientX, y: e.clientY }
      setPosition((position) => ({
        x: position.x + deltaX,
        y: position.y + deltaY,
      }))
    }

    const handleMouseUp = (e) => {
      isDragging = false
    }

    image?.addEventListener('mousedown', handleMouseDown)
    image?.addEventListener('mousemove', handleMouseMove)
    image?.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.body.removeChild(script)
      image?.removeEventListener('mousedown', handleMouseDown)
      image?.removeEventListener('mousemove', handleMouseMove)
      image?.removeEventListener('mouseup', handleMouseUp)
    }

    // render midtrans snap token
  }, [startTimeReservasi, endTimeReservasi, imageRef, scale])

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
          {/* <Link href={'/'} title={'Home Ikuzo Playstation'}><HomeIcon /></Link> */}
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
                  <input
                    type="date"
                    value={tanggalReservasi}
                    onChange={(e) => setTanggalReservasi(e.target.value)}
                    name="tanggal_reservasi"
                    id="tanggal_reservasi"
                    placeholder="Masukkan nomor Whatsapp"
                    className="border border-border duration-500 rounded-lg px-3 py-2 active:border-orange focus:border-orange focus:outline-orange w-full bg-white"
                    min={currentDate}
                    max={maxDate}
                    required
                  />
                </div>
              </Fade>

              {/* Lantai Reservasi */}
              <Fade delay={7} duration={1300}>
                <div className="flex flex-col gap-2">
                  <label htmlFor="nama">Lantai Reservasi</label>
                  <select
                    name="lantai_reservasi"
                    id="lantai_reservasi"
                    placeholder="Masukkan nomor Whatsapp"
                    className="border border-border duration-500 rounded-lg px-3 py-2 
         active:border-orange focus:border-orange focus:outline-orange w-full bg-white"
                    onChange={(e) => setFloorSelected(e.target.value)}
                    required
                  >
                    <option value="First Floor" className="text-gray-400">
                      Pilih Lantai
                    </option>
                    <option value="first-floor">1st Floor</option>
                    <option value="second-floor">2nd Floor</option>
                  </select>
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
                          ? 'first-floor'
                          : 'second-floor'
                      }.jpg`}
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
                  {/* <Image
                    src={`/${
                      floorSelected == 'first-floor'
                        ? 'first-floor'
                        : 'second-floor'
                    }.jpg`}
                    alt={floorSelected}
                    title={floorSelected}
                    width={0}
                    ref={imageRef}
                    height={0}
                    draggable={false}
                    className={'w-full h-full rounded-md cursor-move'}
                    style={{
                      transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                    }}
                  /> */}
                  {/* <div>
                    <img src="/first-floor.jpg" useMap="#image_map" alt="Floor Plan" />
                    <map name="image_map">
                      <area alt="position1" title="position1" href="#" coords="598,-1098,1031,-348" shape="rect" onClick={() => handleClick("position1")} />
                      <area alt="position2" title="position2" href="#" coords="1135,-1116,1605,-378" shape="rect" onClick={() => handleClick("position2")} />
                      <area alt="position3" title="position3" href="#" coords="1666,-1110,2135,-336" shape="rect" onClick={() => handleClick("position3")} />
                      <area alt="position4" title="position4" href="#" coords="2276,-1141,2685,-342" shape="rect" onClick={() => handleClick("position4")} />
                      <area alt="position5" title="position5" href="#" coords="2758,-1116,3288,-275" shape="rect" onClick={() => handleClick("position5")} />
                      <area alt="position6" title="position6" href="#" coords="787,-134,1245,567" shape="rect" onClick={() => handleClick("position6")} />
                      <area alt="position7" title="position7" href="#" coords="1281,-140,1763,592" shape="rect" onClick={() => handleClick("position7")} />
                      <area alt="position8" title="position8" href="#" coords="1891,31,2386,598" shape="rect" onClick={() => handleClick("position8")} />
                    </map>
                  </div> */}
                </div>
              </Fade>

              {/* Waktu Reservasi */}
              <Fade delay={9} duration={1500}>
                <div className="flex gap-1 w-full">
                  <div className="flex flex-col gap-2 w-full flex-1">
                    <label htmlFor="nama">Start Time</label>
                    <input
                      type="time"
                      value={startTimeReservasi}
                      onChange={(e) => setStartTimeReservasi(e.target.value)}
                      name="tanggal_reservasi"
                      id="tanggal_reservasi"
                      step="600"
                      placeholder="Masukkan nomor Whatsapp"
                      className="border border-border duration-500 rounded-lg px-3 py-2 active:border-orange focus:border-orange focus:outline-orange w-full bg-white"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full flex-1">
                    <label htmlFor="nama">End Time</label>
                    <input
                      type="time"
                      value={endTimeReservasi}
                      onChange={(e) => setEndTimeReservasi(e.target.value)}
                      name="tanggal_reservasi"
                      id="tanggal_reservasi"
                      step="600"
                      placeholder="Masukkan nomor Whatsapp"
                      className="border border-border duration-500 rounded-lg px-3 py-2 active:border-orange focus:border-orange focus:outline-orange w-full bg-white"
                      required
                    />
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
                          {tanggalReservasi}
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
