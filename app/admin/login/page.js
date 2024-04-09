import React, { Suspense } from 'react'
import LoginLayout from '../dashboard/components/LoginLayout'

export default function Home() {
  return (
    <>
      <section className="flex flex-col h-full w-full scroll-smooth overflow-x-hidden">
        <div className="flex flex-col relative items-center justify-center bg-black bg-opacity-35">
          <Video />
          <LoginLayout />
        </div>
      </section>
    </>
  )
}

async function Video() {
  return (
    <>
      <video
        playsInline
        width="320"
        height="240"
        preload="none"
        autoPlay
        muted
        loop
        className="h-screen w-full object-cover -z-30 block md:hidden"
      >
        <source src="/ikuzoplaystation.mp4" type="video/mp4" />
        <track src="/ikuzoplaystation.mp4" srcLang="en" label="English" />
        Your browser does not support the video tag.
      </video>
      <video
        width="320"
        height="240"
        preload="none"
        autoPlay
        playsInline
        muted
        loop
        className="h-screen w-full object-cover -z-30 hidden md:block"
      >
        <source src="/ikuzo-dekstop.mp4" type="video/mp4" />
        <track src="/ikuzoplaystation.mp4" srcLang="en" label="English" />
        Your browser does not support the video tag.
      </video>
    </>
  )
}
