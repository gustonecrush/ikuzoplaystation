import React, { useState } from 'react'

// Reusable Reservation Button Component
const ReservationButton = ({
  number,
  position,
  scale,
  label,
  onClick,
  className = '',
}) => (
  <div
    className={`cursor-pointer md:w-28 md:h-28 w-8 h-8 border border-gray-400 bg-gray-900 bg-opacity-20 text-white rounded-lg py-2 flex-col items-center justify-center flex ${className}`}
    onClick={onClick}
    style={{
      transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
    }}
  >
    <p className="opacity-100 text-xs py-2 text-white text-center leading-none">
      {label}
    </p>
  </div>
)

// Reusable Reserved Times Display
const ReservedTimesList = ({ reserves, selectedDate }) => {
  if (!reserves || reserves.length === 0) return null

  return (
    <div className="flex gap-1 w-full my-2 px-5">
      <div className="flex flex-col gap-2 w-full flex-1">
        <label className="text-sm">Reserved Times</label>
        <div className="flex flex-row flex-wrap gap-1">
          {reserves.map((reserve, index) => {
            const matchingSavingTime = reserve.saving_times?.find(
              (saveTime) => {
                const savingDate =
                  saveTime.date_saving?.split('T')[0] || saveTime.date_saving
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
                className={`text-xs px-2 py-1 border rounded-md w-fit ${
                  reserve.status_reserve === 'pending'
                    ? 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                    : 'border-red-500 bg-red-500 bg-opacity-10 text-red-500'
                }`}
              >
                {startTime} - {endTime} WIB
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Reusable Time Selection Component
const TimeSelection = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  generatedTimes,
  timeArray,
  disableTimes,
}) => (
  <div className="flex gap-1 w-full mt-2 mb-3 px-5">
    <div className="flex flex-col gap-2 w-full flex-1">
      <label htmlFor="start-time" className="text-sm">
        Start Time
      </label>
      <select
        id="start-time"
        value={startTime}
        onChange={(e) => onStartTimeChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Select Start Time</option>
        {generatedTimes.map((time, index) => (
          <option key={index} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>

    <div className="flex flex-col gap-2 w-full flex-1">
      <label htmlFor="end-time" className="text-sm">
        End Time
      </label>
      <select
        id="end-time"
        value={endTime}
        onChange={(e) => onEndTimeChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        disabled={!startTime}
      >
        <option value="">Select End Time</option>
        {startTime && timeArray.length > 0 ? (
          timeArray.map((time, index) => (
            <option
              key={index}
              value={time}
              disabled={disableTimes.includes(time)}
            >
              {time}
            </option>
          ))
        ) : (
          <option value="00.00">No available time slots</option>
        )}
      </select>
    </div>
  </div>
)

// Reusable Price Display Component
const PriceDisplay = ({
  facilityName,
  priceData,
  getFacilityId,
  formatDateIndonesian,
}) => {
  const facilityId = getFacilityId(facilityName)
  const prices = priceData[facilityId]?.prices || []
  const customPrices = priceData[facilityId]?.['custom-prices'] || []

  return (
    <div className="flex flex-col gap-0 mt-0 pt-0">
      <span className="font-semibold">Price on:</span>
      {prices.map((price, index) => (
        <span key={`price-${index}`}>
          • {price.day} - IDR {price.price}/hour
        </span>
      ))}
      {customPrices.map((price, index) => (
        <span key={`custom-${index}`}>
          • {price.keterangan}, {formatDateIndonesian(price.date)} - IDR{' '}
          {price.price}/hour
        </span>
      ))}
    </div>
  )
}

// Main Drawer Component
const ReservationDrawer = ({
  isOpen,
  onClose,
  position,
  facilityData,
  reserves,
  selectedDate,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  generatedTimes,
  timeArray,
  disableTimes,
  priceData,
  getFacilityId,
  formatDateIndonesian,
  imageUrl,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white rounded-t-lg md:rounded-lg w-full md:max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">{facilityData.name}</h2>
              <p className="text-sm text-gray-600 mt-1">
                IDR {facilityData.price}/hour - Capacity:{' '}
                {facilityData.capacity} person(s) (Position {position})
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <PriceDisplay
            facilityName={facilityData.name}
            priceData={priceData}
            getFacilityId={getFacilityId}
            formatDateIndonesian={formatDateIndonesian}
          />

          <div className="my-4 rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={facilityData.name}
              className="w-full h-auto"
            />
          </div>

          <ReservedTimesList reserves={reserves} selectedDate={selectedDate} />

          <TimeSelection
            startTime={startTime}
            endTime={endTime}
            onStartTimeChange={onStartTimeChange}
            onEndTimeChange={onEndTimeChange}
            generatedTimes={generatedTimes}
            timeArray={timeArray}
            disableTimes={disableTimes}
          />

          <button
            onClick={onClose}
            className="w-full bg-orange-500 text-white py-3 rounded-lg mt-4 hover:bg-orange-600 transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

const FloorMapReservation = ({
  selectedReservationPlace,
  selectedDate,
  position,
  scale,
  imageRef,
  handleZoomIn,
  handleZoomOut,
  positions,
  reserves,
  startTimeReservasi,
  endTimeReservasi,
  setStartTimeReservasi,
  setEndTimeReservasi,
  setPosisiReservasi,
  setNamaPosisiReservasi,
  setPricePerReserve,
  getPriceSetForToday,
  fetchingAvailableReservation,
  getPriceDataCustom,
  generatedTimes,
  timeArray,
  disableTimes,
  priceData,
  getFacilityId,
  formatDateIndonesian,
}) => {
  const [activeDrawer, setActiveDrawer] = useState(null)

  const handleButtonClick = (number, positionData) => {
    setPosisiReservasi(number)
    setNamaPosisiReservasi(positionData.name)
    setPricePerReserve(positionData.price)
    getPriceSetForToday(positionData.name, selectedDate)
    fetchingAvailableReservation(selectedDate, number)
    getPriceDataCustom(positionData.name)
    setActiveDrawer(number)
  }

  const renderRegularSpace = () => {
    if (selectedReservationPlace !== 'regular-space' || !selectedDate)
      return null

    const topButtons = [1, 2, 3, 4, 5].map((num) => ({
      number: num,
      position: num <= 4 ? positions[6] : positions[0],
      label: 'Reg',
    }))

    const bottomLeftButtons = [6, 7].map((num) => ({
      number: num,
      position: positions[1],
      label: 'Sim',
    }))

    const bottomRightButton = {
      number: 8,
      position: positions[0],
      label: 'Reg',
    }

    return (
      <>
        {/* Top Row */}
        <div
          className="flex flex-row justify-around w-full top-24 absolute z-50"
          ref={imageRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: 'move',
          }}
        >
          {topButtons.map(({ number, position: pos, label }) => (
            <ReservationButton
              key={number}
              number={number}
              position={position}
              scale={scale}
              label={label}
              onClick={() => handleButtonClick(number, pos)}
            />
          ))}
        </div>

        {/* Bottom Left */}
        <div
          className="flex flex-row justify-around w-72 bottom-10 absolute z-50 left-10 md:left-32"
          ref={imageRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: 'move',
          }}
        >
          {bottomLeftButtons.map(({ number, position: pos, label }) => (
            <ReservationButton
              key={number}
              number={number}
              position={position}
              scale={scale}
              label={label}
              onClick={() => handleButtonClick(number, pos)}
              className={number === 7 ? 'ml-10' : ''}
            />
          ))}
        </div>

        {/* Bottom Right */}
        <div
          className="flex flex-row w-fit bottom-10 absolute z-50 left-40 -ml-2 md:left-[53.5%]"
          ref={imageRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: 'move',
          }}
        >
          <ReservationButton
            number={bottomRightButton.number}
            position={position}
            scale={scale}
            label={bottomRightButton.label}
            onClick={() =>
              handleButtonClick(
                bottomRightButton.number,
                bottomRightButton.position,
              )
            }
          />
        </div>
      </>
    )
  }

  const renderPremiumSpace = () => {
    if (selectedReservationPlace !== 'premium-space' || !selectedDate)
      return null

    const squadButtons = [13, 14, 15, 16].map((num) => ({
      number: num,
      position: positions[3],
      label: 'Squad Open Space',
    }))

    const familyButton = {
      number: 17,
      position: positions[2],
      label: 'Family Open Space',
    }

    return (
      <>
        {/* Squad Buttons */}
        <div
          className="flex flex-row w-[80%] gap-32 md:gap-44 absolute left-7 md:top-20 ml-20 md:ml-40 z-50"
          ref={imageRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: 'move',
          }}
        >
          {squadButtons.map(({ number, position: pos, label }) => (
            <ReservationButton
              key={number}
              number={number}
              position={position}
              scale={scale}
              label={label}
              onClick={() => handleButtonClick(number, pos)}
            />
          ))}
        </div>

        {/* Family Button */}
        <div
          className="flex flex-row w-auto bottom-32 gap-16 absolute left-[46%] z-50"
          ref={imageRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: 'move',
          }}
        >
          <ReservationButton
            number={familyButton.number}
            position={position}
            scale={scale}
            label={familyButton.label}
            onClick={() =>
              handleButtonClick(familyButton.number, familyButton.position)
            }
            className="w-16 h-10"
          />
        </div>
      </>
    )
  }

  const renderPrivateSpace = () => {
    if (selectedReservationPlace !== 'private-space' || !selectedDate)
      return null

    const familyVIPButtons = [18, 19].map((num) => ({
      number: num,
      position: positions[4],
      label: 'Family VIP Room',
    }))

    const lovebirdsButtons = [20, 21, 22].map((num) => ({
      number: num,
      position: positions[5],
      label: 'LoveBirds VIP Room',
    }))

    return (
      <>
        {/* Family VIP */}
        <div
          className="flex flex-row w-full justify-between items-center absolute md:top-36 z-50 px-56"
          ref={imageRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: 'move',
          }}
        >
          {familyVIPButtons.map(({ number, position: pos, label }) => (
            <ReservationButton
              key={number}
              number={number}
              position={position}
              scale={scale}
              label={label}
              onClick={() => handleButtonClick(number, pos)}
              className="w-20 h-10"
            />
          ))}
        </div>

        {/* Lovebirds VIP */}
        <div
          className="flex flex-row w-full bottom-52 gap-60 md:gap-80 absolute left-6 md:left-48 z-50"
          ref={imageRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: 'move',
          }}
        >
          {lovebirdsButtons.map(({ number, position: pos, label }) => (
            <ReservationButton
              key={number}
              number={number}
              position={position}
              scale={scale}
              label={label}
              onClick={() => handleButtonClick(number, pos)}
              className="w-20 h-10"
            />
          ))}
        </div>
      </>
    )
  }

  const getImageSrc = () => {
    if (selectedReservationPlace === 'regular-space') return '/first-floor.jpg'
    if (selectedReservationPlace === 'premium-space')
      return '/premium-space.PNG'
    return '/private-space.PNG'
  }

  return (
    <div className="flex-relative w-full h-fit">
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Zoom Controls */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px',
            backgroundColor: 'white',
            borderRadius: '8px 0 8px',
            overflow: 'hidden',
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
          }}
        >
          <button
            className="border-none text-gray-600 bg-white p-3 text-lg cursor-pointer"
            onClick={handleZoomIn}
          >
            +
          </button>
          <button
            className="border-none text-gray-600 bg-white p-3 text-lg cursor-pointer"
            onClick={handleZoomOut}
          >
            -
          </button>
        </div>

        {/* Floor Plan Image */}
        <img
          src={getImageSrc()}
          alt="Floor Plan"
          style={{
            width: '100%',
            height: 'auto',
            transform: `${
              selectedReservationPlace === 'regular-space'
                ? 'scale(1.4)'
                : 'scale(1)'
            } translate(${position.x}px, ${position.y}px)`,
            cursor: 'move',
          }}
        />

        {/* Render Buttons Based on Space Type */}
        {renderRegularSpace()}
        {renderPremiumSpace()}
        {renderPrivateSpace()}
      </div>

      {/* Active Drawer */}
      {activeDrawer && (
        <ReservationDrawer
          isOpen={!!activeDrawer}
          onClose={() => setActiveDrawer(null)}
          position={activeDrawer}
          facilityData={positions.find(
            (p) =>
              (activeDrawer <= 5 &&
                p.name ===
                  (activeDrawer <= 4
                    ? positions[6].name
                    : positions[0].name)) ||
              ([6, 7].includes(activeDrawer) && p.name === positions[1].name) ||
              (activeDrawer === 8 && p.name === positions[0].name) ||
              ([13, 14, 15, 16].includes(activeDrawer) &&
                p.name === positions[3].name) ||
              (activeDrawer === 17 && p.name === positions[2].name) ||
              ([18, 19].includes(activeDrawer) &&
                p.name === positions[4].name) ||
              ([20, 21, 22].includes(activeDrawer) &&
                p.name === positions[5].name),
          )}
          reserves={reserves}
          selectedDate={selectedDate}
          startTime={startTimeReservasi}
          endTime={endTimeReservasi}
          onStartTimeChange={setStartTimeReservasi}
          onEndTimeChange={setEndTimeReservasi}
          generatedTimes={generatedTimes}
          timeArray={timeArray}
          disableTimes={disableTimes}
          priceData={priceData}
          getFacilityId={getFacilityId}
          formatDateIndonesian={formatDateIndonesian}
          imageUrl={`${process.env.NEXT_PUBLIC_IMAGE_URL}${
            positions.find((p) => p.name)?.pict
          }`}
        />
      )}
    </div>
  )
}

export default FloorMapReservation
