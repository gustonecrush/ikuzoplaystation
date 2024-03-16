import React, { Suspense } from 'react'
import Navbar from './Navbar'
import Image from 'next/image'
import SlideContainer from './SlideContainer'
import BounceContainer from './BounceContainer'
import SwiperContainer2 from './SwiperContainer2'
import SwiperContainer from './SwiperContainer'
import Loading from '../loading'
import { Footer } from './Footer'
import ScrollDown from './ScrollDown'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import FadeContainer from './FadeContainer'

export default function Home() {
  return (
    <>
      <section className="flex flex-col h-full w-full scroll-smooth overflow-x-hidden">
        <Navbar />
        <HeroSection />

        <BounceContainer>
          <div
            className="flex bg-black bg-opacity-35 flex-col relative items-center justify-center"
            id="reserve"
          >
            <Image
              className="-z-50 w-full h-screen object-cover bg-opacity-10"
              alt="Facilites Image"
              width={0}
              height={0}
              title="Facilities Image"
              src={'/facilities.png'}
            />

            <div className="absolute w-full md:w-1/2 px-2 flex flex-col gap-2 left-1/2 transform -translate-x-1/2 top-1/2 z-40 -translate-y-1/2 items-center py-12 pt-16">
              <h1 className="text-white font-extrabold font-montserrat text-5xl leading-none text-center md:text-[6rem] md:mt-16">
                PRIVATE ROOM, <span className="text-orange">REGULAR SPOT</span>{' '}
                , AND FACILITIES
              </h1>
              <p className="text-white font-normal text-center text-base md:text-lg">
                suasana "Homey" saat bermain pada Gaming Space Keluarga No. 1 di
                Kota Bandung. Maksimalkan pengalamanmu dengan beragam fasilitas
                seru pelayan terbaik yang bisa kamu dapatkan !
              </p>

              <ReserveButton />
            </div>
          </div>
        </BounceContainer>

        <BounceContainer>
          <div className="flex bg-black bg-opacity-35 flex-col relative items-center justify-center">
            <Image
              className="-z-50 w-full h-screen object-cover bg-opacity-10"
              alt="Facilites Image"
              width={0}
              height={0}
              title="Facilities Image"
              src={'/fasilitas/regular-plus.png'}
            />

            <div className="absolute w-full md:w-1/2 px-2 flex flex-col gap-2 left-1/2 transform -translate-x-1/2 top-1/2 z-40 -translate-y-1/2">
              <h1 className="text-white font-extrabold font-montserrat text-5xl leading-none text-center md:text-[6rem] md:mt-16">
                COMING SOON <span className="text-orange">MEMBERSHIP</span>{' '}
                IKUZO!
              </h1>
              <p className="text-white font-normal text-center text-base md:text-lg">
                Nantikan membership di Ikuzo Playstation! dan nikmati layanan
                serta benefit dari bergabung membership segera
              </p>
            </div>
          </div>
        </BounceContainer>

        {/* Game Section */}
        <div className="flex flex-col gap-2 mt-9 items-center justify-center py-10 bg-white w-full  h-fit z-20">
          <BounceContainer>
            <div className="flex flex-col gap-2 px-3">
              <h1 className="text-orange font-extrabold uppercase font-montserrat text-4xl text-center">
                Pilihan Game Terbaik Ikuzo Playstation!
              </h1>
              <p className="text-gray-400 font-normal text-center text-base">
                Mainkan dan dapatkan kepuasan dalam bermain game yang sedang
                naik daun dan menantang!
              </p>
            </div>
          </BounceContainer>
          <SwiperContainer />
        </div>

        {/* Fasilitas Section */}
        <div className="flex flex-col gap-2 items-center justify-center py-5 bg-white w-full h-fit z-20">
          <BounceContainer>
            <div className="flex flex-col gap-2 px-3">
              <h1 className="text-orange font-extrabold font-montserrat text-4xl  md:text-[5rem] text-center uppercase">
                Fasilitas di <br />
                Ikuzo Playstation!
              </h1>
              <p className="text-gray-400 font-normal text-center text-base">
                Reservasi segera dengan pilihan layanan yang ada dan nikmati
                keseruan bermain bersama Ikuzo!
              </p>
            </div>
          </BounceContainer>
          <SwiperContainer2 />
        </div>

        <section className="flex w-full items-center justify-center">
          <ReserveButton />
        </section>

        <Footer />
      </section>
    </>
  )
}

function HeroSection() {
  return (
    <section className="flex flex-col relative items-center justify-center bg-black bg-opacity-35 h-full w-full">
      <Video />
      <FadeContainer>
        <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 w-full px-3 items-center justify-center ">
          <h1 className="text-white font-extrabold font-montserrat text-5xl leading-none text-center md:text-[6rem] md:mt-16">
            BETTER GAMING AT <span className="text-orange">IKUZO!</span>
          </h1>
          <p className="text-white font-normal text-center text-base md:text-lg">
            Discover the unforgettable gaming experience with your family,
            friends, or as a couple. Feel it and tell the world how excited it
            was!
          </p>
          <ScrollDown />
        </div>
      </FadeContainer>
    </section>
  )
}

function ReserveButton() {
  return (
    <Link
      href={'/reservation'}
      className="bg-orange text-white border-orange py-2 rounded-full text-base mt-4 mb-20 w-fit px-10 relative font-semibold duration-1000 hover:bg-yellow-700"
    >
      Reserve Now
    </Link>
  )
}

export async function Video({ extra = '' }) {
  return (
    <>
      <video
        width="320"
        preload="none"
        autoPlay
        muted
        loop
        className={`h-screen w-full object-cover -z-30 block md:hidden ${extra}`}
      >
        <source src="/ikuzoplaystation.mp4" type="video/mp4" />
        <track src="/ikuzoplaystation.mp4" srcLang="en" label="English" />
        Your browser does not support the video tag.
      </video>
      <video
        width="320"
        height="240"
        preload="none"
        autoPlay
        muted
        loop
        className="h-screen w-full object-cover -z-30 hidden md:block"
      >
        <source src="/ikuzo-dekstop.mp4" type="video/mp4" />
        <track src="/ikuzoplaystation.mp4" srcLang="en" label="English" />
        Your browser does not support the video tag.
      </video>
    </>
  )
}
