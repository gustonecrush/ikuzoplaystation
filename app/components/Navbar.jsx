'use client'

import { useEffect, useState } from 'react'
import { NAV_LINKS } from '@/constans'
import Image from 'next/image'
import Link from 'next/link'
import Button from './Button'
import Marquee from 'react-fast-marquee'

const MARQUEE_TEXTS = [
  'NO.1 FAMILY GAMING SPACE IN TOWN.',
  'PRIVATE ROOM, REGULAR SPOT, AND FACILITIES.',
  'FILLED WITH THE BEST GAME TITLES IN THE WORLD.',
  'GAMING IS BETTER AT IKUZO.',
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <nav
      className={`flexBetween max-container z-[80] pt-1 font-montserrat flex flex-col ${
        scrolled ? 'bg-white text-black' : 'bg-transparent text-white'
      } fixed top-0 transition-all ease-in-out duration-1000`}
    >
      {/* MARQUEE TEXT */}
      <Marquee
        className={`py-2 -mt-2 ${
          scrolled
            ? 'text-black border-b border-b-primary'
            : 'text-white border-b border-b-white'
        }`}
      >
        {MARQUEE_TEXTS.map((text, index) => (
          <p key={index} className="text-base font-montserrat">
            {text}&nbsp;&nbsp;&nbsp;
          </p>
        ))}
      </Marquee>

      {/* NAV */}
      <div className="flex justify-between items-center px-3 relative w-full">
        <Link href="/">
          <Image
            src="/logo-orange.png"
            alt="Ikuzo Playstation's Logo"
            title="Ikuzo Playstation's Logo"
            width={0}
            height={0}
            className="w-[110px] md:w-[140px] md:hidden block"
          />
        </Link>

        <div className="flex gap-12 items-center justify-center">
          <div className="lg:flexCenter hidden">
            <Button
              type="button"
              title="RESERVE NOW"
              icon=""
              variant="px-6 py-3 hover:bg-primary duration-700 hover:border-primary font-semibold hover:text-white"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
