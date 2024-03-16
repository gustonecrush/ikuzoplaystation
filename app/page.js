'use client'

import React from 'react'
import Loading from './loading'
import Home from './components/Home'

export default function Page() {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
    }, 5000)
  }, [])

  return <>{!loading ? <Home /> : <Loading />}</>
}
