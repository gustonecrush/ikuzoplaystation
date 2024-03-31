export const pricePackageDetermination = (position, totalTime, price) => {
  switch (position) {
    case (1, 2, 3, 4, 5, 8):
      if (totalTime == 3) {
        return 50000
      } else if (totalTime == 5) {
        return 80000
      }
      break
    case (6, 7):
      if (totalTime == 3) {
        return 120000
      } else if (totalTime == 5) {
        return 210000
      }
      break
    case 9:
      if (totalTime == 3) {
        return 140000
      } else if (totalTime == 5) {
        return 230000
      }
      break
    case (10, 11):
      if (totalTime == 3) {
        return 95000
      } else if (totalTime == 5) {
        return 150000
      }
      break
    case 12:
      if (totalTime == 3) {
        return 36000
      } else if (totalTime == 5) {
        return 60000
      }
      break
    default:
      return totalTime * price
  }
}
