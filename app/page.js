'use client'

import React from 'react'
import { initializeGoogleTagManager } from '@/utils/googleTagManager'
import Home from './components/Home'
import LoaderHome from './components/LoaderHome'

export default function Page() {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)

    initializeGoogleTagManager('G-RH5E4VBLZM')

    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, [])

  return <>{!loading ? <Home /> : <LoaderHome />}</>
}
