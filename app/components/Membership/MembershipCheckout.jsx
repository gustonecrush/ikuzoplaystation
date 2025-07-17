'use client'

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
} from '@/components/ui/alert-dialog'
import Toast from '../Toast'
import { generateRandomMembershipID } from '@/utils/id'

const MembershipCheckout = ({ tier, user }) => {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [payClicked, setPayClicked] = useState(false)
  const membershipId = generateRandomMembershipID()

  const handleCheckout = async () => {
    setAlertDialogOpen(false)

    try {
      const data = {
        id: membershipId,
        productName: tier.full_name,
        price: tier.price,
        quantity: 1,
        name: user.full_name,
        phone: user.phone_number,
      }

      const response = await fetch('/api/tokenizer', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      console.log({ response })

      const requestData = await response.json()
      console.log({ requestData })

      await window.snap.pay(requestData.token)

      Toast.fire({
        icon: 'success',
        title: 'Pembayaran dimulai, selesaikan di jendela Midtrans.',
      })

      setPayClicked(true)
    } catch (error) {
      console.error(error)
      Toast.fire({
        icon: 'error',
        title: 'Gagal memulai pembayaran.',
      })
    }
  }

  return (
    <>
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent className="w-[90%] md:w-3/4 rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Konfirmasi Pembayaran Keanggotaan
            </AlertDialogTitle>
            <AlertDialogDescription>
              Pastikan data berikut sudah benar sebelum melanjutkan pembayaran.
            </AlertDialogDescription>

            {/* ✅ Payment Summary */}
            <div className="bg-muted rounded-md p-4 mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nama:</span>
                <span className="font-medium">{user.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nomor HP:</span>
                <span className="font-medium">{user.phone_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Keanggotaan:</span>
                <span className="font-medium">{tier.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Harga:</span>
                <span className="font-medium">
                  Rp {Number(tier.price).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-semibold">
                <span>Total Bayar:</span>
                <span>Rp {Number(tier.price).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="pt-4">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-orange hover:bg-orange"
              onClick={() => handleCheckout()}
            >
              Lanjut Bayar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        type="button"
        onClick={() => setAlertDialogOpen(true)}
        className="bg-orange text-white w-full mt-4 rounded-lg px-5 py-3 hover:bg-orange/90"
      >
        Checkout & Bayar Sekarang
      </Button>
    </>
  )
}

export default MembershipCheckout
