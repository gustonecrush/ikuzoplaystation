// fungsi ini untuk nembak data ke midtrans biar dapet token

import Midtrans from 'midtrans-client'
import { NextResponse } from 'next/server'

// inisialisasi data midtrans
let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.NEXT_PUBLIC_SECRET,
  clientKey: process.env.NEXT_PUBLIC_CLIENT,
})

// function bawaan next js biar terdeteksi kalo itu API, kenapa POST() biar terdeteksi metode POST API
export async function POST(request) {
  // variable yg bakal ditangkep dari frontend
  const { id, productName, price, quantity, name, phone } = await request.json()

  let parameter = {
    item_details: {
      name: productName,
      price: price,
      quantity: quantity,
    },
    transaction_details: {
      order_id: id,
      gross_amount: price * quantity,
    },
    customer_details: {
      first_name: name,
      phone: phone,
    },
  }

  const token = await snap.createTransactionToken(parameter)
  console.log(token)
  return NextResponse.json({ token })
}
