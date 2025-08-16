import React from 'react'
import './scroll-down.css'
import Link from 'next/link'

const ScrollDown = () => {
  return (
    <Link
      href={'#reserve'}
      className="container  z-50 relative w-full  scroll-smooth  left-[38.5%] md:left-[47%]"
    >
      <div className="chevron"></div>
      <div className="chevron"></div>
      <div className="chevron"></div>
      <span className="text">Scroll down</span>
    </Link>
  )
}

export default ScrollDown
