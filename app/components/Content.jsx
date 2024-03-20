'use client'
import axios from 'axios'
import React from 'react'
import Toast from './Toast'
import BounceContainer from './BounceContainer'
import Image from 'next/image'
import Link from 'next/link'

function Content() {
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

  React.useEffect(() => {
    fetchContents()
  }, [])
  return (
    <div>
      {contents.map(
        (content, index) =>
          index != 0 && <DynamicSection content={content} key={index} />,
      )}
    </div>
  )
}

function ReserveButton({ content }) {
  return (
    <Link
      href={content.link_button}
      className="bg-orange text-white border-orange py-2 rounded-full text-base mt-4 mb-20 w-fit px-10 relative font-semibold duration-1000 hover:bg-yellow-700"
    >
      {content.label_button}
    </Link>
  )
}

function DynamicSection({ content }) {
  return (
    <BounceContainer>
      <div className="flex bg-black bg-opacity-35 flex-col relative items-center justify-center">
        <Image
          className="-z-50 w-full h-screen object-cover bg-opacity-10"
          alt={content.name}
          width={0}
          height={0}
          priority
          title={content.name}
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${content.content}`}
        />

        <div className="absolute w-full md:w-1/2 px-2 flex items-center justify-center flex-col gap-2 left-1/2 transform -translate-x-1/2 top-1/2 z-40 -translate-y-1/2">
          <h1 className="text-orange font-extrabold font-montserrat text-5xl leading-none text-center md:text-[5rem] md:mt-16">
            {content.title}
          </h1>
          <p className="text-white font-normal text-center text-base md:text-lg">
            {content.description}
          </p>

          {content.is_button == 'true' && <ReserveButton content={content} />}
        </div>
      </div>
    </BounceContainer>
  )
}

export default Content
