import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export function useFetchDateClosed() {
  const [dateClose, setDateClose] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDateClosed = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/dates`,
      )
      if (response.status === 200) {
        const jsonData = response.data
        setDateClose(jsonData.data)
      } else {
        throw new Error('Failed to fetch data')
      }
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDateClosed()
  }, [fetchDateClosed])

  return { dateClose, isLoading, error, refetch: fetchDateClosed }
}
