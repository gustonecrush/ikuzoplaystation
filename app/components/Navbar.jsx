'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiSearch } from 'react-icons/fi'
import Image from 'next/image'
import Marquee from 'react-fast-marquee'
import Link from 'next/link'
import getDocument from '@/firebase/firestore/getData'
import { cn } from '@/lib/utils'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)

  const [searchContent, setSearchContent] = useState(null)
  const [marqueeContent, setMarqueeContent] = useState(null)

  async function fetchDataContents() {
    const dataContentSearch = await getDocument('search-id', 'search-id-doc')
    const dataContentMarquee = await getDocument('marquee-id', 'marquee-id-doc')
    setSearchContent(dataContentSearch.data)
    setMarqueeContent(dataContentMarquee.data)
  }

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0
      setScrolled(isScrolled)
    }
    fetchDataContents()

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      {searchContent == null || marqueeContent == null ? (
        <></>
      ) : (
        <nav
          className={`flexBetween max-container z-[80] pt-1 font-montserrat flex flex-col ${
            scrolled ? 'bg-white text-black' : 'bg-transparent text-white'
          } fixed top-0 transition-all ease-in-out duration-1000 w-full`}
        >
          {/* MARQUEE TEXT */}
          <Marquee
            className={`py-2 -mt-2 ${
              scrolled
                ? 'text-black border-b border-b-primary'
                : 'text-white border-b border-b-white'
            }`}
          >
            {marqueeContent.data.map((text, index) => (
              <p key={index} className="text-base font-montserrat">
                {text}&nbsp;&nbsp;&nbsp;
              </p>
            ))}
          </Marquee>

          {/* NAV */}
          <div className="flex justify-between items-center px-3 relative w-full gap-5 my-3 md:my-5">
            <Link href="/">
              <Image
                src="/logo-orange.png"
                alt="Ikuzo Playstation's Logo"
                title="Ikuzo Playstation's Logo"
                width={0}
                height={0}
                className="w-[140px] md:w-[140px] md:hidden block"
              />
            </Link>

            <div className="flex items-center gap-3 w-fit">
              <Link
                href="/search/catalogs"
                className="flex justify-between items-center px-3 relative md:w-fit w-full border border-orange rounded-full py-2"
              >
                <span
                  className={`${
                    scrolled ? 'text-orange' : 'text-gray-300'
                  } text-sm`}
                >
                  {searchContent['search-btn-txt']}
                </span>
                <span>
                  <FiSearch className="text-orange text-2xl cursor-pointer" />
                </span>
              </Link>

              {/* <Link
                href="/membership"
                className={cn(
                  'inline-flex items-center justify-center rounded-md text-sm text-center font-medium',
                  'bg-orange hover:bg-orange',
                  'h-10 px-4 py-2 transition-colors rounded-full text-white',
                )}
              >
                Access Membership
              </Link> */}
            </div>
          </div>
        </nav>
      )}
    </>
  )
}

export default Navbar
