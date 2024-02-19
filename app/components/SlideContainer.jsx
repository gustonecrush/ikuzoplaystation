'use client'

import React from 'react'
import { Slide } from 'react-awesome-reveal'

const SlideContainer = ({children}) => {
  return (
    <Slide direction='up'>
        {children}
    </Slide>
  )
}

export default SlideContainer
