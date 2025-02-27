// function to get only hour time for generating times array available
export const capitalizeAndFormat = (str) => {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// function to get space category by facility's name
export const getSpaceCategory = (facilityName) => {
  const regularSpace = ['PS5 Reguler', 'Ikuzo Racing Simulator', 'PS4 Reguler']
  const premiumSpace = ['Family Open Space', 'Squad Open Space']
  const privateSpace = ['Family VIP Room', 'LoveBirds VIP Room']

  if (regularSpace.includes(facilityName)) return 'regular-space'
  if (premiumSpace.includes(facilityName)) return 'premium-space'
  if (privateSpace.includes(facilityName)) return 'private-space'

  return 'unknown'
}
