'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MdOutlineUpdate } from 'react-icons/md'
import { IoMdBook, IoMdClose } from 'react-icons/io'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/drawer'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Fade } from 'react-awesome-reveal'
import axios from 'axios'

export default function ReservationDrawer({
  number,
  position,
  scale,
  positionData,
  selectedDate,
  onPositionClick,
  reserves = [],
  isSeatInMaintenance = false,
  timeSet = null,
  generatedTimes = [],
  timeArray = [],
  disableTimes = [],
  latestUpdatedAt = '',
  startTime = '',
  endTime = '',
  onStartTimeChange,
  onEndTimeChange,
  facilityPriceData = {},
  formatDateIndonesian,
  formatTimestampIndonesian,
  selectedPosition = null,
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const [drawerContent, setDrawerContent] = useState('default')
  const [filterKeyword, setFilterKeyword] = useState('')
  const [filteredCatalogs, setFilteredCatalogs] = useState([])
  const [catalogs, setCatalogs] = useState([])
  const [catalogUpdatedAt, setCatalogUpdatedAt] = useState('')

  const isSelected = selectedPosition === number

  const handleCatalogClick = async () => {
    try {
      const response = await axios.get(`${baseUrl}/catalogs?no_seat=${number}`)
      if (response.data && response.data.length > 0) {
        const sortedCatalogs = response.data.sort((a, b) =>
          a.catalog_txt.localeCompare(b.catalog_txt),
        )
        const latestUpdated = response.data.reduce((latest, catalog) => {
          return new Date(catalog.updated_at) > new Date(latest.updated_at)
            ? catalog
            : latest
        }, response.data[0]).updated_at

        setDrawerContent('catalog')
        setCatalogs(sortedCatalogs)
        setCatalogUpdatedAt(latestUpdated)
      } else {
        setDrawerContent('catalog')
        setCatalogs([])
      }
    } catch (error) {
      setDrawerContent('catalog')
      setCatalogs([])
      console.error('Error fetching catalog data:', error)
    }
  }

  const handleCloseCatalogClick = () => {
    setDrawerContent('default')
    setFilterKeyword('')
    setFilteredCatalogs([])
  }

  const handleInputFilterCatalogChange = (e) => {
    const keyword = e.target.value.toLowerCase()
    setFilterKeyword(e.target.value)
    const filtered = catalogs.filter((catalog) =>
      catalog.catalog_txt.toLowerCase().includes(keyword),
    )
    setFilteredCatalogs(filtered)
  }

  const getFacilityPrices = () => {
    return facilityPriceData?.prices || []
  }

  const getFacilityCustomPrices = () => {
    return facilityPriceData?.['custom-prices'] || []
  }

  return (
    <Drawer
      onClose={() => {
        setDrawerContent('default')
        handleCloseCatalogClick()
      }}
      key={number}
    >
      <DrawerTrigger asChild>
        <div
          className={`cursor-pointer md:w-28 md:h-28 w-8 h-8 border rounded-lg py-2 flex-col items-center justify-center flex transition-all duration-300 ${
            isSelected && startTime != '' && endTime != ''
              ? 'border-green-500 bg-green-500 bg-opacity-25 text-white'
              : 'border-gray-400 bg-gray-900 bg-opacity-20 text-white'
          }`}
          onClick={() => onPositionClick(number, selectedDate)}
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          }}
        >
          <p className="opacity-100 text-xs py-2 text-white">Reg</p>
        </div>
      </DrawerTrigger>

      <DrawerContent className="active:border-none border-none outline-none md:max-w-3xl md:mx-auto pb-5">
        <DrawerHeader className="text-left">
          <DrawerTitle>{positionData?.name}</DrawerTitle>
          <DrawerDescription>
            Can only accommodate {positionData?.capacity} person (position{' '}
            {number}).
          </DrawerDescription>
          <DrawerDescription className="flex flex-col gap-0 mt-0 pt-0">
            <span className="font-semibold">Price on:</span>
            {getFacilityPrices().map((price, index) => (
              <span key={index}>
                • {price.day} - IDR {price.price}/hour
              </span>
            ))}
            {getFacilityCustomPrices().map((price, index) => (
              <span key={index}>
                • {price.keterangan}, {formatDateIndonesian(price.date)} - IDR{' '}
                {price.price}/hour
              </span>
            ))}
          </DrawerDescription>
        </DrawerHeader>

        {drawerContent !== 'default' && (
          <>
            <input
              value={filterKeyword}
              onChange={handleInputFilterCatalogChange}
              placeholder="Search game"
              className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 mx-5 !py-2"
            />
            {(catalogs.length !== 0 || filteredCatalogs.length !== 0) && (
              <span className="text-gray-400 text-sm mx-5 flex mt-2 items-center gap-1">
                <MdOutlineUpdate className="text-lg" />
                Last updated at {formatTimestampIndonesian(catalogUpdatedAt)}
              </span>
            )}
          </>
        )}

        {timeSet === null ? (
          <NoContentMessage message="Oops!!! Sorry Ikuzo, this space is closed not operating today." />
        ) : drawerContent === 'default' ? (
          <DefaultDrawerContent
            positionData={positionData}
            reserves={reserves}
            isSeatInMaintenance={isSeatInMaintenance}
            generatedTimes={generatedTimes}
            timeArray={timeArray}
            disableTimes={disableTimes}
            startTime={startTime}
            endTime={endTime}
            selectedDate={selectedDate}
            onStartTimeChange={onStartTimeChange}
            onEndTimeChange={onEndTimeChange}
          />
        ) : catalogs.length > 0 ? (
          <CatalogGrid
            catalogs={catalogs}
            filteredCatalogs={filteredCatalogs}
            filterKeyword={filterKeyword}
          />
        ) : (
          <NoContentMessage message="There is no any contents right now ikuzo!" />
        )}

        <DrawerFooter
          drawerContent={drawerContent}
          timeSet={timeSet}
          isSeatInMaintenance={isSeatInMaintenance}
          number={number}
          onCatalogClick={handleCatalogClick}
          onCloseCatalogClick={handleCloseCatalogClick}
        />
      </DrawerContent>
    </Drawer>
  )
}

