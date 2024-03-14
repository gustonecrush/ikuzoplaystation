'use client'

import Image from 'next/image'
import React from 'react'
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
import Layout from '../components/Layout'
import SwiperContentGames from '@/app/components/SwiperContentGames'
import SwiperContentFacilities from '@/app/admin/dashboard/components/SwiperContentFacilities'

function page() {
  const [data, setData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

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
        <div className="w-full text-center">{row.getValue('reserve_date')}</div>
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
        <div className="text-center uppercase">
          {row.getValue('created_at').toString().slice(0, 11)}
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
        <div className="text-center uppercase">
          {row.getValue('updated_at').toString().slice(0, 11)}
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

  const features = [
    {
      id: 'games',
      name: 'Games',
      desc: 'Setup Content Games',
      img: '/game.png',
    },
    {
      id: 'facilities',
      name: 'Facilities',
      desc: 'Setup Content Facilities',
      img: '/sofa.png',
    },
    {
      id: 'sections',
      name: 'Sections',
      desc: 'Setup Content Sections',
      img: '/laptop.png',
    },
  ]

  const [selectedFeature, setSelectedFeature] = React.useState('games')

  const [
    openCreateReservationForm,
    setOpenCreateReservationForm,
  ] = React.useState(false)

  React.useEffect(() => {
    getAllDataReservations()
  }, [])

  return (
    <Layout>
      <div className="flex flex-col gap-4 w-full mb-6 p-8">
        <div className=" w-fit py-5 text-black bg-white rounded-lg mt-8  flex flex-row gap-3 items-center">
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
              <h1 className="text-4xl font-semibold">CMS</h1>
              <p className="text-base font-normal text-gray-400">
                Content Management System Website Ikuzo
              </p>
            </div>
          </Fade>
        </div>
        <div className="flex flex-row gap-4 w-full">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={(e) => setSelectedFeature(feature.id)}
              className={`flex w-full hover:scale-110 duration-1000 cursor-pointer items-center px-2 py-6 justify-center ${
                selectedFeature == feature.id
                  ? 'bg-orange bg-opacity-5'
                  : 'bg-white'
              } rounded-lg shadow-md`}
            >
              <div className="flex flex-col gap-1 items-center justify-center">
                <Image
                  src={feature.img}
                  alt={'Content Games'}
                  width={0}
                  height={0}
                  className="w-[120px]"
                />

                <div className="flex flex-col justify-center items-center">
                  <h1 className="text-lg font-semibold">{feature.name}</h1>
                  <p className={`text-base font-normal text-gray-400`}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        {selectedFeature == 'games' ? (
          <SwiperContentGames />
        ) : (
          <SwiperContentFacilities />
        )}
      </div>
    </Layout>
  )
}

export default page
