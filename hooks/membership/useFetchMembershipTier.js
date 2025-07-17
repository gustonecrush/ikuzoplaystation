import { useEffect, useState } from 'react'

export function useFetchMembershipTier(id) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const url = id
    ? `https://api.ikuzoplaystation.com/api/membership-tiers/${id}`
    : `https://api.ikuzoplaystation.com/api/membership-tiers`

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch membership data.')
        const json = await res.json()
        setData(json)
        setError(null)
      } catch (err) {
        setError(err.message || 'Unknown error')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  return { data, loading, error }
}
