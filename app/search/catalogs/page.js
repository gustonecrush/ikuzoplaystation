'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiSearch } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { HashLoader } from 'react-spinners'
import { IoArrowBack } from 'react-icons/io5'
import getDocument from '@/firebase/firestore/getData'
import LoaderHome from '@/app/components/LoaderHome'
import SwiperContainerCatalogs from '@/app/components/SwiperContainerCatalogs'
import { getFacilityId } from '@/utils/text'
import { DrawerDescription } from '@/components/ui/drawer'

const Page = () => {
  const [catalogTxt, setCatalogTxt] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)
  const [catalogs, setCatalogs] = useState([])

  const [familyVIPRoomData, setFamilyVIPRoomData] = useState(null)
  const [lovebirdsVIPRoomData, setLovebirdsVIPRoomData] = useState(null)
  const [familyOpenSpaceData, setFamilyOpenSpaceData] = useState(null)
  const [squadOpenSpaceData, setSquadOpenSpaceData] = useState(null)
  const [ps4RegulerData, setPs4RegulerData] = useState(null)
  const [ps5RegulerData, setPs5RegulerData] = useState(null)
  const [ikuzoRacingSimulatorData, setIkuzoRacingSimulatorData] = useState(null)

  async function fetchDataPrices() {
    const dataFamilyRoom = await getDocument(
      'facility-setting-prices',
      'family-vip-room',
    )
    const dataLovebirdsRoom = await getDocument(
      'facility-setting-prices',
      'lovebirds-vip-room',
    )
    const dataFamilySpace = await getDocument(
      'facility-setting-prices',
      'family-open-space',
    )
    const dataSquadOpenSpace = await getDocument(
      'facility-setting-prices',
      'squad-open-space',
    )
    const dataPs4Reguler = await getDocument(
      'facility-setting-prices',
      'ps4-reguler',
    )
    const dataPs5Reguler = await getDocument(
      'facility-setting-prices',
      'ps5-reguler',
    )
    const dataIkuzoRacingSimulator = await getDocument(
      'facility-setting-prices',
      'ikuzo-racing-simulator',
    )
    setFamilyVIPRoomData(dataFamilyRoom.data)
    setLovebirdsVIPRoomData(dataLovebirdsRoom.data)
    setSquadOpenSpaceData(dataSquadOpenSpace.data)
    setPs4RegulerData(dataPs4Reguler.data)
    setPs5RegulerData(dataPs5Reguler.data)
    setIkuzoRacingSimulatorData(dataIkuzoRacingSimulator.data)
    setFamilyOpenSpaceData(dataFamilySpace.data)
  }

  const [searchContent, setSearchContent] = useState(null)

  async function fetchDataContents() {
    const dataContentSearch = await getDocument('search-id', 'search-id-doc')
    setSearchContent(dataContentSearch.data)
  }

  const getAllDataCatalogs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/catalogs`,
      )

      setCatalogs(response.data)
      console.log(response)
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

  console.log({ catalogs })

  const handleSearch = async () => {
    if (catalogTxt) {
      setIsLoadingSearch(true)
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/search?catalog_txt=${catalogTxt}`,
        )
        setSearchResults(response.data)
        setIsLoadingSearch(false)
        setIsEmpty(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsEmpty(true)
        setSearchResults(null)
        setIsLoadingSearch(false)
      }
    }
  }

  console.log({ searchContent })

  const handleChange = (e) => {
    setCatalogTxt(e.target.value)
  }

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0
      setScrolled(isScrolled)
    }

    fetchDataContents()
    getAllDataCatalogs()
    fetchDataPrices()

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const dataFacility = [
    {
      name: 'PS5 Reguler',
      price: 20000,
      capacity: 2,
      description:
        '1-2 Person Capacity, Free Smoking Area, Free Wifi Access, 8-12 Common Games Collection, General Staff Assistance, Offline Games Only.',
    },
    {
      name: 'Ikuzo Racing Simulator',
      price: 50000,
      capacity: 1,
      description:
        '1 Person Capacity, Online Multiplayer Support, 6-8 Racing Games Collection, Expert Staff Assistance, VR Mode Add-on available.',
    },
    {
      name: 'PS5 Reguler',
      price: 35000,
      capacity: 4,
      description:
        '2-4 Person Capacity, 20+ Premium Games Collection, AC & Fresh Atmosphere, No Smoking Area, Free Wifi Access, Expert Staff Assistance, Offline Games Only.',
    },
    {
      name: 'Playstation 2',
      price: 12000,
      capacity: 4,
      description:
        '2-4 Person Capacity, 30+ Memorable Games Collection, Memory Card Included, Bean Bag Sofa, No Smoking Area, AC & Semi Private Area, Free Wifi Access, Expert Staff Assistance, Offline Games Only.',
    },
    {
      name: 'Family Open Space',
      price: 50000,
      capacity: 8,
      description:
        'Relax with family in an open space designed for creating warm moments, equipped with sofas and beanbags. Max capacity: 8.',
    },
    {
      name: 'Squad Open Space',
      price: 40000,
      capacity: 4,
      description:
        'Perfect for group gaming, equipped with beanbags for added comfort. Max capacity: 4.',
    },
    {
      name: 'Family VIP Room',
      price: 80000,
      capacity: 8,
      description:
        'Premium space for family gaming with 55” 4K display and Dolby Atmos. Max capacity: 8.',
    },
    {
      name: 'LoveBirds VIP Room',
      price: 60000,
      capacity: 2,
      description:
        'Exclusive room for couples with a 50” 4K screen and soundbar. Max capacity: 2.',
    },
    {
      name: 'PS4 Reguler',
      price: 15000,
      capacity: 2,
      description:
        '1-2 Person Capacity, Free Smoking Area, Free Wifi Access, 8-12 Common Games Collection, General Staff Assistance, Offline Games Only.',
    },
  ]

  function mapSeatToFacility(no_seat) {
    const facilityMapping = {
      'PS4 Reguler': [1, 2, 3, 4],
      'Ikuzo Racing Simulator': [6, 7],
      'PS5 Reguler': [5, 8],
      'Squad Open Space': [13, 14, 15, 16],
      'Family Open Space': [17],
      'Family VIP Room': [18, 19],
      'LoveBirds VIP Room': [20, 21, 22],
    }

    // Map seat numbers to their respective facilities
    const mappedFacilities = no_seat.map((seat) => {
      for (const [facilityName, seats] of Object.entries(facilityMapping)) {
        if (seats.includes(seat)) {
          return facilityName
        }
      }
      return 'Unknown' // Default if no mapping found
    })

    // Remove duplicates and filter 'Unknown'
    const uniqueFacilities = [...new Set(mappedFacilities)].filter(
      (facility) => facility !== 'Unknown',
    )

    // Get facility details from `dataFacility`
    const facilityDetails = uniqueFacilities.map(
      (facilityName) =>
        dataFacility.find((facility) => facility.name === facilityName) || {
          name: facilityName,
          price: 0,
          capacity: 0,
          description: 'No details available.',
        },
    )

    return facilityDetails
  }

  return (
    <section className="px-5 py-10">
      {searchContent != null &&
      familyVIPRoomData != null &&
      familyOpenSpaceData != null &&
      squadOpenSpaceData != null &&
      lovebirdsVIPRoomData != null &&
      ps4RegulerData != null &&
      ps5RegulerData != null &&
      ikuzoRacingSimulatorData != null ? (
        <>
          {' '}
          <Link
            href={'/'}
            onClick={() => {
              setIsEmpty(true)
              setSearchResults(null)
              setIsLoadingSearch(false)
              setCatalogTxt('')
            }}
            className="rounded-full  h-15 w-fit flex items-center justify-center p-2 bg-orange text-white text-xl"
          >
            <IoArrowBack />
          </Link>
          <div className="w-full mt-10">
            <div className="mb-3">
              <h1 className="font-semibold text-2xl">
                {searchContent['search-title-page']}
              </h1>
              <p className="text-gray-500 leading-none">
                {searchContent['search-desc-page']}
              </p>
            </div>

            <div className="w-full">
              <input
                type="text"
                placeholder={searchContent['search-input-page']}
                value={catalogTxt}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded text-gray-500"
              />
              {!isLoadingSearch && (
                <Button
                  onClick={handleSearch}
                  className="w-full bg-orange -mt-1 text-white"
                >
                  {searchContent['search-btn-page']}
                </Button>
              )}

              {/* Display Results */}
              <div
                className={`${
                  catalogTxt == ''
                    ? 'h-full overflow-y-auto'
                    : 'h-[750px] overflow-y-scroll'
                }`}
              >
                {isLoadingSearch ? (
                  <div className="flex items-center justify-center p-10 pt-20">
                    <HashLoader color="#FF6200" />
                  </div>
                ) : catalogTxt != '' ? (
                  searchResults != null &&
                  Object.keys(searchResults).length > 0 &&
                  !isEmpty ? (
                    <div className="mt-4">
                      {Object.keys(searchResults).map((catalog_txt, index) => (
                        <div
                          key={index}
                          className="border-b border-b-gray-400 py-5"
                        >
                          <h3 className="text-xl font-bold">{catalog_txt}</h3>
                          <img
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${searchResults[catalog_txt].catalog_img}`}
                            alt={catalog_txt}
                            className="w-[150px] object-cover mb-2"
                          />

                          <p className="text-gray-600">
                            Available on:{' '}
                            <span className="font-semibold flex flex-col">
                              <span>
                                {' '}
                                <ul className="list-decimal pl-6">
                                  {(() => {
                                    const facilities = mapSeatToFacility(
                                      searchResults[catalog_txt]?.no_seat,
                                    )
                                    return facilities.map((facility, index) => (
                                      <li key={index}>
                                        {facility.name}

                                        <div className="flex flex-col gap-0 mt-0 pt-0">
                                          <span className="font-semibold">
                                            Price on:
                                          </span>
                                          <ul className="list-disc pl-6">
                                            {(() => {
                                              const facilityId = getFacilityId(
                                                facility.name,
                                              )

                                              const priceData =
                                                facilityId === 'ps5-reguler'
                                                  ? ps5RegulerData.prices
                                                  : facilityId ===
                                                    'ikuzo-racing-simulator'
                                                  ? ikuzoRacingSimulatorData.prices
                                                  : facilityId === 'ps4-reguler'
                                                  ? ps4RegulerData.prices
                                                  : facilityId ===
                                                    'family-vip-room'
                                                  ? familyVIPRoomData.prices
                                                  : facilityId ===
                                                    'lovebirds-vip-room'
                                                  ? lovebirdsVIPRoomData.prices
                                                  : facilityId ===
                                                    'family-open-space'
                                                  ? familyOpenSpaceData.prices
                                                  : facilityId ===
                                                    'squad-open-space'
                                                  ? squadOpenSpaceData.prices
                                                  : []

                                              return priceData.length > 0
                                                ? priceData.map(
                                                    (price, index) => (
                                                      <li
                                                        key={index}
                                                        className="font-normal"
                                                      >
                                                        {price.day} - IDR{' '}
                                                        {price.price}
                                                        /hour
                                                      </li>
                                                    ),
                                                  )
                                                : null
                                            })()}
                                          </ul>
                                        </div>
                                      </li>
                                    ))
                                  })()}
                                </ul>
                              </span>
                              <Link
                                href={'/reservation'}
                                className="text-orange font-normal"
                              >
                                Reservation Now
                              </Link>
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full mt-20 mb-8  flex items-center justify-center">
                      <div className="flex flex-col gap-1 w-full items-center justify-center">
                        <Image
                          src={'/error.png'}
                          width={0}
                          height={0}
                          className="w-[150px]"
                          alt={'No content available'}
                        />
                        <p className="text-base font-normal text-gray-400">
                          There is no any contents right now ikuzo!
                        </p>
                      </div>
                    </div>
                  )
                ) : catalogs?.length > 0 ? (
                  <SwiperContainerCatalogs games={catalogs} />
                ) : (
                  <div className="flex items-center justify-center p-10 pt-20">
                    <HashLoader color="#FF6200" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <LoaderHome />
      )}
    </section>
  )
}

export default Page
