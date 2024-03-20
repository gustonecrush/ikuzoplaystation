'use client'

import Image from 'next/image'
import React from 'react'
import Reservation from '../components/Reservations'
import Card from '@/app/components/Card'
import TableReservations from '@/app/components/TableReservations'

import { FaRupiahSign } from 'react-icons/fa6'

import { FaCircleUser } from 'react-icons/fa6'

import { HiMiniQuestionMarkCircle } from 'react-icons/hi2'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

import { FiEdit3 } from 'react-icons/fi'
import { AiOutlineDelete } from 'react-icons/ai'
import { ArrowUpDown } from 'lucide-react'
import { IoIosInformationCircle } from 'react-icons/io'

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

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

import { ColumnDef } from '@tanstack/react-table'

import { MdPaid } from 'react-icons/md'
import { MdOutlineAccessTimeFilled } from 'react-icons/md'
import { TiTimes } from 'react-icons/ti'
import { IoLogoGameControllerB } from 'react-icons/io'
import { MdOutlineDoneAll } from 'react-icons/md'
import { HiPhone } from 'react-icons/hi2'
import { HiCalendar } from 'react-icons/hi'
import { FaMoneyBillWaveAlt } from 'react-icons/fa'
import { PiHouseSimpleFill } from 'react-icons/pi'
import { BiSolidTime } from 'react-icons/bi'
import { BiSolidTimeFive } from 'react-icons/bi'
import { TbNumber } from 'react-icons/tb'
import { AiFillEdit } from 'react-icons/ai'
import Toast from '@/app/components/Toast'
import Loading from '../components/loading'
import { Fade } from 'react-awesome-reveal'
import { handleLogout } from '../../utils/logout'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { IoDocument, IoGameControllerSharp } from 'react-icons/io5'
import { Cross2Icon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { formatDateOnTheUI } from '@/utils/date'

function page() {
  const [data, setData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [isCreatingReservation, setIsCreatingReservation] = React.useState(
    false,
  )
  const [rowSelection, setRowSelection] = React.useState({})
  const columns = [
    {
      accessorKey: 'reserve_id',
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
      accessorKey: 'reserve_id',
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
          <Drawer>
            <DrawerTrigger>
              <Button
                variant="outline"
                className="border-black border-opacity-5 bg-black bg-opacity-10 text-xs text-black"
              >
                <IoIosInformationCircle className="h-4 w-4" /> Info
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-3/4">
              <DrawerHeader>
                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                <DrawerDescription>
                  This action cannot be undone.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <Button
            variant="outline"
            className=" border border-yellow-500 hover:bg-yellow-500 bg-yellow-200 bg-opacity-10 text-xs  text-yellow-500"
          >
            <FiEdit3 className="h-4 w-4" /> Edit
          </Button>
          <form action="" method="post">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-auto border border-red-500 bg-red-500 hover:bg-red-200 bg-opacity-10 text-xs text-red-500"
                >
                  <AiOutlineDelete className="h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </div>
      ),
    },
    {
      accessorKey: 'reserve_id',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={''}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            ID Reservasi
            <TbNumber className="ml-2 h-5 w-5" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className={`text-center capitalize`}>
          {row.getValue('reserve_id')}
        </div>
      ),
    },
    {
      accessorKey: 'invoice',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={''}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Invoice
            <IoDocument className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <Link
          target="_blank"
          href={process.env.NEXT_PUBLIC_IMAGE_URL + row.getValue('invoice')}
          className={`text-center text-black`}
        >
          <Badge
            className={`flex w-fit items-center gap-1 border bg-opacity-15 border-gray-500 bg-gray-500 text-gray-500 hover:bg-gray-600
            `}
          >
            {<IoDocument />} invoice
          </Badge>
        </Link>
      ),
    },
    {
      accessorKey: 'status_reserve',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex w-fit items-center justify-center"
          >
            Status
            <br /> Pembayaran
            <FaMoneyBillWaveAlt className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-center text-center">
          <Badge
            className={`flex w-fit items-center gap-1 border bg-opacity-15 ${
              row.getValue('status_reserve') == 'settlement'
                ? 'border-green-500 bg-green-500 text-green-600'
                : row.getValue('status_reserve') == 'pending'
                ? 'border-yellow-500 bg-yellow-500 text-yellow-500'
                : 'border-red-500 bg-red-500 text-red-500'
            }`}
          >
            {' '}
            {row.getValue('status_reserve') == 'settlement' && <MdPaid />}
            {row.getValue('status_reserve') == 'pending' && (
              <MdOutlineAccessTimeFilled />
            )}
            {row.getValue('status_reserve') != 'pending' &&
              row.getValue('status_reserve') != 'settlement' && <TiTimes />}
            {row.getValue('status_reserve') == 'settlement'
              ? 'paid'
              : row.getValue('status_reserve')}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'status_payment',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex w-full items-center justify-center"
          >
            Status
            <br /> Reservasi
            <IoLogoGameControllerB className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-center text-center">
          <Badge
            className={`flex w-fit items-center gap-1 border bg-opacity-15 ${
              row.getValue('status_payment') == 'done'
                ? 'border-blue-500 bg-blue-500 text-blue-600'
                : row.getValue('status_payment') == 'not playing'
                ? 'border-purple-400 bg-purple-500 text-purple-600'
                : 'border-gray-500 bg-gray-500 text-gray-700'
            }`}
          >
            {' '}
            {row.getValue('status_payment') == 'playing' && (
              <IoLogoGameControllerB />
            )}
            {row.getValue('status_payment') == 'done' && <MdOutlineDoneAll />}
            {row.getValue('status_payment') != 'playing' &&
              row.getValue('status_payment') != 'done' && (
                <HiMiniQuestionMarkCircle />
              )}
            {row.getValue('status_payment') == 'settlement'
              ? 'paid'
              : row.getValue('status_payment')}
          </Badge>
        </div>
      ),
    },

    {
      accessorKey: 'reserve_name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nama Customer
            <FaCircleUser className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="text-center capitalize">
          {row.getValue('reserve_name')}
        </div>
      ),
    },
    {
      accessorKey: 'price',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="w-full"
          >
            Harga
            <FaRupiahSign className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="w-full text-center">
          Rp {parseInt(row.getValue('price')).toLocaleString('id-ID')}
        </div>
      ),
    },
    {
      accessorKey: 'reserve_contact',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-[150px] text-center "
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nomor Tlp
            <HiPhone className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="w-[150px] text-center">
          {row.getValue('reserve_contact')}
        </div>
      ),
    },
    {
      accessorKey: 'location',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Lantai Reservasi
            <PiHouseSimpleFill className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue('location')}</div>
      ),
    },
    {
      accessorKey: 'position',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Posisi
            <TbNumber className="ml-2 h-6 w-6" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue('position')}</div>
      ),
    },
    {
      accessorKey: 'reserve_date',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="w-full"
          >
            Tanggal Reservasi
            <HiCalendar className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="w-full text-center">
          {formatDateOnTheUI(row.getValue('reserve_date'))}
        </div>
      ),
    },
    {
      accessorKey: 'reserve_start_time',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="w-full"
          >
            Waktu Mulai
            <BiSolidTime className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="w-full text-center ">
          {row.getValue('reserve_start_time')} WIB
        </div>
      ),
    },
    {
      accessorKey: 'reserve_end_time',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="w-full"
          >
            Waktu Berakhir
            <BiSolidTimeFive className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="w-2/3 text-center ">
          {row.getValue('reserve_end_time')} WIB
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Created at
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="text-center">
          {formatDateOnTheUI(row.getValue('created_at'))}
        </div>
      ),
    },
    {
      accessorKey: 'updated_at',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Updated at
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="text-center">
          {formatDateOnTheUI(row.getValue('updated_at'))}
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

  const getAllDataReservations = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reservations`,
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

  const [
    openCreateReservationForm,
    setOpenCreateReservationForm,
  ] = React.useState(false)

  React.useEffect(() => {
    getAllDataReservations()
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
            className="relative w-16 p-4 bg-yellow-100 text-orange rounded-2xl mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
              />
            </svg>
          </a>
          <a
            href="/admin/dashboard/contents"
            className="w-16 p-4 border text-gray-700 rounded-2xl mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </a>
          <a
            href="#"
            onClick={() => handleLogout()}
            className="w-16 p-4 mt-10 border text-gray-700 rounded-2xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </a>
        </nav>
      </section>
      <section className="flex flex-col pt-3 w-10/12 bg-white h-full overflow-y-scroll">
        {openCreateReservationForm ? (
          <Reservation />
        ) : (
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
                  <h1 className="text-4xl font-semibold">Reservations</h1>
                  <p className="text-base font-normal text-gray-400">
                    Lihat list reservasi yang ada
                  </p>
                </div>
              </Fade>
            </div>
            <section className="gap-3 px-5 ml-8 bg-white shadow-md rounded-lg mt-5 ">
              <Card extra="mt-6 p-5 text-base">
                <div className="w-full">
                  <div className="flex items-center justify-between py-4">
                    <Input
                      placeholder="Cari ID Reservasi..."
                      value={
                        table.getColumn('reserve_id')?.getFilterValue() ?? ''
                      }
                      onChange={(event) =>
                        table
                          .getColumn('reserve_id')
                          ?.setFilterValue(event.target.value)
                      }
                      className="max-w-sm"
                    />
                    <div className="flex gap-1">
                      <Button
                        onClick={(e) =>
                          setOpenCreateReservationForm(
                            !openCreateReservationForm,
                          )
                        }
                        variant="outline"
                        className="ml-auto"
                      >
                        Tambah Reservasi <IoMdAdd className="ml-2 h-4 w-4" />
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
            </section>
          </>
        )}
        {/* <Reservation /> */}
      </section>
    </main>
  )
}

export default page
