import React from 'react'
import Navbar from './Navbar'
import BounceContainer from './BounceContainer'
import SwiperContainer2 from './SwiperContainer2'
import SwiperContainer from './SwiperContainer'
import { Footer } from './Footer'
import Link from 'next/link'
import { IoLogoGameControllerB } from 'react-icons/io'
import Content from './Content'
import Hero from './Hero'

export default function Home() {
  return (
    <>
      <section className="flex flex-col h-full w-full scroll-smooth overflow-x-hidden">
        <Navbar />
        <Hero>
          <Video />
        </Hero>
        <Content />

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
              <h1 className="text-orange font-extrabold uppercase font-montserrat text-4xl text-center">
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
          <ReserveButton type={'large'} />
        </section>

        <Footer />

        <CTAButton />
      </section>
    </>
  )
}

function CTAButton() {
  return (
    <Link
      href={'/reservation'}
      className="fixed bottom-5 right-5 z-[100] h-16 w-16 bg-orange rounded-full p-4 flex items-center justify-center"
    >
      <IoLogoGameControllerB className="text-white text-4xl w-10 " />
    </Link>
  )
}

function ReserveButton({ type }) {
  return (
    <Link
      href={'/reservation'}
      className={`bg-orange text-white border-orange py-2 rounded-full text-base mt-4 mb-20 w-fit px-10 relative font-semibold duration-1000 hover:bg-yellow-700 ${
        type == 'large' ? 'px-20 py-4 text-xl' : ''
      }`}
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
        title="Ikuzo Playstation"
        className={`h-screen w-full md:h-full lg:h-full object-cover -z-30 block md:hidden ${extra}`}
      >
        <source src="/ikuzoplaystation.mp4" type="video/mp4" />
        <track src="/ikuzoplaystation.mp4" srcLang="en" label="English" />
        Your browser does not support the video tag.
      </video>
      <video
        width="320"
        preload="none"
        autoPlay
        muted
        loop
        title="Ikuzo Playstation"
        className="h-screen md:h-full lg:h-full w-full object-cover -z-30 hidden md:block"
      >
        <source src="/ikuzo-dekstop.mp4" type="video/mp4" />
        <track src="/ikuzoplaystation.mp4" srcLang="en" label="English" />
        Your browser does not support the video tag.
      </video>
    </>
  )
}
