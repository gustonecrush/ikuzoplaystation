import React from 'react'
import './scroll-down.css'
import Link from 'next/link'

const ScrollDown = () => {
  return (
    <Link
      href={'#reserve'}
      class="container  z-50 relative w-full  scroll-smooth mt-10 left-[38.5%]"
    >
      <div class="chevron"></div>
      <div class="chevron"></div>
      <div class="chevron"></div>
      <span class="text">Scroll down</span>
    </Link>
  )
}

export default ScrollDown
