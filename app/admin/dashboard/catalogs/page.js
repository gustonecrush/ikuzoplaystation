'use client'

import Image from 'next/image'
import React from 'react'
import Card from '@/app/components/Card'
import TableReservations from '@/app/components/TableReservations'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { FiEdit3 } from 'react-icons/fi'
import { AiOutlineDelete } from 'react-icons/ai'
import { ArrowUpDown } from 'lucide-react'
import { IoIosInformationCircle, IoMdImages } from 'react-icons/io'

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { Calendar } from '@/components/ui/calendar'

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

import { IoMdAdd } from 'react-icons/io'
import axios from 'axios'

import { HiCalendar } from 'react-icons/hi'
import { addDays, subDays } from 'date-fns'
import { AiFillEdit } from 'react-icons/ai'
import Toast from '@/app/components/Toast'
import Loading from '../components/loading'
import { Fade } from 'react-awesome-reveal'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { IoBook, IoCalendarClear, IoLogOut, IoTime } from 'react-icons/io5'
import { formatDateOnTheUI, getCurrentDate, getMaxDate } from '@/utils/date'

import { IoGameController, IoLaptopSharp } from 'react-icons/io5'
import { MdOutlineChair } from 'react-icons/md'

function page() {
  const [data, setData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [statusPlaying, setStatusPlaying] = React.useState('')

  const [date, setDate] = React.useState(null)
  const [selectedDate, setSelectedDate] = React.useState('')
  const [date2, setDate2] = React.useState(null)
  const [selectedDate2, setSelectedDate2] = React.useState('')
  const [currentDate, setCurrentDate] = React.useState(getCurrentDate)
  const [maxDate, setMaxDate] = React.useState(getMaxDate)

  const [open, setOpen] = React.useState(false)
  const [openUpdate, setOpenUpdate] = React.useState(false)
  const [idSelected, setIdSelected] = React.useState('')

  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  // function to handle delete
  const handleDeleteCatalogData = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/catalogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status == 200) {
        const jsonData = await response.data
        console.log({ jsonData })
      } else {
        console.error({ error })
        throw new Error('Failed to fetch data')
      }

      Toast.fire({
        icon: 'success',
        title: `Catalog  berhasil dihapus!`,
      })

      getAllDataCatalogs()
      setIdSelected('')
    } catch (error) {
      console.error({ error })
      setIdSelected('')

      if (error.code == 'ERR_NETWORK') {
        Toast.fire({
          icon: 'error',
          title: `Catalog gagal dihapus!`,
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: error.response.data,
        })
      }
    }
  }

  const clearFormCustomTime = () => {
    setSelectedDate2('')
    setSelectedDate('')
    setData('')
  }

  const handleUploadCustomTime = async (e) => {
    e.preventDefault()

    const data = {
      start_date: selectedDate,
      end_date: selectedDate2 == '' ? selectedDate : selectedDate2,
    }

    try {
      const response = await axios.post(`${baseUrl}/dates`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status == 200) {
        const jsonData = await response.data
        console.log({ jsonData })
      } else {
        console.error({ error })
        throw new Error('Failed to fetch data')
      }

      Toast.fire({
        icon: 'success',
        title: `Setting waktu berhasil ditambahkan!`,
      })

      getAllDataCatalogs()
      setOpenCreateReservationForm(false)
      clearFormCustomTime()
    } catch (error) {
      console.error({ error })

      if (error.code == 'ERR_NETWORK') {
        Toast.fire({
          icon: 'error',
          title: `Setting waktu gagal ditambahkan!`,
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: `Internal server sedang error, coba lagi nanti!`,
        })
      }

      clearFormCustomTime()
      setOpenCreateReservationForm(false)
    }
  }

  const handleOpenUpdate = (id) => {
    setIdSelected(id)
    setOpenUpdate(true)
    setOpenCreateReservationForm(true)
  }
  const handleUpdateFacilityContent = async (id) => {
    const data = {
      start_date: selectedDate,
      end_date: selectedDate2 == '' ? selectedDate : selectedDate2,
    }

    try {
      const response = await axios.post(`${baseUrl}/dates/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status == 200) {
        const jsonData = await response.data
        console.log({ jsonData })
      } else {
        console.error({ error })
        throw new Error('Failed to fetch data')
      }

      Toast.fire({
        icon: 'success',
        title: `Setting tanggal berhasil diupdate!`,
      })

      getAllDataCatalogs()
      clearFormCustomTime()
      setOpenUpdate(false)
      setOpenCreateReservationForm(false)
    } catch (error) {
      console.error({ error })
      clearFormCustomTime()

      if (error.code == 'ERR_NETWORK') {
        Toast.fire({
          icon: 'error',
          title: `Setting waktu gagal diupdate!`,
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: `Internal server sedang error, coba lagi nanti!`,
        })
      }
      setOpenUpdate(false)

      setOpenCreateReservationForm(false)
    }
  }
  const columns = [
    {
      accessorKey: 'id',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`w-fit`}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            No
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className={`text-center uppercase`}>{row.index + 1}</div>
      ),
    },
    {
      accessorKey: 'id',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`flex w-full items-center justify-center`}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Action
            <AiFillEdit className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className={`flex items-center justify-center gap-1`}>
          <Button
            variant="outline"
            className="border-black border-opacity-5 bg-black bg-opacity-10 text-xs text-black"
          >
            <IoIosInformationCircle className="h-4 w-4" /> Info
          </Button>

          <AlertDialog className="bg-black/20">
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border border-red-500 hover:bg-red-500 bg-red-200 bg-opacity-10 text-xs  text-red-500"
              >
                <AiOutlineDelete className="h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your content and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => handleDeleteCatalogData(row.getValue('id'))}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
    {
      accessorKey: 'no_seat',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="w-fit px-0 text-left mx-0"
          >
            No Seat
            <MdOutlineChair className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="w-full text-left">
          <span className="font-bold">Seat {row.getValue('no_seat')}</span>
          <p>{row.original.catalog_txt}</p>
        </div>
      ),
    },
    {
      accessorKey: 'catalog_img',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="w-fit"
          >
            Catalog Image
            <IoMdImages className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="w-fit text-center flex items-center">
          {' '}
          <Image
            src={
              process.env.NEXT_PUBLIC_IMAGE_URL + row.getValue('catalog_img')
            }
            width={0}
            height={0}
            className="w-24"
          />
        </div>
      ),
    },
  ]
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const token = Cookies.get('token')

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${baseUrl}/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status == 200) {
        Cookies.remove('token')
        Toast.fire({
          icon: 'success',
          title: `Berhasil logout dari dashboard!`,
        })
        console.log({ response })

        router.replace('/admin/login')
      } else {
        Toast.fire({
          icon: 'error',
          title: `Gagal logout dari dashboard!`,
        })
        console.log({ response })
      }
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: `Gagal logout dari dashboard!`,
      })
      console.error({ error })
    }
  }

  console.log(data)

  const getAllDataCatalogs = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/catalogs`,
      )
      if (response.status == 200) {
        const jsonData = await response.data
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

  const [noSeat, setNoSeat] = React.useState(null)
  const [catalogTxt, setCatalogTxt] = React.useState('')
  const [catalogImg, setCatalogImg] = React.useState(null)

  const handleFileChange = (e) => {
    setCatalogImg(e.target.files[0])
  }

  const handleUploadNewCatalogOnSeat = async (e) => {
    e.preventDefault()

    const data = new FormData()
    data.append('no_seat', noSeat)
    data.append('catalog_img', catalogImg)
    data.append('catalog_txt', catalogTxt)

    try {
      const response = await axios.post(`${baseUrl}/catalogs`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      Toast.fire({
        icon: 'success',
        title: `Data katalog seat berhasil diupload!`,
      })

      console.log(response)

      setOpen(false)
      getAllDataCatalogs()
      setNoSeat(null)
      setCatalogImg(null)
      setCatalogTxt(null)
      setOpenCreateReservationForm(false)
    } catch (error) {
      console.error({ error })
      setOpenCreateReservationForm(false)
      setOpen(false)
      Toast.fire({
        icon: 'error',
        title: `Data katalog seat gagal diupload!`,
      })
    }
  }

  const [
    openCreateReservationForm,
    setOpenCreateReservationForm,
  ] = React.useState(false)

  React.useEffect(() => {
    getAllDataCatalogs()
  }, [])

  return (
    <main className="flex w-full h-screen rounded-3xl">
      <section className="flex h-full flex-col w-2/12 pt-8 bg-white shadow-md rounded-l-3xl">
        <div className="mx-auto p-4  rounded-2xl text-white">
          <Image
            src={'/logo-orange.png'}
            alt="Ikuzo Playstation Logo"
            width={0}
            height={0}
            className="w-[150px]"
          />
        </div>
        <nav className="relative flex flex-col py-4 items-center">
          <a
            href="/admin/dashboard/reservations"
            className="w-16 h-16 p-4 border text-gray-400 flex items-center justify-center rounded-2xl mb-4"
          >
            <IoGameController className="text-4xl" />
          </a>
          <a
            href="/admin/dashboard/contents"
            className="w-16 h-16 p-4 border text-gray-400 flex items-center justify-center rounded-2xl mb-4"
          >
            <IoLaptopSharp className="text-4xl" />
          </a>
          <a
            href="/admin/dashboard/times"
            className="w-16 h-16 p-4 border text-gray-400 flex items-center justify-center rounded-2xl mb-4"
          >
            <IoTime className="text-4xl" />
          </a>
          <a
            href="/admin/dashboard/catalogs"
            className="relative w-16 h-16 p-4 bg-yellow-100 flex items-center justify-center text-orange rounded-2xl mb-4"
          >
            <IoBook className="text-4xl" />
          </a>
          <a
            href="/admin/dashboard/dates"
            className="w-16 h-16 p-4 border text-gray-400 flex items-center justify-center rounded-2xl mb-4 "
          >
            <IoCalendarClear className="text-4xl" />
          </a>
          <a
            href="#"
            onClick={() => handleLogout()}
            className="w-16 h-16 p-4 mt-10 border text-gray-400 rounded-2xl"
          >
            <IoLogOut className="text-4xl" />
          </a>
        </nav>
      </section>
      <section className="flex flex-col pt-3 w-10/12 bg-white h-full overflow-y-scroll">
        <>
          <div className=" w-fit py-5 px-7 text-black bg-white rounded-lg  flex flex-row gap-3 items-center">
            <Fade>
              <Image
                src={'/checkout.png'}
                width={0}
                height={0}
                alt={'Reservation'}
                className="w-20"
              />
            </Fade>

            <Fade>
              <div className="flex flex-col">
                <h1 className="text-4xl font-semibold">Catalogs</h1>
                <p className="text-base font-normal text-gray-400">
                  Tambahkan catalog game pada setiap seat!
                </p>
              </div>
            </Fade>
          </div>
          <section className="gap-3 px-5 ml-8 bg-white shadow-md rounded-lg mt-5 ">
            <Card extra="mt-6 p-5 text-base">
              <div className="w-full">
                <div className="flex items-center justify-between py-4">
                  <Input
                    placeholder="Cari Tanggal..."
                    value={
                      table.getColumn('start_date')?.getFilterValue() ?? ''
                    }
                    onChange={(event) =>
                      table
                        .getColumn('start_date')
                        ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                  />
                  <div className="flex gap-1">
                    <Button
                      onClick={(e) =>
                        setOpenCreateReservationForm(!openCreateReservationForm)
                      }
                      variant="outline"
                      className="ml-auto"
                    >
                      Tambahkan Catalog Game{' '}
                      <IoMdAdd className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex h-[300px] w-full flex-col items-center justify-center py-20">
                    <Loading />
                  </div>
                ) : (
                  <TableReservations
                    isLoading={isLoading}
                    columns={columns}
                    table={table}
                    type={'short'}
                  />
                )}

                <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <AlertDialog
              className="bg-black/20"
              open={openCreateReservationForm}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tambahkan Catalog</AlertDialogTitle>
                  <AlertDialogDescription>
                    <p className="-mt-2">
                      Upload Catalog Sebanyak - Banyaknya pada Seat Booking!
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <fieldset>
                  <form className="flex flex-col gap-2">
                    <>
                      <div>
                        <label className="text-black" htmlFor="nama">
                          No Seat
                        </label>
                        <input
                          type="number"
                          value={noSeat}
                          onChange={(e) => setNoSeat(e.target.value)}
                          name="no_seat"
                          id="no_seat"
                          placeholder="Masukkan No Seat"
                          className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg px-3 py-2 active:border-orange focus:border-orange outline-none focus:outline-orange  w-full "
                          required
                        />
                      </div>

                      <div>
                        <label className="text-black" htmlFor="nama">
                          Catalog Text
                        </label>
                        <textarea
                          type="text"
                          value={catalogTxt}
                          onChange={(e) => setCatalogTxt(e.target.value)}
                          name="catalog_txt"
                          id="catalog_txt"
                          placeholder="Masukkan deskripsi catalog"
                          className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg px-3 py-2 active:border-orange focus:border-orange outline-none focus:outline-orange  w-full "
                        ></textarea>
                      </div>

                      <div className="grid gap-4 py-0">
                        <div className="flex flex-col items-start gap-1">
                          <label className="text-black" htmlFor="nama">
                            Catalog Image
                          </label>
                          <Input
                            id="pict"
                            onChange={handleFileChange}
                            type="file"
                            className="col-span-3"
                          />
                        </div>
                      </div>
                    </>
                  </form>
                </fieldset>

                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={(e) => setOpenCreateReservationForm(false)}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) =>
                      openUpdate
                        ? handleUpdateFacilityContent(idSelected)
                        : handleUploadNewCatalogOnSeat(e)
                    }
                  >
                    Upload
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </section>
        </>

        {/* <Reservation /> */}
      </section>
    </main>
  )
}

export default page