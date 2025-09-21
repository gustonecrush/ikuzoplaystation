'use client'

import React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

import { IoMdAdd } from 'react-icons/io'
import axios from 'axios'

import Toast from '@/app/components/Toast'
import Cookies from 'js-cookie'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import Loading from '@/app/admin/dashboard/components/loading'
import { Badge } from '@/components/ui/badge'
import { Gamepad2, Monitor, Trash2 } from 'lucide-react'

function MaintenanceTimes() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const token = Cookies.get('token')
  const [data, setData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  const [seatFilter, setSeatFilter] = React.useState('')
  const [catalogTxtFilter, setCatalogTxtFilter] = React.useState('')

  const [open, setOpen] = React.useState(false)
  const [idSelected, setIdSelected] = React.useState('')

  const handleDeleteMaintenance = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/maintenances/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      Toast.fire({
        icon: 'success',
        title: 'IKUZOOO!',
        text: `Maintenance telah selesai!`,
      })

      getAllDataMaintenances()
      setIdSelected('')
    } catch (error) {
      console.error({ error })
      setIdSelected('')

      if (error.code == 'ERR_NETWORK') {
        Toast.fire({
          icon: 'success',
          title: 'Oopsss!',
          text: `Perubahan status maintenance gagal!`,
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: 'Oopsss!',
          text: error.response.data,
        })
      }
    }
  }

  const facilityMapping = {
    'PS4 Reguler': [1, 2, 3, 4],
    'Ikuzo Racing Simulator': [6, 7],
    'PS5 Reguler': [5, 8],
    'Squad Open Space': [13, 14, 15, 16],
    'Family Open Space': [17],
    'Family VIP Room': [18, 19],
    'LoveBirds VIP Room': [20, 21, 22],
  }

  const getFacilityName = (seatNumber) => {
    for (const [facility, seats] of Object.entries(facilityMapping)) {
      if (seats.includes(seatNumber)) {
        return facility
      }
    }
    return 'Unknown Facility'
  }

  const getAllDataMaintenances = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/maintenances`,
      )
      if (response.status == 200) {
        let jsonData = response.data.map((row) => ({
          ...row,
          no_seat: String(row.no_seat), // Convert all to string
        }))
        setData(jsonData)
        console.log({ jsonData })
        setIsLoading(false)
      } else {
        setIsLoading(false)
        console.error({ error })
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      setIsLoading(false)
      console.error({ error })
      if (error.code == 'ERR_NETWORK') {
        Toast.fire({
          icon: 'error',
          title: `Data tidak dapat ditampilkan. Koneksi anda terputus, cek jaringan anda!`,
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: `Internal server sedang error, coba lagi nanti!`,
        })
      }
    }
  }

  const [isSetting, setIsSetting] = React.useState(false)
  const handleSettingMaintenance = async (e) => {
    e.preventDefault()
    setIsSetting(true)

    if (checkedSeats.length === 0) {
      Toast.fire({
        icon: 'warning',
        title: 'Pilih setidaknya satu seat!',
      })
      setIsSetting(false)
      return
    }

    try {
      const uploadPromises = checkedSeats.map(async (seat) => {
        const data = new FormData()
        data.append('no_seat', seat)
        data.append('status', 'Maintenance')

        return axios.post(`${baseUrl}/maintenances`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      })

      await Promise.all(uploadPromises)

      Toast.fire({
        icon: 'success',
        title: 'IKUZOOO!',
        text: `Kondisi/keadaan maintenance pada seat telah disetting!`,
      })

      setIsSetting(false)

      setOpen(false)
      getAllDataMaintenances()
      setCheckedSeats([])
      setSelectedSpace('')
      setOpenCreateReservationForm(false)
    } catch (error) {
      console.error({ error })
      setOpenCreateReservationForm(false)
      setOpen(false)
      setIsSetting(false)
      Toast.fire({
        icon: 'error',
        title: 'Oopsss!',
        text: `Kondisi/keadaan maintenance pada set ${seat} gagal disetting!`,
      })
    }
  }

  const [
    openCreateReservationForm,
    setOpenCreateReservationForm,
  ] = React.useState(false)

  React.useEffect(() => {
    getAllDataMaintenances()
  }, [])

  const [selectedSpace, setSelectedSpace] = React.useState('')
  const seatMap = {
    'Regular Space': [1, 2, 3, 4, 5, 6, 7, 8],
    'Premium Space': [13, 14, 15, 16, 17],
    'Private Space': [18, 19, 20, 21, 22],
  }
  const [checkedSeats, setCheckedSeats] = React.useState([])
  const handleSeatChange = (seat) => {
    setCheckedSeats(
      (prevSeats) =>
        prevSeats.includes(seat)
          ? prevSeats.filter((s) => s !== seat) // Hapus jika sudah dicentang
          : [...prevSeats, seat], // Tambahkan jika dicentang
    )
  }

  return (
    <section className="gap-3 border-none rounded-lg mt-5 ">
      <div className="w-full">
        <div className="flex items-center justify-between py-4">
          <div className="flex gap-1">
            <Button
              onClick={(e) =>
                setOpenCreateReservationForm(!openCreateReservationForm)
              }
              variant="outline"
              className="ml-auto"
            >
              Setting Status Maintenance <IoMdAdd className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-[300px] w-full flex-col items-center justify-center py-20">
            <Loading />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data
              .filter((item) => item.status === 'Maintenance')
              .map((item) => {
                const seatNumber = parseInt(item.no_seat, 10)
                const facilityName = getFacilityName(seatNumber)

                return (
                  <Card
                    key={item.id}
                    className="shadow-md border border-orange hover:shadow-lg transition rounded-2xl"
                  >
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-xl font-bold text-orange-600 flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5 text-orange" />
                        Seat {item.no_seat}
                      </CardTitle>
                      <Badge className="bg-orange-100 text-orange-700 text-xs rounded-full px-2">
                        {item.status}
                      </Badge>
                    </CardHeader>

                    <CardContent className="text-sm text-gray-700 space-y-2">
                      <p className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-orange-400" />
                        {facilityName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Updated: {new Date(item.updated_at).toLocaleString()}
                      </p>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                      <Button
                        variant="destructive"
                        className="bg-orange hover:bg-orange rounded-full px-4 py-2 shadow-sm"
                        onClick={() => handleDeleteMaintenance(item.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Stop Maintenance
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
          </div>
        )}
      </div>

      <AlertDialog className="bg-black/20" open={openCreateReservationForm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Setting Maintenance</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="-mt-2">
                Setting status posisi pada space yang sedang dalam keadaan atau
                kondisi maintenance!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <fieldset>
            <form className="flex flex-col gap-2">
              <div>
                <label className="block">
                  <span className="font-medium">Select Space</span>
                  <select
                    value={selectedSpace}
                    onChange={(e) => setSelectedSpace(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring focus:ring-orange-300"
                  >
                    <option value="">Pilih Space</option>
                    <option value="Regular Space">Regular Space</option>
                    <option value="Private Space">Private Space</option>
                    <option value="Premium Space">Premium Space</option>
                  </select>
                </label>

                {selectedSpace && seatMap[selectedSpace] && (
                  <div>
                    <label className="text-black" htmlFor="nama">
                      No Seat
                    </label>
                    {seatMap[selectedSpace].map((seat) => {
                      const facilityName = getFacilityName(seat) // Dapatkan nama fasilitas
                      const isChecked = checkedSeats.includes(seat)
                      return (
                        <span key={seat} className="block">
                          <input
                            type="checkbox"
                            value={`${seat}`}
                            onChange={() => handleSeatChange(seat)}
                          />{' '}
                          Seat {seat} - {facilityName}
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            </form>
          </fieldset>

          <AlertDialogFooter>
            {isSetting ? (
              <Button type="outline" disabled>
                Processing...
              </Button>
            ) : (
              <>
                <AlertDialogCancel
                  onClick={(e) => setOpenCreateReservationForm(false)}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={(e) => handleSettingMaintenance(e)}>
                  Setting
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}

export default MaintenanceTimes
