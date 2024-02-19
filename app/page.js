import React, { Suspense } from 'react'
import Navbar from './components/Navbar'
import Image from 'next/image'
import SlideContainer from './components/SlideContainer'
import FadeContainer from './components/FadeContainer'
import BounceContainer from './components/BounceContainer'
import SwiperContainer2 from './components/SwiperContainer2'
import SwiperContainer from './components/SwiperContainer'
import Loading from './loading'
import { Footer } from './components/Footer'

export default function Home() {
  return (
    <>
       <section className='flex flex-col h-full w-full'>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <SlideContainer>
      <div className='flex relative items-center justify-center'>
        <Video />
        <FadeContainer>
        <div className='absolute flex flex-col gap-2 left-1/2 transform -translate-x-1/2 w-full px-2 top-1/2 z-40 -translate-y-1/2'>
          <h1 className='text-white font-extrabold font-montserrat text-6xl text-center'>
            Better Gaming at Ikuzo Playsation!
          </h1>
          <p className='text-white font-normal text-center text-base'>Discover the unforgettable gaming experience with your family, friends, or as a couple. Feel it and tell the world how excited it was!</p>
        </div>
        </FadeContainer>
       
      </div>
      </SlideContainer>
     

      {/* Facility Section */}
      <SlideContainer>
      <div className='flex flex-col relative items-center justify-center'>
        <Image className='-z-50 w-full h-screen object-cover bg-opacity-10' alt='Facilites Image' width={0} height={0} title='Facilities Image' src={'/facilities.png'} />
        <FadeContainer>
        <div className='absolute w-full px-2 flex flex-col gap-2 left-1/2 transform -translate-x-1/2 top-1/2 z-40 -translate-y-1/2'>
            <h1 className='text-white font-extrabold font-montserrat text-6xl text-center'>
              Private Room, Reguler Spot, and Facilities
            </h1>
            <p className='text-white font-normal text-center text-base'>Rasakan suasana "Homey" saat bermain pada Gaming Space Keluarga No. 1 di Kota Bandung. Maksimalkan pengalamanmu dengan beragam fasilitas seru pelayan terbaik yang bisa kamu dapatkan
            !</p>
        </div>
        </FadeContainer>
      
       
      </div>
      </SlideContainer>


      {/* Membership Section */}
      <SlideContainer>
      <div className='flex flex-col relative items-center justify-center'>
        <Image className='-z-50 w-full h-screen object-cover bg-opacity-10' alt='Facilites Image' width={0} height={0} title='Facilities Image' src={'/fasilitas/regular-plus.png'} />
        <FadeContainer>
        <div className='absolute w-full px-2 flex flex-col gap-2 left-1/2 transform -translate-x-1/2 top-1/2 z-40 -translate-y-1/2'>
            <h1 className='text-white font-extrabold font-montserrat text-6xl text-center'>
              Coming Soon Membership Ikuzo!
            </h1>
            <p className='text-white font-normal text-center text-base'>Nantikan membership di Ikuzo Playstation! dan nikmati layanan serta benefit dari bergabung membership segera</p>
        </div>
        </FadeContainer>
      
       
      </div>
      </SlideContainer>

      {/* Game Section */}
      <div className='flex flex-col gap-2 items-center justify-center py-10 bg-white w-full h-fit z-20'>
        <BounceContainer>
          <div className='flex flex-col gap-2 px-3'>
          <h1 className='text-orange font-extrabold font-montserrat text-4xl text-center'>
              Pilihan Game Terbaik Ikuzo Playstation!
            </h1>
            <p className='text-gray-400 font-normal text-center text-base'>Mainkan dan dapatkan kepuasan dalam bermain game yang sedang naik daun dan menantang!</p>
          </div>

        </BounceContainer>
        <SwiperContainer />
      </div>

      {/* Fasilitas Section */}
      <div className='flex flex-col gap-2 items-center justify-center py-10'>
        <BounceContainer>
          <div className='flex flex-col gap-2 px-3'>
          <h1 className='text-orange font-extrabold font-montserrat text-4xl text-center'>
              Fasilitas di Ikuzo!
            </h1>
            <p className='text-gray-400 font-normal text-center text-base'>Reservasi segera dengan pilihan layanan yang ada dan nikmati keseruan bermain bersama Ikuzo!</p>
          </div>

        </BounceContainer>
        <SwiperContainer2 />
      </div>
      
      <Footer />
    </section>
    </>
  )
}

async function Video() {
  return (
    <video width="320" height="240" preload="none" autoPlay muted loop className='h-screen w-full object-cover -z-30'>
    <source src="/ikuzoplaystation.mp4" type="video/mp4" />
    <track
      src="/ikuzoplaystation.mp4"
      srcLang="en"
      label="English"
    />
    Your browser does not support the video tag.
  </video>
  )
}