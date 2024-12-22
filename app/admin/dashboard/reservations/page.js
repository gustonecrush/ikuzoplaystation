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

import { FiEdit3, FiEye } from 'react-icons/fi'
import { AiOutlineDelete } from 'react-icons/ai'
import { ArrowUpDown } from 'lucide-react'
import { IoIosInformationCircle, IoMdCalendar } from 'react-icons/io'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

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
import {
  PiGearBold,
  PiHouseSimpleFill,
  PiMicrosoftExcelLogoFill,
} from 'react-icons/pi'
import { BiHide, BiSolidTime } from 'react-icons/bi'
import { BiSolidTimeFive } from 'react-icons/bi'
import { TbNumber } from 'react-icons/tb'
import { AiFillEdit } from 'react-icons/ai'
import Toast from '@/app/components/Toast'
import Loading from '../components/loading'
import { Fade } from 'react-awesome-reveal'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import {
  IoBook,
  IoBookOutline,
  IoDocument,
  IoGameControllerSharp,
  IoLogOut,
  IoMoveOutline,
  IoTime,
} from 'react-icons/io5'
import { Cross2Icon } from '@radix-ui/react-icons'
import Link from 'next/link'
import {
  convertToDate,
  formatDate,
  formatDateOnTheUI,
  generateTimeArray,
  generateTimeArrayWithStep,
  getCurrentDate,
  getMaxDate,
} from '@/utils/date'

import {
  IoGameController,
  IoLaptopSharp,
  IoCalendarClear,
} from 'react-icons/io5'
import { Statistics } from '@/app/components'
import { Calendar } from '@/components/ui/calendar'
import { addDays, subDays } from 'date-fns'

