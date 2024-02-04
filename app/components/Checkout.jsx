import React, { useState } from 'react'
import { product } from '../libs/product'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Checkout = ({ id, productName, price, detailCustomer }) => {
  const [quantity, setQuantity] = useState(1)

  const checkout = async () => {
    const data = {
      id: id,
      productName: productName,
      price: price,
      quantity: quantity,
      name: detailCustomer.name,
      phone: detailCustomer.no,
    }

    const response = await fetch('/api/tokenizer', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // fetching bawaannya javascript, kita harus begini
    const requestData = await response.json()
    window.snap.pay(requestData.token)
  }

  return (
    <>
      <Button
        onClick={checkout}
        className="bg-orange rounded-lg px-5 py-6 text-base font-jakarta hover:bg-orange"
      >
        Pay
      </Button>
    </>
  )
}

export default Checkout
