import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import axios from 'axios'

const Checkout = ({ id, productName, price, detailCustomer }) => {
  const [quantity, setQuantity] = useState(1)
  const [payClicked, setPayClicked] = useState(false)

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

    if (!payClicked) {
      const reserveData = {
        reserve_id: id,
        reserve_name: detailCustomer.name,
        location: detailCustomer.location,
        reserve_contact: detailCustomer.no,
        reserve_date: detailCustomer.reserve_date,
        reserve_start_time: detailCustomer.reserve_start_time,
        reserve_end_time: detailCustomer.reserve_end_time,
        status_reserve: 'in hold',
        price: price,
        position: detailCustomer.position,
      }
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/reservations`,
          reserveData,
        )
        setPayClicked(true)

        console.log(response.data) // respons body data tersedia di sini
      } catch (error) {
        console.error(error)
      }
    }
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
