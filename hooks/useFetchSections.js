import { useState, useCallback } from 'react'
import axios from 'axios'

export function useFetchSections() {
  const [sections, setSections] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSections = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sections`,
      )
      setSections(response.data.data)
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      setError(err)
    }
  }, [])

  return { sections, isLoading, error, fetchSections }
}
