'use client'

import { useState, useCallback } from 'react'
import axios from 'axios'

export function useFetchDataMaintenances() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getAllDataMaintenances = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/maintenances`,
      )
      console.log({ response })
      setData(response.data)
    } catch (error) {
      console.error({ error })
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { data, isLoading, getAllDataMaintenances }
}
