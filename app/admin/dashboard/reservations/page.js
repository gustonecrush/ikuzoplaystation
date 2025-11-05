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

import { Statistics } from '@/app/components'
import { Calendar } from '@/components/ui/calendar'
import { addDays, subDays } from 'date-fns'
import Sidebar from '@/app/components/Admin/Sidebar'
import { useFetchDataMaintenances } from '@/hooks/useFetchDataMaintenance'
import { apiBaseUrl } from '@/utils/urls'
import Swal from 'sweetalert2'

function page() {
  const {
    data: dataMaintenance,
    isLoading: isLoadingMaintenance,
    getAllDataMaintenances,
  } = useFetchDataMaintenances()

  console.log({ dataMaintenance })

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
      if (response.status == 200) {
        const jsonData = await response.data

        setReservesPosition(jsonData)

        setIsLoading(false)
      } else {
        setIsLoading(false)
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
  const handleDeleteReservation = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/reservations/${id}`)
      if (response.status == 200) {
        const jsonData = await response.data
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
      if (response.status == 200) {
        const jsonData = await response.data

        if (jsonData.data.length > 0) {
          setCustomTimeSelected(jsonData.data)
        } else {
          setCustomTimeSelected([])
        }
      } else {
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
    getAllReservation(date, position)
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
        setIsLoading(false)
        setOpenFormMoveCustomer(!openFormMoveCustomer)
      } else {
        setIsLoading(false)
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

  console.log({ data })
  const [dateClose, setDateClose] = React.useState([])

  const getDateClosed = async (date) => {
    try {
      const response = await axios.get(`${baseUrl}/dates`)
      if (response.status == 200) {
        const jsonData = await response.data

        setDateClose(jsonData.data)
      } else {
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
      } else {
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
      } else {
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

  const [selectedTypeSeat, setSelectedTypeSeat] = React.useState('')

  // Tambahkan state
  const [openMembershipDetail, setOpenMembershipDetail] = React.useState(false)
  const [selectedMembership, setSelectedMembership] = React.useState(null)

  // Tambahkan function handler
  const handleShowMembershipDetail = async (membershipId) => {
    try {
      const response = await axios.get(`${baseUrl}/memberships/${membershipId}`)
      if (response.status === 200) {
        setSelectedMembership(response.data)
        setOpenMembershipDetail(true)
      }
    } catch (error) {
      console.error({ error })
      Toast.fire({
        icon: 'error',
        title: 'Gagal memuat data membership!',
      })
    }
  }

  // Tambahkan state untuk modal saving times
  const [openSavingTimes, setOpenSavingTimes] = React.useState(false)
  const [selectedSavingTimes, setSelectedSavingTimes] = React.useState([])
  const [selectedReservationInfo, setSelectedReservationInfo] = React.useState(
    null,
  )

  // Tambahkan function handler
  const handleShowSavingTimes = (reservation) => {
    setSelectedReservationInfo(reservation)
    setSelectedSavingTimes(reservation.saving_times || [])
    setOpenSavingTimes(true)
  }

  // Tambahkan state untuk modal update
  const [openUpdateSavingTime, setOpenUpdateSavingTime] = React.useState(false)
  const [selectedSavingTime, setSelectedSavingTime] = React.useState(null)
  const [isUpdatingSavingTime, setIsUpdatingSavingTime] = React.useState(false)

  // Function untuk handle update is_active
  const handleUpdateSavingTimeStatus = async (savingTimeId, newStatus) => {
    setIsUpdatingSavingTime(true)

    try {
      const response = await axios.post(
        `${apiBaseUrl}/reservation-saving-times/${savingTimeId}`,
        {
          is_active: newStatus,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.status === 200) {
        Toast.fire({
          icon: 'success',
          title: 'Status saving time berhasil diupdate!',
        })

        // Refresh data
        getAllDataReservations()

        // Update selected saving times
        setSelectedSavingTimes((prevTimes) =>
          prevTimes.map((st) =>
            st.id === savingTimeId ? { ...st, is_active: newStatus } : st,
          ),
        )
      }
    } catch (error) {
      console.error({ error })
      Toast.fire({
        icon: 'error',
        title:
          error.code === 'ERR_NETWORK'
            ? 'Koneksi terputus!'
            : error.response?.data?.message || 'Gagal update status!',
      })
    } finally {
      setIsUpdatingSavingTime(false)
    }
  }

  // Tambahkan state
  const [confirmDialog, setConfirmDialog] = React.useState({
    open: false,
    saveTime: null,
    newStatus: '',
  })

  // Update handler
  const handleToggleSavingTimeStatus = (saveTime) => {
    const newStatus = saveTime.is_active === 'Active' ? 'No Active' : 'Active'

    setConfirmDialog({
      open: true,
      saveTime: saveTime,
      newStatus: newStatus,
    })
  }

  // Function untuk confirm update
  const handleConfirmUpdate = () => {
    if (confirmDialog.saveTime) {
      handleUpdateSavingTimeStatus(
        confirmDialog.saveTime.id,
        confirmDialog.newStatus,
      )
    }
    setConfirmDialog({ open: false, saveTime: null, newStatus: '' })
  }
  const columns = [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-fit"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          No
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center uppercase">{row.index + 1}</div>
      ),
    },
    {
      accessorKey: 'reserve_id',
      header: () => (
        <div className="flex w-full items-center justify-center">
          Action
          <AiFillEdit className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => {
        const isMembership =
          row.original.id_membership && row.original.id_membership !== ''
        const hasSavingTimes =
          row.original.saving_times && row.original.saving_times.length > 0

        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="outline"
              className="border-black border-opacity-5 bg-black bg-opacity-10 text-xs text-black"
            >
              <IoIosInformationCircle className="h-4 w-4" /> Info
            </Button>

            {hasSavingTimes && (
              <Button
                variant="outline"
                onClick={() => handleShowSavingTimes(row.original)}
                className="border-orange-500 border-opacity-5 bg-orange-500 bg-opacity-10 text-xs text-orange-500 hover:bg-orange-500 hover:text-white"
              >
                <IoTime className="h-4 w-4" /> Times (
                {row.original.saving_times.length})
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => handleGetReservationById(row.original.reserve_id)}
              className="border-blue-500 border-opacity-5 bg-blue-500 bg-opacity-10 text-xs text-blue-500"
            >
              <IoMoveOutline className="h-4 w-4" /> Move
            </Button>

            <Button
              onClick={() => {
                setIdSelected(row.getValue('reserve_id'))
                setOpenUpdate(true)
              }}
              variant="outline"
              className="border border-yellow-500 hover:bg-yellow-500 bg-yellow-200 bg-opacity-10 text-xs text-yellow-500"
            >
              <FiEdit3 className="h-4 w-4" /> Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border border-red-500 hover:bg-red-500 bg-red-200 bg-opacity-10 text-xs text-red-500"
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
                    onClick={() =>
                      handleDeleteReservation(row.getValue('reserve_id'))
                    }
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      },
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          ID Reservasi
          <TbNumber className="ml-2 h-5 w-5" />
        </Button>
      ),
      cell: ({ row }) => {
        const isMembership =
          row.original.id_membership && row.original.id_membership !== ''

        return (
          <div
            className={`text-center capitalize font-semibold ${
              isMembership ? 'text-purple-600' : ''
            }`}
          >
            {row.original.reserve_id}
            {isMembership && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                ⭐ Member
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'invoice',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Invoice
          <IoDocument className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Link
          target="_blank"
          href={
            row.getValue('invoice') != null
              ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${row.getValue('invoice')}`
              : `/payment/failed/invoice`
          }
          className="text-center text-black"
        >
          <Badge className="flex w-fit items-center gap-1 border bg-opacity-15 border-gray-500 bg-gray-500 text-gray-500 hover:bg-gray-600">
            <IoDocument /> invoice
          </Badge>
        </Link>
      ),
    },
    {
      accessorKey: 'status_reserve',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex w-fit items-center justify-center"
        >
          Status
          <br />
          Pembayaran
          <FaMoneyBillWaveAlt className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue('status_reserve')
        return (
          <div className="flex w-full items-center justify-center text-center">
            <Badge
              className={`flex w-fit items-center gap-1 border bg-opacity-15 ${
                status === 'settlement'
                  ? 'border-green-500 bg-green-500 text-green-600'
                  : status === 'pending'
                  ? 'border-yellow-500 bg-yellow-500 text-yellow-500'
                  : 'border-red-500 bg-red-500 text-red-500'
              }`}
            >
              {status === 'settlement' && <MdPaid />}
              {status === 'pending' && <MdOutlineAccessTimeFilled />}
              {status !== 'pending' && status !== 'settlement' && <TiTimes />}
              {status === 'settlement' ? 'paid' : status}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: 'status_payment',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex w-full items-center justify-center"
        >
          Status
          <br />
          Reservasi
          <IoLogoGameControllerB className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue('status_payment')
        return (
          <div className="flex w-full items-center justify-center text-center">
            <Badge
              className={`flex w-fit items-center gap-1 border bg-opacity-15 ${
                status === 'done'
                  ? 'border-blue-500 bg-blue-500 text-blue-600'
                  : status === 'not playing'
                  ? 'border-purple-400 bg-purple-500 text-purple-600'
                  : 'border-gray-500 bg-gray-500 text-gray-700'
              }`}
            >
              {status === 'playing' && <IoLogoGameControllerB />}
              {status === 'done' && <MdOutlineDoneAll />}
              {status !== 'playing' && status !== 'done' && (
                <HiMiniQuestionMarkCircle />
              )}
              {status === 'settlement' ? 'paid' : status}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: 'reserve_name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nama Customer
          <FaCircleUser className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const isMembership =
          row.original.id_membership && row.original.id_membership !== ''

        return (
          <div
            className={`text-center capitalize ${
              isMembership ? 'font-semibold text-purple-600' : ''
            }`}
          >
            {row.getValue('reserve_name')}
          </div>
        )
      },
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full"
        >
          Harga
          <FaRupiahSign className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="w-full text-center">
          Rp {parseInt(row.getValue('price')).toLocaleString('id-ID')}
        </div>
      ),
    },
    {
      accessorKey: 'reserve_contact',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-[150px] text-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nomor Tlp
          <HiPhone className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="w-[150px] text-center">
          {row.getValue('reserve_contact')}
        </div>
      ),
    },
    {
      accessorKey: 'location',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Lantai Reservasi
          <PiHouseSimpleFill className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue('location')}</div>
      ),
    },
    {
      accessorKey: 'position',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Posisi
          <TbNumber className="ml-2 h-6 w-6" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue('position')}</div>
      ),
    },
    {
      accessorKey: 'reserve_date',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full"
        >
          Tanggal Reservasi
          <HiCalendar className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="w-full text-center">
          {formatDateOnTheUI(row.getValue('reserve_date'))}
        </div>
      ),
    },
    {
      accessorKey: 'reserve_start_time',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full"
        >
          Waktu Mulai
          <BiSolidTime className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="w-full text-center">
          {row.getValue('reserve_start_time')} WIB
        </div>
      ),
    },
    {
      accessorKey: 'reserve_end_time',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full"
        >
          Waktu Berakhir
          <BiSolidTimeFive className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="w-2/3 text-center">
          {row.getValue('reserve_end_time')} WIB
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {formatDateOnTheUI(row.getValue('created_at'))}
        </div>
      ),
    },
    {
      accessorKey: 'updated_at',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Updated at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {formatDateOnTheUI(row.getValue('updated_at'))}
        </div>
      ),
    },
  ]

  React.useEffect(() => {
    if (selectedTypeSeat) {
      setColumnFilters([{ id: 'location', value: selectedTypeSeat }])
    } else {
      setColumnFilters([])
    }
  }, [selectedTypeSeat])

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

        router.replace('/admin/login')
      } else {
        Toast.fire({
          icon: 'error',
          title: `Gagal logout dari dashboard!`,
        })
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
        setIsLoading(false)
      } else {
        setIsLoading(false)
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
        setIsLoading(false)
      } else {
        setIsLoading(false)
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
      if (response.status == 200) {
        const jsonData = await response.data

        setReserves(jsonData)
        const slots = jsonData.map((reserve) => ({
          startTime: reserve.reserve_start_time,
          endTime: reserve.reserve_end_time,
        }))
        setBookedSlots(slots)

        setIsLoading(false)
      } else {
        setIsLoading(false)
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

        setIsLoading(false)
        exportToExcel(jsonData)
      } else {
        setIsLoading(false)
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

  const [
    openCreateReservationForm,
    setOpenCreateReservationForm,
  ] = React.useState(false)

  const [selectedDate, setSelectedDate] = React.useState('')
  const [dateStart, setDateStart] = React.useState(null)
  const [dateEnd, setDateEnd] = React.useState(null)

  const [typeSeatPlaying, setTypeSeatPlaying] = React.useState('')
  const [selectedSeat, setSelectedSeat] = React.useState('')

  React.useEffect(() => {
    getAllDataReservations()
    getAllDataStatistics()
    getDateClosed()
  }, [])

  return (
    <main className="flex w-full h-screen rounded-3xl">
      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ open, saveTime: null, newStatus: '' })
        }
      >
        <AlertDialogContent className="z-[100]">
          <AlertDialogHeader>
            <AlertDialogTitle>Update Status?</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3 mt-3">
                <div className="p-3 bg-orange rounded-lg">
                  <p className="text-sm text-white">
                    Ubah status saving time menjadi:
                  </p>
                  <p className="font-bold text-white text-lg mt-1">
                    {confirmDialog.newStatus}
                  </p>
                </div>

                {confirmDialog.saveTime && (
                  <div className="border-t pt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-semibold">
                        {confirmDialog.saveTime.start_time_saving.slice(0, 5)} -{' '}
                        {confirmDialog.saveTime.end_time_saving.slice(0, 5)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-semibold">
                        {formatDateOnTheUI(confirmDialog.saveTime.date_saving)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() =>
                setConfirmDialog({ open: false, saveTime: null, newStatus: '' })
              }
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmUpdate}
              className="bg-orange hover:bg-orange"
            >
              Yes, Update!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openSavingTimes} onOpenChange={setOpenSavingTimes}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <IoTime className="h-5 w-5 text-orange-600" />
              Saving Times - {selectedReservationInfo?.reserve_id}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Total {selectedSavingTimes.length} saving time(s) untuk reservasi
              ini
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedReservationInfo && (
            <div className="space-y-4">
              {/* Reservation Info */}
              <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600 text-xs">Customer</p>
                    <p className="font-semibold text-gray-800">
                      {selectedReservationInfo.reserve_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Location</p>
                    <p className="font-semibold text-gray-800">
                      {selectedReservationInfo.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Position</p>
                    <p className="font-semibold text-gray-800">
                      Pos {selectedReservationInfo.position}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Date</p>
                    <p className="font-semibold text-gray-800">
                      {formatDateOnTheUI(selectedReservationInfo.reserve_date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Saving Times List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {selectedSavingTimes.length > 0 ? (
                  selectedSavingTimes.map((saveTime, index) => (
                    <div
                      key={saveTime.id}
                      className="p-4 bg-white border-2 border-orange-200 rounded-lg hover:border-orange-400 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 font-bold">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <IoTime className="h-4 w-4 text-orange-600" />
                              <p className="font-semibold text-gray-800">
                                {saveTime.start_time_saving.slice(0, 5)} -{' '}
                                {saveTime.end_time_saving.slice(0, 5)} WIB
                              </p>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              📅 {formatDateOnTheUI(saveTime.date_saving)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <Badge
                              className={`${
                                saveTime.is_active === 'Active'
                                  ? 'bg-green-100 text-green-700 border-green-300'
                                  : 'bg-gray-100 text-gray-600 border-gray-300'
                              }`}
                            >
                              {saveTime.is_active === 'Active'
                                ? '✓ Active'
                                : '○ Inactive'}
                            </Badge>
                          </div>

                          {/* Toggle Status Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleToggleSavingTimeStatus(saveTime)
                            }
                            disabled={isUpdatingSavingTime}
                            className={`${
                              saveTime.is_active === 'Active'
                                ? 'border-red-300 text-red-600 hover:bg-red-50'
                                : 'border-green-300 text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {isUpdatingSavingTime ? (
                              <span className="animate-spin">⏳</span>
                            ) : saveTime.is_active === 'Active' ? (
                              <>
                                <TiTimes className="h-4 w-4 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <MdOutlineDoneAll className="h-4 w-4 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Duration Calculation */}
                      {(() => {
                        const [
                          startHour,
                          startMin,
                        ] = saveTime.start_time_saving.split(':').map(Number)
                        const [
                          endHour,
                          endMin,
                        ] = saveTime.end_time_saving.split(':').map(Number)
                        const durationMinutes =
                          endHour * 60 + endMin - (startHour * 60 + startMin)
                        const hours = Math.floor(durationMinutes / 60)
                        const minutes = durationMinutes % 60

                        return (
                          <div className="mt-3 pt-3 border-t border-orange-100">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-semibold text-orange-600">
                                {hours > 0 && `${hours}h `}
                                {minutes > 0 && `${minutes}m`}
                              </span>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <IoTime className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No saving times found</p>
                  </div>
                )}
              </div>

              {/* Summary */}
              {selectedSavingTimes.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600 text-xs">Total Times</p>
                      <p className="font-bold text-orange-600 text-lg">
                        {selectedSavingTimes.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs">Active</p>
                      <p className="font-bold text-green-600 text-lg">
                        {
                          selectedSavingTimes.filter(
                            (st) => st.is_active === 'Active',
                          ).length
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs">Total Duration</p>
                      <p className="font-bold text-orange-600 text-lg">
                        {(() => {
                          const totalMinutes = selectedSavingTimes.reduce(
                            (sum, st) => {
                              const [
                                startHour,
                                startMin,
                              ] = st.start_time_saving.split(':').map(Number)
                              const [
                                endHour,
                                endMin,
                              ] = st.end_time_saving.split(':').map(Number)
                              return (
                                sum +
                                (endHour * 60 +
                                  endMin -
                                  (startHour * 60 + startMin))
                              )
                            },
                            0,
                          )
                          const hours = Math.floor(totalMinutes / 60)
                          const minutes = totalMinutes % 60
                          return `${hours}h ${minutes}m`
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenSavingTimes(false)}>
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sidebar />
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
                  <div className="flex flex-col">
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
                    </div>
                    <div className="w-full flex items-center justify between gap-10">
                      <Select
                        value={selectedTypeSeat}
                        onValueChange={(value) => setSelectedTypeSeat(value)}
                        required
                        className="border border-border duration-500 bg-transparent text-black placeholder:text-gray-300 rounded-lg !px-3 !py-4"
                      >
                        <SelectTrigger className="py-5 px-3 text-base mb-2 -mt-2 text-black">
                          <SelectValue
                            className="text-sm text-black placeholder:text-black"
                            placeholder="Filter by Fasilitas"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="">
                            <SelectLabel className="text-sm">
                              Fasilitas
                            </SelectLabel>

                            <SelectItem className="text-sm" value="PS5 Reguler">
                              PS5 Reguler
                            </SelectItem>
                            <SelectItem className="text-sm" value="PS4 Reguler">
                              PS4 Reguler
                            </SelectItem>
                            <SelectItem className="text-sm" value="Simulator">
                              Simulator
                            </SelectItem>
                            <SelectItem
                              className="text-sm"
                              value="Family Open Space"
                            >
                              Family Open Space
                            </SelectItem>
                            <SelectItem
                              className="text-sm"
                              value="Squad Open Space"
                            >
                              Squad Open Space
                            </SelectItem>
                            <SelectItem
                              className="text-sm"
                              value="Family VIP Room"
                            >
                              Family VIP Room
                            </SelectItem>
                            <SelectItem
                              className="text-sm"
                              value="LoveBirds VIP Room"
                            >
                              LoveBirds VIP Room
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <div className="flex gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                              Tools <PiGearBold className="ml-2 h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="px-4 py-2 flex flex-col space-y-2">
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
                            <SelectLabel className="text-sm">
                              Fasilitas
                            </SelectLabel>
                            <SelectItem className="text-sm" value="PS5 Reguler">
                              PS5 Reguler
                            </SelectItem>
                            <SelectItem className="text-sm" value="PS4 Reguler">
                              PS4 Reguler
                            </SelectItem>
                            <SelectItem className="text-sm" value="Simulator">
                              Simulator
                            </SelectItem>
                            <SelectItem
                              className="text-sm"
                              value="Family Open Space"
                            >
                              Family Open Space
                            </SelectItem>
                            <SelectItem
                              className="text-sm"
                              value="Squad Open Space"
                            >
                              Squad Open Space
                            </SelectItem>
                            <SelectItem
                              className="text-sm"
                              value="Family VIP Room"
                            >
                              Family VIP Room
                            </SelectItem>
                            <SelectItem
                              className="text-sm"
                              value="LoveBirds VIP Room"
                            >
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
                            <SelectLabel className="text-sm">
                              Seat Number
                            </SelectLabel>
                            {typeSeatPlaying == 'PS5 Reguler' && (
                              <>
                                <SelectItem className="text-sm" value="4">
                                  4
                                </SelectItem>
                                <SelectItem className="text-sm" value="5">
                                  5
                                </SelectItem>
                                <SelectItem className="text-sm" value="8">
                                  8
                                </SelectItem>
                              </>
                            )}
                            {typeSeatPlaying == 'PS4 Reguler' && (
                              <>
                                <SelectItem className="text-sm" value="1">
                                  1
                                </SelectItem>
                                <SelectItem className="text-sm" value="2">
                                  2
                                </SelectItem>
                                <SelectItem className="text-sm" value="3">
                                  3
                                </SelectItem>
                              </>
                            )}
                            {typeSeatPlaying == 'Simulator' && (
                              <>
                                <SelectItem className="text-sm" value="6">
                                  6
                                </SelectItem>{' '}
                                <SelectItem className="text-sm" value="7">
                                  7
                                </SelectItem>
                              </>
                            )}
                            {typeSeatPlaying == 'Family Open Space' && (
                              <>
                                <SelectItem className="text-sm" value="17">
                                  17
                                </SelectItem>
                              </>
                            )}
                            {typeSeatPlaying == 'Squad Open Space' && (
                              <>
                                <SelectItem className="text-sm" value="13">
                                  13
                                </SelectItem>{' '}
                                <SelectItem className="text-sm" value="14">
                                  14
                                </SelectItem>
                                <SelectItem className="text-sm" value="15">
                                  15
                                </SelectItem>
                                <SelectItem className="text-sm" value="16">
                                  16
                                </SelectItem>
                              </>
                            )}
                            {typeSeatPlaying == 'Family VIP Room' && (
                              <>
                                <SelectItem className="text-sm" value="18">
                                  18
                                </SelectItem>{' '}
                                <SelectItem className="text-sm" value="19">
                                  19
                                </SelectItem>
                              </>
                            )}
                            {typeSeatPlaying == 'LoveBirds VIP Room' && (
                              <>
                                <SelectItem className="text-sm" value="20">
                                  20
                                </SelectItem>{' '}
                                <SelectItem className="text-sm" value="21">
                                  21
                                </SelectItem>
                                <SelectItem className="text-sm" value="22">
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
                            <SelectLabel className="text-sm">
                              Status Playing
                            </SelectLabel>
                            <SelectItem className="text-sm" value="playing">
                              Playing
                            </SelectItem>
                            <SelectItem className="text-sm" value="not playing">
                              Not Playing
                            </SelectItem>
                            <SelectItem className="text-sm" value="done">
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
