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

const Page = () => {
  const [catalogTxt, setCatalogTxt] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)

  const [searchContent, setSearchContent] = useState(null)

  async function fetchDataContents() {
    const dataContentSearch = await getDocument('search-id', 'search-id-doc')
    setSearchContent(dataContentSearch.data)
  }

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
      {searchContent != null ? (
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
              <div className="h-[450px] overflow-y-scroll">
                {isLoadingSearch ? (
                  <div className="flex items-center justify-center p-10 pt-20">
                    <HashLoader color="#FF6200" />
                  </div>
                ) : searchResults != null &&
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
                              {(() => {
                                const facilities = mapSeatToFacility(
                                  searchResults[catalog_txt].no_seat,
                                )
                                return facilities.length > 1
                                  ? facilities
                                      .map(
                                        (facility) =>
                                          `${facility.name} (Capacity: ${facility.capacity}, Price: IDR ${facility.price})`,
                                      )
                                      .join(' and ')
                                  : `${facilities[0].name} (Capacity: ${facilities[0].capacity}, Price: IDR ${facilities[0].price})`
                              })()}
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
