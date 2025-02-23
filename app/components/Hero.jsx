'use client'

import axios from 'axios'
import React from 'react'
import Toast from './Toast'
import Image from 'next/image'
import FadeContainer from './FadeContainer'
import ScrollDown from './ScrollDown'

function Hero({ children }) {
  const [contents, setContents] = React.useState([])

  const fetchContents = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/content-sections`,
      )
      if (response.status == 200) {
        const jsonData = response.data
        setContents(jsonData.data)
      } else {
        console.error({ error })
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      console.error({ error })
      if (error.code == 'ERR_NETWORK') {
        Toast.fire({
          icon: 'error',
          title: `Data tidak dapat ditampilkan. Koneksi anda terputus, cek jaringan anda!`,
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: `Internal server sedang error, coba lagi nanti!`,
        })
      }
    }
  }

  console.log({ contents })

  React.useEffect(() => {
    fetchContents()
  }, [])
  return (
    <section className="flex flex-col relative items-center justify-center bg-black bg-opacity-35 h-full w-full">
      {children}
      {contents.map(
        (content, index) =>
          index == 0 && (
            <FadeContainer key={index}>
              <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 w-full px-3 items-center justify-center md:-mt-5">
                <Image
                  src="/logo-orange.png"
                  alt="Ikuzo Playstation's Logo"
                  title="Ikuzo Playstation's Logo"
                  width={0}
                  height={0}
                  className="w-[110px] md:w-[140px] md:block hidden"
                />
                <h1 className="text-orange font-extrabold font-montserrat text-5xl leading-none text-center md:text-[5.5rem] md:-mt-5">
                  {content.title}
                </h1>
                <p className="text-white font-normal text-center text-base md:text-lg">
                  {content.description}
                </p>
                <ScrollDown />
              </div>
            </FadeContainer>
          ),
      )}
    </section>
  )
}

export default Hero