// Sub-components
function NoContentMessage({ message }) {
  return (
    <div className="w-full mt-10 mb-8 flex items-center justify-center">
      <div className="flex flex-col gap-1 items-center justify-center">
        <Image
          src="/error.png"
          width={150}
          height={150}
          alt="No content available"
        />
        <p className="text-base font-normal text-gray-400">{message}</p>
      </div>
    </div>
  )
}

function DefaultDrawerContent({
  positionData,
  reserves,
  isSeatInMaintenance,
  generatedTimes,
  timeArray,
  disableTimes,
  startTime,
  endTime,
  selectedDate,
  onStartTimeChange,
  onEndTimeChange,
}) {
  return (
    <div className="flex-relative w-full h-fit px-5">
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${positionData?.pict}`}
          alt={positionData?.name || 'Position'}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      {reserves.length > 0 && !isSeatInMaintenance && (
        <Fade>
          <div className="flex gap-1 w-full my-2">
            <div className="flex flex-col gap-2 w-full flex-1">
              <label className="text-sm">Reserved Times</label>
              <div className="flex flex-row flex-wrap gap-1">
                {reserves.map((reserve, index) => {
                  // Find saving_times that match the date AND is_active = 'Active'
                  const matchingSavingTime = reserve.saving_times?.find(
                    (saveTime) => {
                      const savingDate =
                        saveTime.date_saving?.split('T')[0] ||
                        saveTime.date_saving
                      const isActive = saveTime.is_active?.trim() === 'Active'
                      return savingDate === selectedDate && isActive
                    },
                  )

                  const startTime = matchingSavingTime
                    ? matchingSavingTime.start_time_saving
                    : reserve.reserve_start_time

                  const endTime = matchingSavingTime
                    ? matchingSavingTime.end_time_saving
                    : reserve.reserve_end_time

                  return (
                    <div
                      key={index}
                      className={`text-xs px-2 py-1 border ${
                        reserve.status_reserve === 'pending'
                          ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                          : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                      } rounded-md w-fit`}
                    >
                      {startTime} - {endTime} WIB
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Fade>
      )}

      {!isSeatInMaintenance && (
        <TimeSelector
          generatedTimes={generatedTimes}
          timeArray={timeArray}
          disableTimes={disableTimes}
          startTime={startTime}
          endTime={endTime}
          onStartTimeChange={onStartTimeChange}
          onEndTimeChange={onEndTimeChange}
        />
      )}
    </div>
  )
}

function TimeSelector({
  generatedTimes,
  timeArray,
  disableTimes,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
}) {
  return (
    <Fade>
      <div className="flex gap-1 w-full mt-2 mb-3">
        <div className="flex flex-col gap-2 w-full flex-1">
          <label className="text-sm">Start Time</label>
          <Select value={startTime} onValueChange={onStartTimeChange}>
            <SelectTrigger className="py-5 px-3 text-sm">
              <SelectValue placeholder="00.00" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-sm">Pilih Waktu Mulai</SelectLabel>
                {generatedTimes.map((time, index) => (
                  <SelectItem key={index} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 w-full flex-1">
          <label className="text-sm">End Time</label>
          <Select value={endTime} onValueChange={onEndTimeChange}>
            <SelectTrigger className="py-5 px-3 text-sm">
              <SelectValue placeholder="00.00" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-sm">
                  Pilih Waktu Berakhir
                </SelectLabel>
                {startTime !== '' && timeArray.length !== 0 ? (
                  timeArray.map((time, index) => (
                    <SelectItem
                      key={index}
                      value={time}
                      disabled={disableTimes.includes(time)}
                    >
                      {time}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="00.00" disabled>
                    <p className="text-gray-500">
                      Waktu yang kamu pilih sudah terisi. Silakan pilih waktu
                      bermain di jam yang lain
                    </p>
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Fade>
  )
}

function CatalogGrid({ catalogs, filteredCatalogs, filterKeyword }) {
  const displayCatalogs =
    filteredCatalogs.length > 0 ? filteredCatalogs : catalogs

  if (filteredCatalogs.length === 0 && filterKeyword !== '') {
    return (
      <NoContentMessage message="There is no any contents right now ikuzo!" />
    )
  }

  return (
    <div
      className={`grid ${
        filteredCatalogs.length === 0 && filterKeyword !== ''
          ? 'grid-cols-1'
          : 'grid-cols-3'
      } gap-4 ${
        catalogs.length > 9 ? 'h-[350px]' : 'h-fit'
      } overflow-y-scroll py-4 px-7`}
    >
      {displayCatalogs.map((catalog, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 items-center justify-center"
        >
          <Image
            alt={catalog.catalog_img}
            width={200}
            height={110}
            className="rounded-lg w-full h-[110px] object-cover"
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${catalog.catalog_img}`}
          />
          <p className="text-gray-500 text-sm text-center leading-[100%]">
            {catalog.catalog_txt.substring(0, 10) + '...'}
          </p>
        </div>
      ))}
    </div>
  )
}

function DrawerFooter({
  drawerContent,
  timeSet,
  isSeatInMaintenance,
  number,
  onCatalogClick,
  onCloseCatalogClick,
}) {
  if (drawerContent === 'default') {
    return (
      <div className="flex flex-col gap-2 px-5 mt-3">
        {timeSet !== null && !isSeatInMaintenance && (
          <DrawerClose asChild>
            <Button className="bg-orange text-white border-orange py-5">
              Continue
            </Button>
          </DrawerClose>
        )}
        <Button
          variant="outline"
          className="bg-transparent text-orange border-orange py-5"
          onClick={onCatalogClick}
        >
          <IoMdBook className="text-lg mr-2" /> Lihat Catalog Game
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      className="bg-transparent text-orange border-orange py-5 mx-5"
      onClick={onCloseCatalogClick}
    >
      <IoMdClose className="text-lg mr-2" /> Close Catalog
    </Button>
  )
}
