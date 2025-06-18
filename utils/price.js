import { getFacilityId } from './text'

export const pricePackageDetermination = (position, totalTime, price) => {
  console.log('TOTAL TIME', totalTime)
  console.log('PRICE TIME', price)
  return totalTime * price
}

export const getPriceDataCustom = (facilityName) => {
  const facilityId = getFacilityId(facilityName)

  const facilityPriceMap = {
    'ps5-reguler': ps5RegulerData['custom-prices'],
    'ikuzo-racing-simulator': ikuzoRacingSimulatorData['custom-prices'],
    'ps4-reguler': ps4RegulerData['custom-prices'],
    'family-vip-room': familyVIPRoomData['custom-prices'],
    'lovebirds-vip-room': lovebirdsVIPRoomData['custom-prices'],
    'family-open-space': familyOpenSpaceData['custom-prices'],
    'squad-open-space': squadOpenSpaceData['custom-prices'],
  }

  console.log('GET PRICE DATA CUSTOM', facilityPriceMap[facilityId] || [])
  return facilityPriceMap[facilityId] || []
}

export const getCustomPrices = (facilityName) => {
  const facilityId = getFacilityId(facilityName)
  const priceDataMapping = {
    'ps5-reguler': ps5RegulerData['custom-prices'],
    'ikuzo-racing-simulator': ikuzoRacingSimulatorData['custom-prices'],
    'ps4-reguler': ps4RegulerData['custom-prices'],
    'family-vip-room': familyVIPRoomData['custom-prices'],
    'lovebirds-vip-room': lovebirdsVIPRoomData['custom-prices'],
    'family-open-space': familyOpenSpaceData['custom-prices'],
    'squad-open-space': squadOpenSpaceData['custom-prices'],
  }

  return priceDataMapping[facilityId] || []
}
