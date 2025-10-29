'use client'

import { Fade } from 'react-awesome-reveal'
import { Separator } from '@/components/ui/separator'
import LoaderHome from '../components/LoaderHome'

export default function ReservationSummary({
  isLoading = false,
  idReservasi,
  namaReservasi,
  nomorWhatsappReservasi,
  selectedDate,
  startTimeReservasi,
  endTimeReservasi,
  totalTime,
  namaPosisiReservasi,
  posisiReservasi,
  totalHarga,
  serviceCharge = 4000,
  formatDate,
  className = '',
}) {
  return (
    <div className="flex flex-col gap-3 px-5 bg-gray-700 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 border-opacity-25 shadow-md rounded-lg mt-5 py-7">
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center w-full">
            <LoaderHome />
          </div>
        ) : (
          <div className={className}>
            <Fade>
              <div className="space-y-1">
                <h4 className="text-base font-jakarta font-medium leading-none text-white">
                  ID Reservasi
                </h4>
                <p className="text-base font-jakarta text-gray-300">
                  {idReservasi}
                </p>
              </div>
            </Fade>
            <Separator className="my-2" />

            <Fade>
              <div className="space-y-1">
                <h4 className="text-base font-jakarta font-medium leading-none text-white">
                  Nama
                </h4>
                <p className="text-base font-jakarta text-gray-300">
                  {namaReservasi}
                </p>
              </div>
            </Fade>
            <Separator className="my-2" />

            <Fade>
              <div className="space-y-1">
                <h4 className="text-base font-jakarta font-medium leading-none text-white">
                  No Whatsapp
                </h4>
                <p className="text-base font-jakarta text-gray-300">
                  {nomorWhatsappReservasi}
                </p>
              </div>
            </Fade>
            <Separator className="my-2" />

            <Fade>
              <div className="space-y-1">
                <h4 className="text-base font-jakarta font-medium leading-none text-white">
                  Tanggal Reservasi
                </h4>
                <p className="text-base font-jakarta text-gray-300">
                  {formatDate(selectedDate)}
                </p>
              </div>
            </Fade>
            <Separator className="my-2" />

            <Fade>
              <div className="space-y-1">
                <h4 className="text-base font-jakarta font-medium leading-none text-white">
                  Waktu Reservasi
                </h4>
                <p className="text-base font-jakarta text-gray-300">
                  {startTimeReservasi} - {endTimeReservasi} - {totalTime} Hours
                </p>
              </div>
            </Fade>
            <Separator className="my-2" />

            <Fade>
              <div className="space-y-1">
                <h4 className="text-base font-jakarta font-medium leading-none text-white">
                  Detail Tempat
                </h4>
                <p className="text-base font-jakarta text-gray-300">
                  in {namaPosisiReservasi}, Position {posisiReservasi}
                </p>
              </div>
            </Fade>
            <Separator className="my-2" />

            <Fade>
              <div className="space-y-1">
                <h4 className="text-base font-jakarta font-medium leading-none text-white">
                  Total Harga
                </h4>
                <p className="text-base font-jakarta text-gray-300">
                  Rp {totalHarga}
                </p>
              </div>
            </Fade>
            <Separator className="my-2" />

            <Fade>
              <div className="space-y-1">
                <h4 className="text-base font-jakarta font-medium leading-none text-white">
                  Service Charge
                </h4>
                <p className="text-base font-jakarta text-gray-300">
                  Rp {serviceCharge}
                </p>
              </div>
            </Fade>
          </div>
        )}
      </div>
    </div>
  )
}
