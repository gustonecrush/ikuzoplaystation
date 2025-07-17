'use client'

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
import axios from 'axios'
import LoaderHome from './LoaderHome'
import getDocument from '@/firebase/firestore/getData'
import { IoPersonCircleOutline } from 'react-icons/io5'

export default function Home() {
  const [sectionsUpdate, setSectionsUpdate] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  const [searchContent, setSearchContent] = React.useState(null)

  async function fetchDataContents() {
    const dataContentSearch = await getDocument('search-id', 'search-id-doc')
    setSearchContent(dataContentSearch.data)
  }

  const fetchSections = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sections`,
      )
      if (response.status == 200) {
        const jsonData = await response.data
        setSectionsUpdate(jsonData.data)
        setIsLoading(false)
      } else {
        setIsLoading(true)
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      setIsLoading(true)
    }
  }

  React.useEffect(() => {
    fetchSections()
    fetchDataContents()
  }, [])

  return (
    <>
      {searchContent == null ? (
        <LoaderHome />
      ) : (
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
                  {isLoading ? '' : sectionsUpdate[0]?.title}
                </h1>
                <p
                  dangerouslySetInnerHTML={{
                    __html: sectionsUpdate && sectionsUpdate[0]?.description,
                  }}
                  className="text-gray-400 font-normal text-center prose-base"
                ></p>
              </div>
            </BounceContainer>
            <SwiperContainer />
          </div>

          {/* Fasilitas Section */}
          <div className="flex flex-col gap-2 items-center justify-center py-5 bg-white w-full h-fit z-20">
            <BounceContainer>
              <div className="flex flex-col gap-2 px-3">
                <h1 className="text-orange font-extrabold uppercase font-montserrat text-4xl text-center">
                  {isLoading ? '' : sectionsUpdate[1]?.title}
                </h1>
                <p
                  dangerouslySetInnerHTML={{
                    __html: sectionsUpdate && sectionsUpdate[1]?.description,
                  }}
                  className="text-gray-400 font-normal text-center prose-base"
                ></p>
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
      )}
    </>
  )
}

function CTAButton() {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`fixed left-0 right-0 mx-auto w-full z-[100] flex flex-row justify-center gap-3 px-4 py-3 transition-all duration-300 rounded-tl-2xl rounded-tr-2xl ${
        scrolled ? 'bottom-0 bg-white shadow-md pt-5 pb-3' : 'bottom-5 '
      }`}
    >
      <Link
        href="/reservation"
        title="Reserve Now"
        className={`flex items-center gap-3 px-5 py-3 bg-orange-500 hover:bg-orange-600  rounded-full shadow-lg transition-all duration-200 ease-in-out hover:scale-105 group ${
          scrolled
            ? 'text-white bg-orange hover:bg-orange'
            : 'border border-orange  text-orange hover:bg-orange'
        }`}
      >
        <span
          className={`font-normal ${scrolled ? 'text-white ' : 'text-white'}`}
        >
          Reserve Now
        </span>
        <IoLogoGameControllerB className="text-2xl group-hover:text-white" />
      </Link>
      <Link
        href="/membership"
        title="Join Member"
        className={`flex items-center gap-3 px-5 py-3 bg-orange-500 hover:bg-orange-600  rounded-full shadow-lg transition-all duration-200 ease-in-out hover:scale-105 group ${
          scrolled
            ? 'text-white bg-orange hover:bg-orange'
            : 'border border-orange  text-orange hover:bg-orange '
        }`}
      >
        <span
          className={`font-normal ${scrolled ? 'text-white ' : 'text-white '}`}
        >
          Join Member
        </span>
        <IoPersonCircleOutline className="text-2xl group-hover:text-white" />
      </Link>
    </div>
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

export function Video({ extra = '' }) {
  return (
    <>
      <video
        width="320"
        preload="none"
        autoPlay
        playsInline
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
        playsInline
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
