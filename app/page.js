'use client'

import React from 'react'
import Loading from './loading'
import Home from './components/Home'
import { initializeGoogleTagManager } from '@/utils/googleTagManager'

export default function Page() {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)

    initializeGoogleTagManager('G-RH5E4VBLZM')

    setTimeout(() => {
      setLoading(false)
    }, 5000)
  }, [])

  return <>{!loading ? <Home /> : <Loading />}</>
}
