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

export const generateTimeArray = () => {
  const times = []
  for (let hour = 9; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      const time = `${hour
        .toString()
        .padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      if (hour === 23 && minute === 30) break // Stop at 23:30
      times.push(time)
    }
  }
  return times
}
