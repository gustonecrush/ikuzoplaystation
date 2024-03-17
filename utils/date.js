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

export const generateTimeArray = (
  date = new Date().toISOString().split('T')[0],
  bookedSlots,
) => {
  const times = []
  const today = new Date()
  const currentHour = today.getHours()
  const currentMinute = today.getMinutes()

  // Set start hour and minute
  let startHour, startMinute
  if (date === today.toISOString().split('T')[0]) {
    // If today, start from current hour and nearest multiple of 10 for minute
    startHour = currentHour
    startMinute = Math.ceil(currentMinute / 10) * 10
  } else {
    // If not today, start from 09:00
    startHour = 9
    startMinute = 0
  }

  const endHour = 23

  for (let hour = startHour; hour <= endHour; hour++) {
    const maxMinute =
      hour === endHour ? Math.floor(currentMinute / 10) * 10 : 60
    const startLoopMinute = hour === startHour ? startMinute : 0
    for (let minute = startLoopMinute; minute < maxMinute; minute += 10) {
      const formattedHour = hour.toString().padStart(2, '0')
      const formattedMinute = minute.toString().padStart(2, '0')
      const time = `${formattedHour}:${formattedMinute}`

      // Check if bookedSlots has any entries before checking time availability
      if (
        bookedSlots.length === 0 ||
        !bookedSlots.some((slot) =>
          isTimeBetween(time, slot.startTime, slot.endTime),
        )
      ) {
        times.push(time)
      }
    }
  }
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

export const generateTimeArrayWithStep = (selectedTime) => {
  const times = []
  const maxHour = 23
  const maxMinute = 30

  const [hourStr, minuteStr] = selectedTime.split(':')
  let selectedHour = parseInt(hourStr)
  let selectedMinute = parseInt(minuteStr)

  // Add the selected time
  times.push(selectedTime)

  // Generate times with step one hour, two hours, three hours, etc. until max 15 hours
  for (let i = 1; i <= 15; i++) {
    // Calculate next hour and minute
    let nextHour = selectedHour + i
    let nextMinute = selectedMinute

    // Adjust if minute exceeds 59
    if (nextMinute >= 60) {
      nextHour++
      nextMinute -= 60
    }

    // Check if next hour exceeds maximum hour or if hour is 23 and minute exceeds maximum minute
    if (
      nextHour > maxHour ||
      (nextHour === maxHour && nextMinute > maxMinute)
    ) {
      // If exceeded, break the loop
      break
    }

    // Format next hour and minute
    const formattedHour = nextHour.toString().padStart(2, '0')
    const formattedMinute = nextMinute.toString().padStart(2, '0')

    // Add the formatted time to the times array
    times.push(`${formattedHour}:${formattedMinute}`)
  }

  return times
}
