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
