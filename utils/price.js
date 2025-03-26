import { getFacilityId } from './text'

export const pricePackageDetermination = (position, totalTime, price) => {
  switch (position) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 8:
      return totalTime === 3
        ? 50000
        : totalTime === 5
        ? 80000
        : totalTime * price
    case 6:
    case 7:
      return totalTime === 3
        ? 120000
        : totalTime === 5
        ? 210000
        : totalTime * price
    case 9:
      return totalTime === 3
        ? 140000
        : totalTime === 5
        ? 230000
        : totalTime * price
    case 10:
    case 11:
      return totalTime === 3
        ? 95000
        : totalTime === 5
        ? 150000
        : totalTime * price
    case 12:
      return totalTime === 3
        ? 36000
        : totalTime === 5
        ? 60000
        : totalTime * price
    default:
      return totalTime * price
  }
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
  const facilityId = getFacilityId(facilityName);
  const priceDataMapping = {
    'ps5-reguler': ps5RegulerData['custom-prices'],
    'ikuzo-racing-simulator': ikuzoRacingSimulatorData['custom-prices'],
    'ps4-reguler': ps4RegulerData['custom-prices'],
    'family-vip-room': familyVIPRoomData['custom-prices'],
    'lovebirds-vip-room': lovebirdsVIPRoomData['custom-prices'],
    'family-open-space': familyOpenSpaceData['custom-prices'],
    'squad-open-space': squadOpenSpaceData['custom-prices'],
  };

  return priceDataMapping[facilityId] || [];
};

