import React from 'react'

function page() {
  return (
    <div className="relative w-full">
      <img
        src={`first-floor.jpg`}
        alt=""
        style={{
          width: '100%',
          height: 'auto',
        }}
        draggable={false}
        className="fixed z-20"
      />

      <div className="flex flex-col absolute z-50 items-center justify-center w-full top-1/2 translate-y-1/2">
        <div className="flex flex-row gap-5 w-full items-center justify-center px-32">
          <div className="flex-1 h-32 bg-black bg-opacity-20">1</div>
          <div className="flex-1 h-32 bg-black bg-opacity-20">2</div>
          <div className="flex-1 h-32 bg-black bg-opacity-20">3</div>
          <div className="flex-1 h-32 bg-black bg-opacity-20">4</div>
          <div className="flex-1 h-32 bg-black bg-opacity-20">5</div>
        </div>
      </div>
    </div>
  )
}

export default page
