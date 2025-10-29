import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import axios from 'axios'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const Checkout = ({ id, idMembership, productName, price, detailCustomer }) => {
  const [quantity, setQuantity] = useState(1)
  const [payClicked, setPayClicked] = useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)

  const checkout = async () => {
    setAlertDialogOpen(false)

    try {
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
      const requestData = await response.json()
      await window.snap.pay(requestData.token)

      const reserveData = {
        reserve_id: id,
        reserve_name: detailCustomer.name,
        location: detailCustomer.location,
        reserve_contact: detailCustomer.no,
        reserve_date: detailCustomer.reserve_date,
        reserve_start_time: detailCustomer.reserve_start_time,
        reserve_end_time: detailCustomer.reserve_end_time,
        status_reserve: 'pending',
        price: price,
        position: detailCustomer.position,
        is_membership:
          idMembership != '' || idMembership != null ? '' : 'Actvie',
        id_membership: idMembership,
      }
      const reserveResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reservations`,
        reserveData,
      )
      setPayClicked(true)
      console.log(reserveResponse.data)
    } catch (error) {
      console.error(error)
      setAlertDialogOpen(false)
    }
  }

  const handleCheckout = () => {
    setAlertDialogOpen(true)
    checkout()
  }

  function ConfirmDialog() {
    return (
      <AlertDialog open={alertDialogOpen}>
        <AlertDialogContent className="w-3/4 rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Anda sudah yakin untuk melakukan pembayaran?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Jika yakin maka pastikan koneksi jaringan mu stabil dan jangan
              sampai halaman ini keluar ketika proses pembayaranmu!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => setAlertDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-orange hover:bg-orange"
              onClick={(e) => handleCheckout()}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <>
      <ConfirmDialog />
      <Button
        type="button"
        onClick={(e) => setAlertDialogOpen(true)}
        className="bg-orange rounded-lg px-5 py-6 text-base font-jakarta hover:bg-orange"
      >
        Pay
      </Button>
    </>
  )
}

export default Checkout
