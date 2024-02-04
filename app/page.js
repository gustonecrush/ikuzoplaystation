'use client'

import Image from 'next/image'
import { product } from './libs/product'
import Checkout from './components/Checkout'
import React, { useEffect } from 'react'

// FRAMER MOTION
import { motion } from 'framer-motion'

// REVEAL
import { Slide } from 'react-awesome-reveal'

// UI COMPONENTS
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
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import {
  calculateTimeDifference,
  getCurrentDate,
  getCurrentTime,
  getMaxDate,
  getMaxTime,
} from '@/utils/date'
import { generateRandomString } from '@/utils/id'

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
    return () => {
      document.body.removeChild(script)
    }
    // render midtrans snap token
  }, [startTimeReservasi, endTimeReservasi])

  return (
    <>
      <section className="bg-white w-full h-full font-jakarta">
        {/* Header Navigation & Logo */}
        <div className="flex items-center justify-between px-5 border-b border-b-white">
          <Image
            src={'/logo-orange.png'}
            alt={'Ikuzo Playstation Logo'}
            title={'Ikuzo Playstation Logo'}
            width={0}
            height={0}
            className="w-[150px] h-fit"
          />
          {/* <Link href={'/'} title={'Home Ikuzo Playstation'}><HomeIcon /></Link> */}
        </div>

        {/* Testing */}
        <div className="px-5 py-3 text-black">
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold">
              {!continueTapped ? 'Reservation' : 'Checkout'}
            </h1>
            <p className="text-base font-normal text-gray-400">
              {!continueTapped
                ? 'Lakukan reservasi sebelum bermain'
                : 'Lakukan checkout segera untuk reservasi'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-5 py-3">
          {/* /Input Nama */}
          <Slide>
            <div className="flex flex-col gap-2">
              <label htmlFor="nama">Nama</label>
              <input
                type="text"
                value={namaReservasi}
                onChange={(e) => setNamaReservasi(e.target.value)}
                name="nama"
                id="nama"
                placeholder="Masukkan namamu"
                className="border border-black rounded-full px-3 py-2 active:border-orange"
                required
              />
            </div>
          </Slide>

          <Slide delay={5} duration={1100}>
            {/* Input No Whatsapp */}
            <div className="flex flex-col gap-2">
              <label htmlFor="nama">No Whatsapp</label>
              <input
                type="number"
                name="nomor_whatsapp"
                id="nomor_whatsapp"
                placeholder="Masukkan nomor Whatsapp"
                className="border border-black rounded-full px-3 py-2 active:border-orange"
                value={nomorWhatsappReservasi}
                onChange={(e) => setNoWhatsappReservasi(e.target.value)}
                required
              />
            </div>
          </Slide>

          {/* Tanggal Reservasi */}
          <Slide delay={6} duration={1200}>
            <div className="flex flex-col gap-2">
              <label htmlFor="nama">Tanggal Reservasi</label>
              <input
                type="date"
                value={tanggalReservasi}
                onChange={(e) => setTanggalReservasi(e.target.value)}
                name="tanggal_reservasi"
                id="tanggal_reservasi"
                placeholder="Masukkan nomor Whatsapp"
                className="border border-black rounded-full px-3 py-2 active:border-orange w-full bg-white"
                min={currentDate}
                max={maxDate}
                required
              />
            </div>
          </Slide>

          {/* Lantai Reservasi */}
          <Slide delay={7} duration={1300}>
            <div className="flex flex-col gap-2">
              <label htmlFor="nama">Lantai Reservasi</label>
              <select
                name="lantai_reservasi"
                id="lantai_reservasi"
                placeholder="Masukkan nomor Whatsapp"
                className="border border-black rounded-full px-3 py-2 
         active:border-orange w-full bg-white"
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
          </Slide>

          <Slide delay={8} duration={1400}>
            <div className="flex-relative w-full h-fit">
              <Image
                src={`/${
                  floorSelected == 'first-floor'
                    ? 'first-floor'
                    : 'second-floor'
                }.jpg`}
                alt={floorSelected}
                title={floorSelected}
                width={0}
                height={0}
                className={'w-full h-full rounded-md'}
              />
            </div>
          </Slide>

          {/* Waktu Reservasi */}
          <Slide delay={9} duration={1500}>
            <div className="flex gap-1 w-full">
              <div className="flex flex-col gap-2 w-full flex-1">
                <label htmlFor="nama">Start Time</label>
                <input
                  type="time"
                  value={startTimeReservasi}
                  onChange={(e) => setStartTimeReservasi(e.target.value)}
                  name="tanggal_reservasi"
                  id="tanggal_reservasi"
                  placeholder="Masukkan nomor Whatsapp"
                  className="border border-black rounded-full px-3 py-2 active:border-orange w-full bg-white"
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
                  placeholder="Masukkan nomor Whatsapp"
                  className="border border-black rounded-full px-3 py-2 active:border-orange w-full bg-white"
                  required
                />
              </div>
            </div>
          </Slide>

          {/* Button Continue */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                type="submit"
                className="font-medium text-white bg-orange w-full px-5 py-6 rounded-full hover:bg-orange text-base"
              >
                Continue
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle className="text-2xl font-jakarta">
                    Checkout
                  </DrawerTitle>
                  <DrawerDescription className="text-base font-jakarta">
                    Lakukan checkout segera untuk reservasi
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <div>
                    <div className="space-y-1">
                      <h4 className="text-base font-jakarta font-medium leading-none">
                        ID Reservasi
                      </h4>
                      <p className="text-base font-jakarta text-muted-foreground">
                        {idReservasi}
                      </p>
                    </div>
                    <Separator className="my-2" />
                    <div className="space-y-1">
                      <h4 className="text-base font-jakarta font-medium leading-none">
                        Nama
                      </h4>
                      <p className="text-base font-jakarta text-muted-foreground">
                        {namaReservasi}
                      </p>
                    </div>
                    <Separator className="my-2" />
                    <div className="space-y-1">
                      <h4 className="text-base font-jakarta font-medium leading-none">
                        No Whatsapp
                      </h4>
                      <p className="text-base font-jakarta text-muted-foreground">
                        {nomorWhatsappReservasi}
                      </p>
                    </div>
                    <Separator className="my-2" />
                    <div className="space-y-1">
                      <h4 className="text-base font-jakarta font-medium leading-none">
                        Tanggal Reservasi
                      </h4>
                      <p className="text-base font-jakarta text-muted-foreground">
                        {nomorWhatsappReservasi}
                      </p>
                    </div>
                    <Separator className="my-2" />

                    <div className="space-y-1">
                      <h4 className="text-base font-jakarta font-medium leading-none">
                        Waktu Reservasi
                      </h4>
                      <p className="text-base font-jakarta text-muted-foreground">
                        {startTimeReservasi} - {endTimeReservasi} | {totalTime}{' '}
                        hours
                      </p>
                    </div>
                    <Separator className="my-2" />

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
                    <Separator className="my-2" />

                    <div className="space-y-1">
                      <h4 className="text-base font-jakarta font-medium leading-none">
                        Total Harga
                      </h4>
                      <p className="text-base font-jakarta text-muted-foreground">
                        Rp 50.000
                      </p>
                    </div>
                    <Separator className="my-2" />
                  </div>
                </div>
                <DrawerFooter>
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
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      className="rounded-full px-5 py-6 text-base font-jakarta"
                    >
                      Cancel
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </section>
    </>
  )
}
