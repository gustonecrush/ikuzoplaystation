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
        <AlertDialogContent className="w-[90%] md:w-3/4 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-xl leading-none font-semibold drop-shadow">
              Konfirmasi <br />
              Pembayaran Membership
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70 text-sm">
              Pastikan data berikut sudah benar sebelum melanjutkan pembayaran.
            </AlertDialogDescription>

            {/* ✅ Payment Summary */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 mt-4 space-y-2 text-sm text-white shadow-inner">
              <div className="flex justify-between">
                <span className="text-white/70">Nama:</span>
                <span className="font-medium">{user.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Nomor HP:</span>
                <span className="font-medium">{user.phone_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Keanggotaan:</span>
                <span className="font-medium">{tier.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Harga:</span>
                <span className="font-medium">
                  Rp {Number(tier.price).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="border-t border-white/30 pt-2 flex justify-between font-semibold">
                <span>Total Bayar:</span>
                <span>Rp {Number(tier.price).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="pt-4">
            <AlertDialogCancel className="rounded-xl bg-white/10 border border-white/30 text-white hover:bg-white/20 transition">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-orange/80 hover:bg-orange text-white shadow-md"
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
