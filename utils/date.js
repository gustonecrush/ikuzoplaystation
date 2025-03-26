export const getCurrentDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  let month = today.getMonth() + 1
  let day = today.getDate()

  // Add leading zero if month or day is less than 10
  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day

  return `${year}-${month}-${day}`
}

export const getMaxDate = () => {
  const today = new Date()
  const maxDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000) // Adding two weeks in milliseconds
  const year = maxDate.getFullYear()
  let month = maxDate.getMonth() + 1
  let day = maxDate.getDate()

  // Add leading zero if month or day is less than 10
  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day

  return `${year}-${month}-${day}`
}

export const getCurrentTime = () => {
  const today = new Date()
  let hours = today.getHours()
  let minutes = today.getMinutes()

  // Add leading zero if minutes is less than 10
  minutes = minutes < 10 ? '0' + minutes : minutes

  return `${hours}:${minutes}`
}

export const getMaxTime = () => {
  const today = new Date()
  const maxTime = new Date(today.getTime() + 12 * 60 * 60 * 1000) // Adding 12 hours in milliseconds
  let hours = maxTime.getHours()
  let minutes = maxTime.getMinutes()

  // Add leading zero if minutes is less than 10
  minutes = minutes < 10 ? '0' + minutes : minutes

  return `${hours}:${minutes}`
}

export const calculateTimeDifference = (startTime, endTime) => {
  // Split the time strings into hours and minutes
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)

  // Convert the times into total minutes
  const totalStartMinutes = startHour * 60 + startMinute
  const totalEndMinutes = endHour * 60 + endMinute

  // Calculate the difference in total minutes
  const differenceInMinutes = totalEndMinutes - totalStartMinutes

  // Convert the difference back into hours and minutes
  const hours = Math.floor(differenceInMinutes / 60)

  return hours
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  return date.toLocaleDateString('en-US', options)
}

export const convertToDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate()
  return day
}

// export const generateTimeArray = (
//   customTimeSelected = {
//     open_time: 9,
//     close_time: 23,
//     date: new Date().toISOString().split('T')[0],
//   },
//   date = new Date().toISOString().split('T')[0],
//   bookedSlots,
// ) => {
//   const times = []
//   const today = new Date()
//   const currentHour = today.getHours()
//   const currentMinute = today.getMinutes()

//   // Set start hour and minute
//   let startHour, startMinute
//   if (date === today.toISOString().split('T')[0]) {
//     // If today, start from current hour and nearest multiple of 10 for minute
//     startHour = currentHour
//     startMinute = Math.ceil(currentMinute / 10) * 10
//   } else {
//     // If not today, start from 09:00
//     if (customTimeSelected != null && date == customTimeSelected.date) {
//       startHour = customTimeSelected.open_time
//       startMinute = 0
//     } else {
//       startHour = 9
//       startMinute = 0
//     }
//   }

//   let endHour
//   if (customTimeSelected != null && date == customTimeSelected.date) {
//     endHour = parseInt(customTimeSelected.close_time)
//   } else {
//     endHour = 23
//   }

//   for (let hour = startHour; hour <= endHour; hour++) {
//     let maxMinute
//     if (
//       hour === endHour &&
//       customTimeSelected != null &&
//       date == customTimeSelected.date
//     ) {
//       maxMinute = 0 // Stop at 00 minutes for the end hour when customTimeSelected is not null
//     } else {
//       maxMinute = hour === endHour ? 60 : 50 // If endHour, allow until 00 minutes, otherwise 50 minutes
//     }
//     const startLoopMinute = hour === startHour ? startMinute : 0
//     for (let minute = startLoopMinute; minute < maxMinute; minute += 10) {
//       const formattedHour = hour.toString().padStart(2, '0')
//       const formattedMinute = minute.toString().padStart(2, '0')
//       const time = `${formattedHour}:${formattedMinute}`

//       // Check if bookedSlots has any entries before checking time availability
//       if (
//         bookedSlots.length === 0 ||
//         !bookedSlots.some((slot) =>
//           isTimeBetween(time, slot.startTime, slot.endTime),
//         )
//       ) {
//         times.push(time)
//       }
//     }
//   }
//   return times
// }

export const formatTimestampIndonesian = (timestamp) => {
  const date = new Date(timestamp)

  // Format options for Indonesian locale
  const options = {
    year: 'numeric',
    month: 'long', // "Februari"
    day: '2-digit', // "28"
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format
  }

  return date.toLocaleString('id-ID', options).replace(',', '')
}

export const extractHour = (timeString) => {
  return timeString.split(':')[0]
}

