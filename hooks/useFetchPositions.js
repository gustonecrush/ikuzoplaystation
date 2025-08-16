import { useState, useCallback } from 'react'
import axios from 'axios'

export function useFetchPositions() {
  const [positions, setPositions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPositions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/content-facilities`,
      )
      setPositions(response.data.data)
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      setError(err)
    }
  }, [])

  return { positions, isLoading, error, fetchPositions }
}
