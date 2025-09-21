export const FACILITIES_MAPPING = {
  'PS4 Reguler': [1, 2, 3, 4],
  'Ikuzo Racing Simulator': [6, 7],
  'PS5 Reguler': [5, 8],
  'Squad Open Space': [13, 14, 15, 16],
  'Family Open Space': [17],
  'Family VIP Room': [18, 19],
  'LoveBirds VIP Room': [20, 21, 22],
}

export const SPACE_MAPPING = {
  'Regular Space': [1, 2, 3, 4, 5, 6, 7, 8],
  'Premium Space': [13, 14, 15, 16, 17],
  'Private Space': [18, 19, 20, 21, 22],
}

export const getFacilityName = (seatNumber) => {
  for (const [facility, seats] of Object.entries(FACILITIES_MAPPING)) {
    if (seats.includes(seatNumber)) {
      return facility
    }
  }
  return 'Unknown Facility'
}