export const convertToStandardTime = (time) => {
  let [hour, minute] = time.split(':').map(Number)
  if (hour >= 25 && hour <= 30) {
    hour = hour - 24 // Ubah ke format 01-06
  }
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export const convertToExtendedTime = (time) => {
  let [hour, minute] = time.split(':').map(Number)
  if (hour >= 1 && hour <= 6) {
    hour = hour + 24 // Ubah ke format 25-30
  }
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export const generateTimeArray = (
  customTimeSelectedArray,
  date,
  bookedSlots,
) => {
  // if (customTimeSelectedArray.length == 0) {
  //   customTimeSelectedArray = [
  //     {
  //       open_time: 10,
  //       close_time: 23,
  //       date: new Date().toISOString().split('T')[0],
  //     },
  //   ]
  // }
  console.log('BOOKED', bookedSlots)
  console.log(date)
  console.log(customTimeSelectedArray)

  const times = []
  const today = new Date()
  const currentHour = today.getHours()
  const currentMinute = today.getMinutes()
  console.log(today.toISOString().split('T')[0])

  customTimeSelectedArray.forEach((customTimeSelected) => {
    let startHour, startMinute
    if (date === today.toISOString().split('T')[0]) {
      if (currentHour < customTimeSelected.open_time) {
        startHour = customTimeSelected.open_time
        startMinute = 0
      } else {
        startHour = currentHour
        startMinute = Math.ceil(currentMinute / 10) * 10
      }
    } else {
      if (customTimeSelected.date === date) {
        startHour = customTimeSelected.open_time
        startMinute = 0
      } else {
        startHour = 9
        startMinute = 0
      }
    }

    let endHour
    if (customTimeSelected.date === date) {
      endHour = parseInt(customTimeSelected.close_time)
    } else {
      endHour = 24 // Set endHour to 24 for the last hour of the day
    }

    for (let hour = startHour; hour <= endHour; hour++) {
      const maxMinute = hour === endHour ? 0 : 60 // Set maxMinute to 0 for the last hour of the day

      const startLoopMinute = hour === startHour ? startMinute : 0
      const loopEndMinute =
        hour === endHour ? Math.min(60, startMinute + 1) : maxMinute // Adjust loop end minute for the last hour

      for (let minute = startLoopMinute; minute < loopEndMinute; minute += 10) {
        const formattedHour = hour.toString().padStart(2, '0')
        const formattedMinute = minute.toString().padStart(2, '0')
        const time = `${formattedHour}:${formattedMinute}`

        if (
          bookedSlots.length === 0 ||
          !bookedSlots.some((slot) =>
            isTimeBetween(
              convertToStandardTime(time),
              slot.startTime,
              slot.endTime,
            ),
          )
        ) {
          times.push(convertToStandardTime(time))
        }
      }
    }
  })

  console.log({ times })
  return times
}

// Helper function to check if a time is between two other times
const isTimeBetween = (time, startTime, endTime) => {
  return time >= startTime && time <= endTime
}

const generateTimeSlots = (date, bookedSlots) => {
  const startTime = new Date(date)
  startTime.setHours(9, 0, 0, 0) // Set start time to 09:00

  const endTime = new Date(date)
  endTime.setHours(23, 30, 0, 0) // Set end time to 23:30

  const timeSlots = []
  const currentTime = new Date(startTime)

  // Loop through each time slot from start time to end time
  while (currentTime <= endTime) {
    const timeString = currentTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
    const slot = { start_time: timeString }

    // Check if the current time slot is available (not booked)
    const isBooked = bookedSlots.some((slot) => {
      const reserveDate = new Date(slot.reserve_date)
      const startTime = new Date(reserveDate)
      startTime.setHours(
        Number(slot.reserve_start_time.split(':')[0]),
        Number(slot.reserve_start_time.split(':')[1]),
        0,
        0,
      )
      const endTime = new Date(reserveDate)
      endTime.setHours(
        Number(slot.reserve_end_time.split(':')[0]),
        Number(slot.reserve_end_time.split(':')[1]),
        0,
        0,
      )
      return currentTime >= startTime && currentTime < endTime
    })

    // If the time slot is available, add it to the list
    if (!isBooked) {
      timeSlots.push(slot)
    }

    // Increment current time by 10 minutes
    currentTime.setMinutes(currentTime.getMinutes() + 10)
  }

  return timeSlots
}

// export const generateTimeArrayWithStep = (selectedTime, bookedSlots) => {
//   const times = []
//   const maxHour = 23
//   const maxMinute = 30

//   const [hourStr, minuteStr] = selectedTime.split(':')
//   const selectedHour = parseInt(hourStr)
//   const selectedMinute = parseInt(minuteStr)

//   // Check if bookedSlots is not empty
//   if (bookedSlots.length !== 0) {
//     // Find the nearest startTime after the selected time
//     let nearestStartTime = ''
//     for (const slot of bookedSlots) {
//       const [startHour, startMinute] = slot.startTime.split(':')
//       const slotStartTime = parseInt(startHour) * 60 + parseInt(startMinute)
//       const selectedTimeMinutes = selectedHour * 60 + selectedMinute
//       if (slotStartTime > selectedTimeMinutes) {
//         nearestStartTime = slot.startTime
//         break
//       }
//     }

//     // Generate times from the selected time to the nearest startTime with step one hour
//     if (nearestStartTime) {
//       for (let hour = selectedHour + 1; hour <= maxHour; hour++) {
//         const formattedHour = hour.toString().padStart(2, '0')
//         const formattedMinute = selectedMinute.toString().padStart(2, '0')
//         const time = `${formattedHour}:${formattedMinute}`

//         // Check if the time is within the range of selected time to nearestStartTime
//         if (isTimeBetween(time, selectedTime, nearestStartTime)) {
//           times.push(time)
//         }

//         // If the nearestStartTime is reached, break the loop
//         if (`${hour}:00` === nearestStartTime) {
//           break
//         }
//       }
//     } else {
//       // If no nearest startTime, generate times with step one hour until 23:30
//       for (let hour = selectedHour + 1; hour <= maxHour; hour++) {
//         const formattedHour = hour.toString().padStart(2, '0')
//         const formattedMinute = selectedMinute.toString().padStart(2, '0')
//         const time = `${formattedHour}:${formattedMinute}`

//         // Exclude selectedTime
//         if (time !== selectedTime) {
//           times.push(time)
//         }

//         if (hour === maxHour && selectedMinute === maxMinute) {
//           break
//         }
//       }
//     }
//   } else {
//     // If bookedSlots is empty, generate times with step one hour until 23:30
//     for (let hour = selectedHour + 1; hour <= maxHour; hour++) {
//       const formattedHour = hour.toString().padStart(2, '0')
//       const formattedMinute = selectedMinute.toString().padStart(2, '0')
//       const time = `${formattedHour}:${formattedMinute}`

//       // Exclude selectedTime
//       if (time !== selectedTime) {
//         times.push(time)
//       }

//       if (hour === maxHour && selectedMinute === maxMinute) {
//         break
//       }
//     }
//   }

//   return times
// }

export const generateTimeArrayWithStep = (selectedTime, bookedSlots) => {
  const times = []
  const maxHour = 23
  const maxMinute = 30

  const [hourStr, minuteStr] = convertToExtendedTime(selectedTime).split(':')
  const selectedHour = parseInt(hourStr)
  const selectedMinute = parseInt(minuteStr)

  // Check if bookedSlots is not empty
  if (bookedSlots.length !== 0) {
    // Find the nearest startTime after the selected time
    let nearestStartTime = ''
    for (const slot of bookedSlots) {
      const [startHour, startMinute] = slot.startTime.split(':')
      const slotStartTime = parseInt(startHour) * 60 + parseInt(startMinute)
      const selectedTimeMinutes = selectedHour * 60 + selectedMinute
      if (slotStartTime > selectedTimeMinutes) {
        nearestStartTime = slot.startTime
        break
      }
    }

    // Generate times from the selected time to the nearest startTime with step one hour
    if (nearestStartTime) {
      for (let hour = selectedHour + 1; hour <= maxHour; hour++) {
        const formattedHour = hour.toString().padStart(2, '0')
        const formattedMinute = selectedMinute.toString().padStart(2, '0')
        const time = `${formattedHour}:${formattedMinute}`

        // Check if the time is within the range of selected time to nearestStartTime
        if (
          isTimeBetween(
            time,
            convertToExtendedTime(selectedTime),
            nearestStartTime,
          )
        ) {
          times.push(convertToStandardTime(time))
        }

        // If the nearestStartTime is reached, break the loop
        if (`${hour}:00` === nearestStartTime) {
          break
        }
      }
    } else {
      // If no nearest startTime, generate times with step one hour until 23:30
      for (let hour = selectedHour + 1; hour <= maxHour; hour++) {
        const formattedHour = hour.toString().padStart(2, '0')
        const formattedMinute = selectedMinute.toString().padStart(2, '0')
        const time = `${formattedHour}:${formattedMinute}`

        // Exclude selectedTime
        if (time !== selectedTime) {
          times.push(convertToStandardTime(time))
        }

        if (hour === maxHour && selectedMinute === maxMinute) {
          break
        }
      }
    }
  } else {
    // If bookedSlots is empty, generate times with step one hour until 23:30
    for (let hour = selectedHour + 1; hour <= maxHour; hour++) {
      const formattedHour = hour.toString().padStart(2, '0')
      const formattedMinute = selectedMinute.toString().padStart(2, '0')
      const time = `${formattedHour}:${formattedMinute}`

      // Exclude selectedTime
      if (time !== selectedTime) {
        times.push(convertToStandardTime(time))
      }

      if (hour === maxHour && selectedMinute === maxMinute) {
        break
      }
    }
  }

  console.log('end times', times)

  return times
}

export const convertNumber = (num) => {
  if (num >= 25 && num <= 30) {
    return num - 24 // Shifts 25 -> 1, 26 -> 2, ..., 30 -> 6
  }
  return num // Return original number if outside range
}

export const generateTimeArrayWithStepUser = (
  selectedTime,
  bookedSlots,
  maxHour,
) => {
  const times = []
  const maxMinute = 30

  const [hourStr, minuteStr] = convertToExtendedTime(selectedTime).split(':')
  const selectedHour = parseInt(hourStr)
  const selectedMinute = parseInt(minuteStr)

  // Check if bookedSlots is not empty
  if (bookedSlots.length !== 0) {
    // Find the nearest startTime after the selected time
    let nearestStartTime = ''
    for (const slot of bookedSlots) {
      const [startHour, startMinute] = slot.startTime.split(':')
      const slotStartTime = parseInt(startHour) * 60 + parseInt(startMinute)
      const selectedTimeMinutes = selectedHour * 60 + selectedMinute
      if (slotStartTime > selectedTimeMinutes) {
        nearestStartTime = slot.startTime
        break
      }
    }

    // Generate times from the selected time to the nearest startTime with step one hour
    if (nearestStartTime) {
      for (let hour = selectedHour + 1; hour <= parseInt(maxHour); hour++) {
        const formattedHour = hour.toString().padStart(2, '0')
        const formattedMinute = selectedMinute.toString().padStart(2, '0')
        const time = `${formattedHour}:${formattedMinute}`

        // Check if the time is within the range of selected time to nearestStartTime
        if (
          isTimeBetween(
            time,
            convertToExtendedTime(selectedTime),
            nearestStartTime,
          )
        ) {
          times.push(convertToStandardTime(time))
        }

        // If the nearestStartTime is reached, break the loop
        if (`${hour}:00` === nearestStartTime) {
          break
        }
      }
    } else {
      // If no nearest startTime, generate times with step one hour until 23:30
      for (let hour = selectedHour + 1; hour <= parseInt(maxHour); hour++) {
        const formattedHour = hour.toString().padStart(2, '0')
        const formattedMinute = selectedMinute.toString().padStart(2, '0')
        const time = `${formattedHour}:${formattedMinute}`

        // Exclude selectedTime
        if (time !== selectedTime) {
          times.push(convertToStandardTime(time))
        }

        if (hour === parseInt(maxHour) && selectedMinute === maxMinute) {
          break
        }
      }
    }
  } else {
    // If bookedSlots is empty, generate times with step one hour until 23:30
    for (let hour = selectedHour + 1; hour <= parseInt(maxHour); hour++) {
      const formattedHour = hour.toString().padStart(2, '0')
      const formattedMinute = selectedMinute.toString().padStart(2, '0')
      const time = `${formattedHour}:${formattedMinute}`

      // Exclude selectedTime
      if (time !== selectedTime) {
        times.push(convertToStandardTime(time))
      }

      if (hour === parseInt(maxHour) && selectedMinute === maxMinute) {
        break
      }
    }
  }

  console.log('end times', times)

  return times
}

export const formatDateOnTheUI = (dateStr) => {
  const date = new Date(dateStr)

  const options = {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }
  const formattedDate = date.toLocaleDateString('en-US', options)
  return formattedDate
}

export const getToday = () => {
  const days = [
    'Minggu', // Sunday
    'Senin', // Monday
    'Selasa', // Tuesday
    'Rabu', // Wednesday
    'Kamis', // Thursday
    'Jumat', // Friday
    'Sabtu', // Saturday
  ]

  const today = new Date().getDay()
  return days[today]
}

export function getIndonesianDay(dateString) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

  const date = new Date(dateString)
  console.log({ dateString })
  console.log({ days })
  return days[date.getDay()]
}

export const formatDateIndonesian = (dateString) => {
  if (!dateString) return ''

  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]

  const [year, month, day] = dateString.split('-')
  return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`
}
