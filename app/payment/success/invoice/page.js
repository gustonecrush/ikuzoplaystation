'use client'

import React, { useRef } from 'react'
import html2canvas from 'html2canvas'

import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { useEffect } from 'react'
import { formatDateOnTheUI } from '@/utils/date'
import Cookies from 'js-cookie'
import LoaderHome from '@/app/components/LoaderHome'

const Invoice = () => {
  const searchParam = useSearchParams()
  const order_id = searchParam.get('order_id')
  const transaction_status = searchParam.get('transaction_status')
  const cash = searchParam.get('cash')
  const invoiceRef = useRef(null)
  const token = Cookies.get('token')
  const router = useRouter()

  const [showInvoice, setShowInvoice] = React.useState(false)
  const [data, setData] = React.useState(null)

  const getReservationByID = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reservations?reserve_id=${order_id}`,
      )
      if (response.status === 200) {
        const jsonData = await response.data
        setData(jsonData[0])
      } else {
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error while fetching reservation data:', error)
    }
  }

  const base64ToFile = (dataurl, filename = 'invoice.png') => {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
  }

  const downloadInvoice = () => {
    const invoice = invoiceRef.current
    if (!invoice) {
      console.error('Element with ID "invoice-container" not found in the DOM')
      return
    }

    html2canvas(invoice).then(function (canvas) {
      const link = document.createElement('a')
      link.download = `${order_id}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()

      const imageDataURL = canvas.toDataURL('image/png')
      console.log(imageDataURL)
      handleUpdateContent(base64ToFile(imageDataURL))
    })
  }

  const handleUpdateContent = async (file) => {
    const formData = new FormData()

    console.log('File object:', file)

    formData.append('reserve_id', data.reserve_name)
    formData.append('reserve_name', data.reserve_name)
    formData.append('location', data.location)
    formData.append('reserve_contact', data.reserve_contact)
    formData.append('reserve_date', data.reserve_date)
    formData.append('reserve_start_time', data.reserve_start_time)
    formData.append('reserve_end_time', data.reserve_end_time)
    formData.append('status_reserve', data.status_reserve)
    formData.append('price', data.price)
    formData.append('position', data.position)
    formData.append('invoice', file)

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reservations/${order_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Important for file uploads
          },
        },
      )
      console.log('Invoice upload successful:', response)
    } catch (error) {
      console.error('Error while uploading invoice:', error)
    }
  }

  useEffect(() => {
    if (transaction_status == 'settlement') {
      getReservationByID()
    }
  }, [order_id])

  useEffect(() => {
    if (transaction_status == 'settlement') {
      setShowInvoice(true)
      downloadInvoice()
    } else {
      router.push('/payment/failed')
    }
  }, [data])

  // Render your component here

  return (
    <>
      {data && showInvoice ? (
        <section className="bg-white md:flex md:items-center md:justify-center">
          <div className="max-w-5xl pt-5 bg-white md:shadow-md mx-auto md:h-screen">
            <article
              className="overflow-hidden"
              id="invoice-container"
              ref={invoiceRef}
            >
              <div className="bg-[white] rounded-b-md">
                <div className="px-9">
                  <div className="space-y-2 text-slate-700">
                    <img
                      className="object-cover h-[120px] -ml-5"
                      src="/logo-orange.png"
                    />

                    <div className="flex flex-col gap-1">
                      <p className="text-slate-500">Pembayaran Reservasi</p>
                      <p className="text-2xl font-extrabold text-gray-800 tracking-tight uppercase font-body">
                        {/* {orderId} */} {data.reserve_id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-9 mt-7">
                  <div className="flex w-full">
                    <div className="flex flex-col gap-3">
                      <div className="text-sm font-light text-slate-500">
                        <p className="text-sm font-normal text-slate-700">
                          Reservation ID:
                        </p>
                        <p>{data.reserve_id}</p>
                      </div>
                      <div className="text-sm font-light text-slate-500">
                        <p className="text-sm font-normal text-slate-700">
                          Billed To
                        </p>
                        <p>{data.reserve_name}</p>
                      </div>
                      <div className="text-sm font-light text-slate-500">
                        <p className="text-sm font-normal text-slate-700">
                          Invoice Date
                        </p>
                        <p>{formatDateOnTheUI(data.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-9">
                  <div className="flex flex-col mx-0 mt-5">
                    <table className="min-w-full divide-y divide-slate-500">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm text-slate-700 sm:pl-6 md:pl-0 font-semibold"
                          >
                            Description
                          </th>
                          <th
                            scope="col"
                            className="hidden py-3.5 px-3 text-right text-sm font-normal text-slate-700 sm:table-cell"
                          >
                            Duration
                          </th>
                          <th
                            scope="col"
                            className="hidden py-3.5 px-3 text-right text-sm font-normal text-slate-700 sm:table-cell"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-slate-700 sm:pr-6 md:pr-0"
                          >
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="py-4 pl-4 pr-3 text-xs sm:pl-6 md:pl-0">
                            <div className="font-medium text-slate-700 text-sm">
                              {data.location} in Position {data.position}
                            </div>
                            <div className="mt-0.5 text-slate-500 sm:hidden">
                              12 Hours
                            </div>
                            <div className="mt-0.5 text-slate-500 sm:hidden">
                              08/02/2024 - 10.00 : 17.00 WIB
                            </div>
                          </td>
                          <td className="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                            {data.reserve_start_time} - {data.reserve_end_time}{' '}
                            on ({data.reserve_date})
                          </td>
                          <td className="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                            IDR {data.price}
                          </td>
                          <td className="py-4 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                            IDR {data.price}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <th
                            scope="row"
                            colSpan="3"
                            className="hidden pt-0 pl-6 pr-3 text-sm font-light text-right text-slate-500 sm:table-cell md:pl-0"
                          >
                            Subtotal
                          </th>
                          <th
                            scope="row"
                            className="pt-6 pl-4 pr-3 text-sm font-light text-left text-slate-500 sm:hidden"
                          >
                            Subtotal
                          </th>
                          <td className="pt-6 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                            IDR {data.price}
                          </td>
                        </tr>
                        <tr>
                          <th
                            scope="row"
                            colSpan="3"
                            className="hidden pt-4 pl-6 pr-3 text-sm font-light text-right text-slate-500 sm:table-cell md:pl-0"
                          >
                            Tax
                          </th>
                          <th
                            scope="row"
                            className="pt-4 pl-4 pr-3 text-sm font-light text-left text-slate-500 sm:hidden"
                          >
                            Tax
                          </th>
                          <td className="pt-4 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                            {cash != null ? 'IDR 0' : 'IDR 4000'}
                          </td>
                        </tr>
                        <tr>
                          <th
                            scope="row"
                            colSpan="3"
                            className="hidden pt-4 pl-6 pr-3 text-sm font-normal text-right text-slate-700 sm:table-cell md:pl-0"
                          >
                            Total
                          </th>
                          <th
                            scope="row"
                            className="pt-4 pl-4 pr-3 text-sm font-normal text-left text-slate-700 sm:hidden"
                          >
                            Total
                          </th>
                          <td className="pt-4 pl-3 pr-4 text-sm font-normal text-right text-slate-700 sm:pr-6 md:pr-0">
                            IDR {parseInt(data.price)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="px-9 py-5">
                  <div className="border-t pt-5 border-slate-200">
                    <div className="text-sm font-light text-slate-700">
                      <p className="text-justify">
                        Simpan bukti pembayaran ini untuk dibawa saat ingin
                        bermain di Ikuzo Playstation sebagai bukti telah
                        melakukan pemesanan reservasi tempat/layanan di Ikuzo
                        Playstation! Ditunggu kehadiranmu!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <div className="px-9 flex flex-col gap-5 mb-10">
              <Button
                onClick={downloadInvoice}
                className="bg-orange rounded-lg px-5 -mt-2 py-6 text-sm font-jakarta hover:bg-orange w-full font-medium"
              >
                Download
              </Button>
              <Link href={token ? '/admin/dashboard/reservations' : '/'}>
                <Button className="bg-white text-black border-gray-400 rounded-lg px-5 -mt-2 py-6 text-sm font-jakarta hover:bg-white w-full font-medium">
                  Kembali
                </Button>
              </Link>
            </div>
          </div>
        </section>
      ) : showInvoice ? (
        <LoaderHome />
      ) : (
        <section className="flex flex-col justify-center items-center min-h-screen gap-4 px-10">
          <Image
            src={'/success.png'}
            alt="Successfully Pay"
            title={'Successfully Pay'}
            width={0}
            height={0}
            className="w-[300px] h-fit object-contain"
          />
          <div className="flex flex-col gap-1 items-center mt-7 text-center">
            <h1 className="text-xl font-semibold">Pembayaran Berhasil!</h1>
            <p className="text-sm text-gray-400">
              Terima kasih telah melakukan pembayaran, kami tunggu di Ikuzo
              Playstation!
            </p>
          </div>
        </section>
      )}
    </>
  )
}

export default Invoice
