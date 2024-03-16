'use client'

import Image from 'next/image'
import React from 'react'

import axios from 'axios'

import Toast from '@/app/components/Toast'
import Layout from '../components/Layout'
import SwiperContentGames from '@/app/components/SwiperContentGames'
import SwiperContentFacilities from '@/app/admin/dashboard/components/SwiperContentFacilities'

function page() {
  const [data, setData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  // Content Games Management
  const [games, setGames] = React.useState([])
  const [facilities, setFacilities] = React.useState([])

  const fetchContents = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/content-${selectedFeature}`,
      )
      if (response.status == 200) {
        const jsonData = await response.data
        if (selectedFeature == 'games') {
          setGames(jsonData.data)
        } else {
          setFacilities(jsonData.data)
        }
        console.log({ jsonData })
        setIsLoading(false)
      } else {
        setIsLoading(false)
        console.error({ error })
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      setIsLoading(false)
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

  const features = [
    {
      id: 'games',
      name: 'Games',
      desc: 'Setup Content Games',
      img: '/game.png',
    },
    {
      id: 'facilities',
      name: 'Facilities',
      desc: 'Setup Content Facilities',
      img: '/sofa.png',
    },
    {
      id: 'sections',
      name: 'Sections',
      desc: 'Setup Content Sections',
      img: '/laptop.png',
    },
  ]

  const [selectedFeature, setSelectedFeature] = React.useState('games')

  React.useEffect(() => {
    fetchContents()
  }, [])

  console.log({ games })
  console.log({ facilities })

  return (
    <Layout>
      <div className="flex flex-col gap-4 w-full mb-6 p-8">
        <div className=" w-fit py-5 text-black bg-white rounded-lg flex flex-row gap-3 items-center">
          <Image
            src={'/checkout.png'}
            width={0}
            height={0}
            alt={'Reservation'}
            className="w-20"
          />

          <div className="flex flex-col">
            <h1 className="text-4xl font-semibold">CMS</h1>
            <p className="text-base font-normal text-gray-400">
              Content Management System Website Ikuzo
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-4 w-full">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={(e) => {
                setSelectedFeature(feature.id)
                fetchContents()
              }}
              className={`flex w-full hover:scale-110 duration-1000 cursor-pointer items-center px-2 py-6 justify-center ${
                selectedFeature == feature.id
                  ? 'bg-orange bg-opacity-5'
                  : 'bg-white'
              } rounded-lg shadow-md`}
            >
              <div className="flex flex-col gap-1 items-center justify-center">
                <Image
                  src={feature.img}
                  alt={'Content Games'}
                  width={0}
                  height={0}
                  className="w-[120px]"
                />

                <div className="flex flex-col justify-center items-center">
                  <h1 className="text-lg font-semibold">{feature.name}</h1>
                  <p className={`text-base font-normal text-gray-400`}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <>
        <div className="px-8">
          {selectedFeature == 'games' && (
            <SwiperContentGames
              games={games}
              fetchContentGames={fetchContents}
            />
          )}

          {selectedFeature == 'facilities' && (
            <SwiperContentFacilities
              facilities={facilities}
              fetchContentFacilities={fetchContents}
            />
          )}
        </div>
      </>
    </Layout>
  )
}

export default page
