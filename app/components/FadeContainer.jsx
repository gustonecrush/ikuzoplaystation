'use client'

import React from 'react'
import { Fade } from 'react-awesome-reveal'

const FadeContainer = ({children}) => {
  return (
    <Fade>
        {children}
    </Fade>
  )
}

export default FadeContainer
