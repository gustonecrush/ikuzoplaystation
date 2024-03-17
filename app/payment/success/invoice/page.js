'use client'

import React from 'react'
import html2canvas from 'html2canvas'

import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import Loading from '@/app/loading'

const Invoice = () => {
  const searchParam = useSearchParams()
  const order_id = searchParam.get('order_id')

  const [showInvoice, setShowInvoice] = React.useState(false)
  const [data, setData] = React.useState(null)

  console.log(order_id)
  console.log(data)

  const getReservationByID = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reservations?reserve_id=${order_id}`,
      )
      console.log(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reservations?reserve_id=${order_id}`,
      )
      if (response.status == 200) {
        const jsonData = await response.data
        console.log(response.data)
        setData(jsonData[0])
      } else {
        console.log({ response })
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const downloadInvoice = () => {
    const invoice = document.getElementById('invoice-container')

    html2canvas(invoice).then(function (canvas) {
      const link = document.createElement('a')
      link.download = `${order_id}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    })
  }

  React.useEffect(() => {
    getReservationByID()

    const timer = setTimeout(() => {
      setShowInvoice(true)
      downloadInvoice()
    }, 2000)

    return () => clearTimeout(timer)
  }, [downloadInvoice])

  return (
    <>
      {data && showInvoice ? (
        <section className="bg-white md:flex md:items-center md:justify-center">
          <div className="max-w-5xl pt-5 bg-white md:shadow-md mx-auto md:h-screen">
            <article className="overflow-hidden" id="invoice-container">
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
                        <p>Sunday, 10 August 2024 - 10:00 WIB</p>
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
                            Quantity
                          </th>
                          <th
                            scope="col"
                            className="hidden py-3.5 px-3 text-right text-sm font-normal text-slate-700 sm:table-cell"
                          >
                            Rate
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
                              {data.location}
                            </div>
                            <div className="mt-0.5 text-slate-500 sm:hidden">
                              12 Hours
                            </div>
                            <div className="mt-0.5 text-slate-500 sm:hidden">
                              08/02/2024 - 10.00 : 17.00 WIB
                            </div>
                          </td>
                          <td className="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                            48
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
                            colspan="3"
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
                            colspan="3"
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
                            IDR 4500
                          </td>
                        </tr>
                        <tr>
                          <th
                            scope="row"
                            colspan="3"
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
                            IDR 50000
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
              <Link href={'/'}>
                <Button className="bg-white text-black border-gray-400 rounded-lg px-5 -mt-2 py-6 text-sm font-jakarta hover:bg-white w-full font-medium">
                  Kembali
                </Button>
              </Link>
            </div>
          </div>
        </section>
      ) : showInvoice ? (
        <Loading />
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
