'use client'

import React from 'react'
import { Bounce } from 'react-awesome-reveal'

const BounceContainer = ({children}) => {
  return (
    <Bounce>
        {children}
    </Bounce>
  )
}

export default BounceContainer
