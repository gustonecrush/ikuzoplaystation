import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

const useFetchStatistics = () => {
  const [total, setTotal] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/statistics`,
      )
      setTotal(data)
    } catch (err) {
      setError(err)
      console.error({ error: err })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  return { total, isLoading, error, refetch: fetchStatistics }
}

export default useFetchStatistics