function page() {
  const [data, setData] = React.useState([])
  const [isHide, setIsHide] = React.useState(false)
  const hideSuccessPayment = () => {
    const filteredData = data.filter(
      (item) => item.status_reserve !== 'settlement',
    )

    setData(filteredData)
  }

  const [reservesPosition, setReservesPosition] = React.useState([])

  const getAllReservationsPositon = async (date) => {
    try {
      const response = await axios.get(
        `${baseUrl}/reservations?reserve_date=${date}`,
      )
      console.log(`${baseUrl}/reservations?reserve_date=${date}`)
      if (response.status == 200) {
        const jsonData = await response.data

        setReservesPosition(jsonData)
        console.log(response.data)

        setIsLoading(false)
      } else {
        setIsLoading(false)
        console.log({ response })
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      console.log(error)

      setIsLoading(false)
    }
  }

  const [total, setTotal] = React.useState({
    reservations: 0,
    prices: 0,
    success_payment: 0,
    pending_payment: 0,
  })
  const [isLoading, setIsLoading] = React.useState(false)
  const [statusPlaying, setStatusPlaying] = React.useState('')

  const [open, setOpen] = React.useState(false)
  const [openUpdate, setOpenUpdate] = React.useState(false)
  const [idSelected, setIdSelected] = React.useState('')

  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [isCreatingReservation, setIsCreatingReservation] = React.useState(
    false,
  )
  const [rowSelection, setRowSelection] = React.useState({})
  // function to handle delete
  const handleDeleteFacilityContent = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/reservations/${id}`)
      if (response.status == 200) {
        const jsonData = await response.data
        console.log({ jsonData })
      } else {
        console.error({ error })
        throw new Error('Failed to fetch data')
      }

      Toast.fire({
        icon: 'success',
        title: `Data reservasi berhasil dihapus!`,
      })

      getAllDataReservations()
      setIdSelected('')
      getAllDataStatistics()
    } catch (error) {
      console.error({ error })
      setIdSelected('')

      if (error.code == 'ERR_NETWORK') {
        Toast.fire({
          icon: 'error',
          title: `Data reservasi gagal dihapus!`,
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: error.response.data,
        })
      }
    }
  }

  const [openFormMoveCustomer, setOpenFormMoveCustomer] = React.useState(false)
  const [idSelectedMove, setIdSelectedMove] = React.useState('')
  const [selectedReservationMove, setSelectedReservationMove] = React.useState(
    [],
  )
  const [maxDateMove, setMaxDateMove] = React.useState(getMaxDate)
  const [dateMove, setDateMove] = React.useState(null)
  const [selectedDateMove, setSelectedDateMove] = React.useState('')
  const [currentDateMove, setCurrentDateMove] = React.useState(getCurrentDate)

  const [startTimeReservasi, setStartTimeReservasi] = React.useState('')
  const [endTimeReservasi, setEndTimeReservasi] = React.useState('')
  const [customTimeSelected, setCustomTimeSelected] = React.useState([])

  const getTimeSelected = async (date) => {
    try {
      const response = await axios.get(`${baseUrl}/times?selected_date=${date}`)
      console.log(`${baseUrl}/times?selected_date=${date}`)
      if (response.status == 200) {
        const jsonData = await response.data

        if (jsonData.data.length > 0) {
          setCustomTimeSelected(jsonData.data)
        } else {
          setCustomTimeSelected([])
        }

        console.log({ customTimeSelected })
      } else {
        console.log({ response })
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  const [bookedSlots, setBookedSlots] = React.useState([])

  const timeArray = generateTimeArrayWithStep(startTimeReservasi, bookedSlots)

  const fetchingAvailableReservation = async (date, position) => {
    console.log('fetching')
    getAllReservation(date, position)
    console.log('fetching', reserves)
  }

  const handleGetReservationById = async (id) => {
    setIdSelected(id)
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL + '/reservations?reserve_id=' + id,
      )
      if (response.status == 200) {
        const jsonData = await response.data
        setSelectedReservationMove(jsonData)
        setSelectedDateMove(jsonData[0].reserve_date)
        setStartTimeReservasi(jsonData[0].reserve_start_time)
        setEndTimeReservasi(jsonData[0].reserve_end_time)
        setDateMove(jsonData[0].reserve_date)
        const nextDay = addDays(jsonData[0].reserve_date, 1)
        getAllReservationsPositon(nextDay.toISOString().split('T')[0])
        getTimeSelected(nextDay.toISOString().split('T')[0])
        fetchingAvailableReservation(
          jsonData[0].reserve_date,
          jsonData[0].position,
        )
        console.log({ jsonData })
        setIsLoading(false)
        setOpenFormMoveCustomer(!openFormMoveCustomer)
        console.log({ startTimeReservasi })
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

  console.log({ customTimeSelected })
  console.log({ bookedSlots })
  console.log({ startTimeReservasi })

  const handleOpenUpdate = (id) => {
    setIdSelected(id)
    setOpenUpdate(true)
  }

  const [dateClose, setDateClose] = React.useState([])

  const getDateClosed = async (date) => {
    try {
      const response = await axios.get(`${baseUrl}/dates`)
      if (response.status == 200) {
        const jsonData = await response.data

        setDateClose(jsonData.data)

        console.log({ customTimeSelected })
      } else {
        console.log({ response })
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  const handleChangeSeatCustomer = async (id) => {
    const data = new FormData()
    data.append('location', typeSeatPlaying)
    data.append('position', selectedSeat)

    try {
      const response = await axios.post(
        `${baseUrl}/reservations/seat/${idSelected}`,
        data,
      )
      if (response.status == 200) {
        const jsonData = await response.data
        console.log({ jsonData })
      } else {
        console.error({ error })
        throw new Error('Failed to fetch data')
      }

      Toast.fire({
        icon: 'success',
        title: `Data reservasi berhasil diupdate!`,
      })

      getAllDataReservations()
      getAllDataStatistics()

      setStatusPlaying('')
      setOpenUpdate(false)
      setIdSelected('')
      setOpenFormMoveCustomer(!openFormMoveCustomer)
    } catch (error) {
      console.error({ error })
      setStatusPlaying('')

      if (error.code == 'ERR_NETWORK') {
        Toast.fire({
          icon: 'error',
          title: `Data reservasi gagal diupdate!`,
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: `Internal server sedang error, coba lagi nanti!`,
        })
      }
      setOpenUpdate(false)
    }
  }

  const handleUpdateFacilityContent = async (id) => {
    const payload = {
      status_payment: statusPlaying,
    }

    try {
      const response = await axios.post(
        `${baseUrl}/reservations/${id}`,
        payload,
      )
      if (response.status == 200) {
        const jsonData = await response.data
        console.log({ jsonData })
      } else {
        console.error({ error })
        throw new Error('Failed to fetch data')
      }

      Toast.fire({
        icon: 'success',
        title: `Data reservasi berhasil diupdate!`,
      })

      getAllDataReservations()
      getAllDataStatistics()

      setStatusPlaying('')
      setOpenUpdate(false)
    } catch (error) {
      console.error({ error })
      setStatusPlaying('')

      if (error.code == 'ERR_NETWORK') {
        Toast.fire({
          icon: 'error',
          title: `Data reservasi gagal diupdate!`,
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: `Internal server sedang error, coba lagi nanti!`,
        })
      }
      setOpenUpdate(false)
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
          <Button
            variant="outline"
            className="border-black border-opacity-5 bg-black bg-opacity-10 text-xs text-black"
          >
            <IoIosInformationCircle className="h-4 w-4" /> Info
          </Button>
          <Button
            variant="outline"
            onClick={(e) => {
              handleGetReservationById(row.original.reserve_id)
            }}
            className="border-blue-500 border-opacity-5 bg-blue-500 bg-opacity-10 text-xs text-blue-500"
          >
            <IoMoveOutline className="h-4 w-4" /> Move
          </Button>
          <Button
            onClick={(e) => handleOpenUpdate(row.getValue('reserve_id'))}
            variant="outline"
            className=" border border-yellow-500 hover:bg-yellow-500 bg-yellow-200 bg-opacity-10 text-xs  text-yellow-500"
          >
            <FiEdit3 className="h-4 w-4" /> Edit
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
                  onClick={(e) =>
                    handleDeleteFacilityContent(row.getValue('reserve_id'))
                  }
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
      accessorKey: 'id',
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
          {row.original.reserve_id}
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
          href={
            row.getValue('invoice') != null
              ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${row.getValue('invoice')}`
              : `/payment/failed/invoice`
          }
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
            className={`flex w-fit items-center gap-1 border bg-opacity-15 ${row.getValue('status_reserve') == 'settlement'
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
            className={`flex w-fit items-center gap-1 border bg-opacity-15 ${row.getValue('status_payment') == 'done'
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
  const [reserves, setReserves] = React.useState([])

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

  const [date, setDate] = React.useState(
    Cookies.get('selectedDate') ? Cookies.get('selectedDate') : new Date(),
  )
  console.log('DATE', date)

  const getAllDataReservations = async (
    date = Cookies.get('selectedDate')
      ? addDays(Cookies.get('selectedDate'), 1).toISOString().split('T')[0]
      : addDays(new Date(), 1).toISOString().split('T')[0],
  ) => {
    setIsLoading(true)
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/reservations`
    const urlDate = `${process.env.NEXT_PUBLIC_BASE_URL}/reservations?reserve_date=${date}`
    try {
      const response = await axios.get(date == null ? url : urlDate)
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

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservations')
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })
    const dataBlob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    })
    saveAs(dataBlob, 'reservations.xlsx')
  }

  const getAllDataStatistics = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/statistics`,
      )
      if (response.status == 200) {
        const jsonData = await response.data
        setTotal(jsonData)
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
    }
  }

  const getAllReservation = async (date, position) => {
    try {
      const response = await axios.get(
        `${baseUrl}/reservations?reserve_date=${date}&position=${position}&status=settlement&pending=pending`,
      )
      console.log(`${baseUrl}/reservations?reserve_date=${date}`)
      if (response.status == 200) {
        const jsonData = await response.data

        setReserves(jsonData)
        const slots = jsonData.map((reserve) => ({
          startTime: reserve.reserve_start_time,
          endTime: reserve.reserve_end_time,
        }))
        setBookedSlots(slots)
        console.log(response.data)

        setIsLoading(false)
      } else {
        setIsLoading(false)
        console.log({ response })
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      console.log(error)

      setIsLoading(false)
    }
  }

  const [dateStartExport, setDateStartExport] = React.useState(null)
  const [dateEndExport, setDateEndExport] = React.useState(null)
  const [reservationExport, setReservationExport] = React.useState([])

  const handleExportData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/export?date_start=${dateStartExport}&date_end=${dateEndExport}`,
      )
      if (response.status == 200) {
        const jsonData = await response.data

        setReservationExport(jsonData)
        console.log(response.data)

        setIsLoading(false)
        exportToExcel(jsonData)
      } else {
        setIsLoading(false)
        console.log({ response })
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      console.log(error)
      Toast.fire({
        icon: 'error',
        title: `Internal server sedang error, coba lagi nanti!`,
      })
      setIsLoading(false)
    }
  }

  console.log({ dateStartExport })
  console.log({ dateEndExport })

  const [
    openCreateReservationForm,
    setOpenCreateReservationForm,
  ] = React.useState(false)

  const [selectedDate, setSelectedDate] = React.useState('')
  const [dateStart, setDateStart] = React.useState(null)
  const [dateEnd, setDateEnd] = React.useState(null)

  const [typeSeatPlaying, setTypeSeatPlaying] = React.useState('')
  const [selectedSeat, setSelectedSeat] = React.useState('')

  const disableTimes =
    reserves.length > 0
      ? reserves
        .map((reserve) => {
          if (reserve.reserve_end_time) {
            const [hour, minute, second] = reserve.reserve_end_time.split(':')
            const formattedTime = `${hour}:${minute}`
            return formattedTime
          }
          return null
        })
        .filter((time) => time !== null)
      : []

  React.useEffect(() => {
    getAllDataReservations()
    getAllDataStatistics()
    getDateClosed()
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
            className="relative w-16 h-16 p-4 bg-yellow-100 flex items-center justify-center text-orange rounded-2xl mb-4"
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
            className="w-16 h-16 p-4 border text-gray-400 flex items-center justify-center rounded-2xl mb-4"
          >
            <IoBook className="text-4xl" />
          </a>
          <a
            href="/admin/dashboard/dates"
            className="w-16 h-16 p-4 border text-gray-400 flex items-center justify-center rounded-2xl mb-4"
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
            <Statistics total={total} />

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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="ml-auto">
                            Tools <PiGearBold className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="p-4 flex flex-col space-y-2">
                            <Button
                              variant="primary"
                              onClick={(e) => {
                                setIsHide(!isHide)
                                if (!isHide) {
                                  hideSuccessPayment()
                                } else {
                                  const nextDay = addDays(
                                    Cookies.get('selectedDate'),
                                    1,
                                  )
                                  setDate(Cookies.get('selectedDate'))
                                  getAllDataReservations(
                                    nextDay.toISOString().split('T')[0],
                                  )
                                }
                              }}
                            >
                              {isHide ? 'Unhide' : 'Hide'} Success Payment{' '}
                              {!isHide ? (
                                <BiHide className="ml-2 h-4 w-4" />
                              ) : (
                                <FiEye className="ml-2 h-4 w-4" />
                              )}
                            </Button>

                            <Button
                              variant="primary"
                              onClick={() => console.log('Button 3 clicked')}
                            >
                              Button 3
                            </Button>
                            <Button
                              variant="primary"
                              onClick={() => console.log('Button 4 clicked')}
                            >
                              Button 4
                            </Button>
                            <Button
                              variant="primary"
                              onClick={() => console.log('Button 5 clicked')}
                            >
                              Button 5
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">
                            Export{' '}
                            <PiMicrosoftExcelLogoFill className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-full p-0 flex flex-col gap-2"
                          align="start"
                        >
                          <div class="flex flex-row gap-2">
                            <div>
                              <label className="px-3 py-4 font-semibold text-sm">
                                Select Start Date:
                              </label>
                              <Calendar
                                mode="single"
                                selected={dateStart}
                                onSelect={(date) => {
                                  setDateStart(date)
                                  const nextDay = addDays(date, 1)
                                  setDateStartExport(
                                    nextDay.toISOString().split('T')[0],
                                  )
                                  Cookies.set(
                                    'dateStartExport',
                                    nextDay.toISOString().split('T')[0],
                                  )
                                }}
                                initialFocus
                              />
                            </div>
                            <div>
                              <label className="px-3 py-4 font-semibold text-sm">
                                Select End Date:
                              </label>
                              <Calendar
                                mode="single"
                                selected={dateEnd}
                                onSelect={(date) => {
                                  const nextDay = addDays(date, 1)
                                  setDateEnd(date)
                                  setDateEndExport(
                                    nextDay.toISOString().split('T')[0],
                                  )
                                  Cookies.set(
                                    'dateEndExport',
                                    nextDay.toISOString().split('T')[0],
                                  )
                                }}
                                initialFocus
                              />
                            </div>
                          </div>
                          <Button
                            onClick={() => handleExportData()}
                            variant="outline"
                            className="ml-auto"
                          >
                            Export Data{' '}
                            <PiMicrosoftExcelLogoFill className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="ml-auto">
                            Tanggal {formatDate(date)}{' '}
                            <IoMdCalendar className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(date) => {
                              const nextDay = addDays(date, 1)
                              setDate(date)
                              Cookies.set('selectedDate', date)
                              getAllDataReservations(
                                nextDay.toISOString().split('T')[0],
                              )
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

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

              <AlertDialog className="bg-black/20" open={openFormMoveCustomer}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Move Reservation Seat/Schedule
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Pastikan tempat dan waktu pindah belum terisi oleh
                      customer lain!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <fieldset>
                    <form>
                      <label className="text-black" htmlFor="nama">
                        Fasilitas
                      </label>
                      <Select
                        value={typeSeatPlaying}
                        onValueChange={(value) => setTypeSeatPlaying(value)}
                        required
                        className="border border-border duration-500 mb-2 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 mt-3 "
                      >
                        <SelectTrigger className="py-5 px-3 text-base text-black">
                          <SelectValue
                            className="text-base text-black placeholder:text-black"
                            placeholder="Pilih Fasilitas"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="">
                            <SelectLabel className="text-base">
                              Fasilitas
                            </SelectLabel>
                            <SelectItem
                              className="text-base"
                              value="PS5 Reguler"
                            >
                              PS5 Reguler
                            </SelectItem>
                            <SelectItem
                              className="text-base"
                              value="PS4 Reguler"
                            >
                              PS4 Reguler
                            </SelectItem>
                            <SelectItem className="text-base" value="Simulator">
                              Simulator
                            </SelectItem>
                            <SelectItem className="text-base" value="Family Open Space">
                              Family Open Space
                            </SelectItem>
                            <SelectItem className="text-base" value="Squad Open Space">
                              Squad Open Space
                            </SelectItem>
                            <SelectItem className="text-base" value="Family VIP Room">
                              Family VIP Room
                            </SelectItem>
                            <SelectItem className="text-base" value="LoveBirds VIP Room">
                              LoveBirds VIP Room
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <label className="text-black mt-3" htmlFor="nama">
                        Seat Number
                      </label>
                      <Select
                        value={selectedSeat}
                        onValueChange={(value) => setSelectedSeat(value)}
                        required
                        className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 mt-3 "
                      >
                        <SelectTrigger className="py-5 px-3 text-base text-black">
                          <SelectValue
                            className="text-base text-black placeholder:text-black"
                            placeholder="Pilih Fasilitas"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="">
                            <SelectLabel className="text-base">
                              Seat Number
                            </SelectLabel>
                            {typeSeatPlaying == 'PS5 Reguler' && (
                              <>
                                <SelectItem className="text-base" value="4">
                                  4
                                </SelectItem>
                                <SelectItem className="text-base" value="5">
                                  5
                                </SelectItem>
                                <SelectItem className="text-base" value="8">
                                  8
                                </SelectItem>
                              </>
                            )}
                            {typeSeatPlaying == 'PS4 Reguler' && (
                              <>
                                <SelectItem className="text-base" value="1">
                                  1
                                </SelectItem>
                                <SelectItem className="text-base" value="2">
                                  2
                                </SelectItem>
                                <SelectItem className="text-base" value="3">
                                  3
                                </SelectItem>

                              </>
                            )}
                            {typeSeatPlaying == 'Simulator' && (
                              <>
                                <SelectItem className="text-base" value="6">
                                  6
                                </SelectItem>{' '}
                                <SelectItem className="text-base" value="7">
                                  7
                                </SelectItem>
                              </>
                            )}
                            {typeSeatPlaying == 'Family Open Space' && (
                              <>
                                <SelectItem className="text-base" value="17">
                                  17
                                </SelectItem>
                              </>
                            )}
                            {typeSeatPlaying == 'Squad Open Space' && (
                              <>
                                <SelectItem className="text-base" value="13">
                                  13
                                </SelectItem>{' '}
                                <SelectItem className="text-base" value="14">
                                  14
                                </SelectItem>
                                <SelectItem className="text-base" value="15">
                                  15
                                </SelectItem>
                                <SelectItem className="text-base" value="16">
                                  16
                                </SelectItem>
                              </>
                            )}
                            {typeSeatPlaying == 'Family VIP Room' && (
                              <>
                                <SelectItem className="text-base" value="18">
                                  18
                                </SelectItem>{' '}
                                <SelectItem className="text-base" value="19">
                                  19
                                </SelectItem>
                              </>
                            )}
                            {typeSeatPlaying == 'LoveBirds VIP Room' && (
                              <>
                                <SelectItem className="text-base" value="20">
                                  20
                                </SelectItem>{' '}
                                <SelectItem className="text-base" value="21">
                                  21
                                </SelectItem>
                                <SelectItem className="text-base" value="22">
                                  22
                                </SelectItem>
                              </>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </form>
                  </fieldset>

                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={(e) => setOpenFormMoveCustomer(false)}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => handleChangeSeatCustomer(idSelected)}
                    >
                      Update
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog className="bg-black/20" open={openUpdate}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Status Playing Reservation
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Pastikan Telah Melakukan Pengecekan/Verifikasi Invoice
                      Customer Dengan Yang Ada di Admin!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <fieldset>
                    <form>
                      <Select
                        value={statusPlaying}
                        onValueChange={(value) => setStatusPlaying(value)}
                        required
                        className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4 "
                      >
                        <SelectTrigger className="py-5 px-3 text-base text-black">
                          <SelectValue
                            className="text-base text-black placeholder:text-black"
                            placeholder="Pilih Status Playing"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="">
                            <SelectLabel className="text-base">
                              Status Playing
                            </SelectLabel>
                            <SelectItem className="text-base" value="playing">
                              Playing
                            </SelectItem>
                            <SelectItem
                              className="text-base"
                              value="not playing"
                            >
                              Not Playing
                            </SelectItem>
                            <SelectItem className="text-base" value="done">
                              Done
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </form>
                  </fieldset>

                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => setOpenUpdate(false)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => handleUpdateFacilityContent(idSelected)}
                    >
                      Update
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </section>
          </>
        )}
        {/* <Reservation /> */}
      </section>
    </main>
  )
}

export default page
