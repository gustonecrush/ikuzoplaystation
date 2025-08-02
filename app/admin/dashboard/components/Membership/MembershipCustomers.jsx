'use client'

import { Bs123 } from 'react-icons/bs'
import {
  MdOutlineAccessTime,
  MdOutlineUpdate,
  MdInfoOutline,
} from 'react-icons/md'
import { RiGiftLine } from 'react-icons/ri'
import { FaRegUserCircle, FaWhatsapp } from 'react-icons/fa'
import { BsTelephone, BsPerson } from 'react-icons/bs'
import { HiOutlineCalendar } from 'react-icons/hi'

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

import React from 'react'
import Card from '@/app/components/Card'
import TableReservations from '@/app/components/TableReservations'

import { Input } from '@/components/ui/input'

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import axios from 'axios'

import Toast from '@/app/components/Toast'
import Loading from '../loading'
import MembershipCheck from './MembershipCheck'
import MembershipWeeklyReport from './MembershipWeeklyReport'
import MembershipFormRegistration from '@/app/components/Membership/MembershipFormRegistration'

function MembershipCustomers() {
  const [data, setData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [selectedCustomer, setSelectedCustomer] = React.useState(null)
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = React.useState(false)

  const [open, setOpen] = React.useState(false)

  const columns = [
    {
      accessorKey: 'id',
      header: () => (
        <Button
          variant="ghost"
          className="w-[70px] text-center flex items-center justify-center gap-2"
        >
          No <Bs123 className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="w-full text-center">{row.index + 1}</div>
      ),
    },
    {
      accessorKey: 'username',
      header: () => (
        <Button
          variant="ghost"
          className="text-center w-full flex items-center justify-center"
        >
          Customer Info <FaRegUserCircle className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const data = row.original
        return (
          <div className="text-left space-y-1">
            <button
              onClick={() => {
                setSelectedCustomer(data)
                setIsCustomerDialogOpen(true)
              }}
              className=" font-bold text-primary gap-1 flex leading-none hover:underline transition-all"
            >
              {data.full_name}{' '}
              <MdInfoOutline className="w-4 h-4 text-gray-500" />
            </button>

            <div className="flex gap-2 items-center">
              <div className="space-y-1 leading-none">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BsPerson className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{data.username}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <HiOutlineCalendar className="w-4 h-4 text-gray-500" />
                  <span>{data.birth_date}</span>
                </div>
              </div>

              <div className="space-y-1 text-sm border-l leading-none text-muted-foreground pl-2">
                <div className="flex items-center gap-2">
                  <BsTelephone className="w-4 h-4 text-blue-500" />
                  <span>{data.phone_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="w-4 h-4 text-green-500" />
                  <span>{data.whatsapp_number}</span>
                </div>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'awareness_source',
      header: () => (
        <Button
          variant="ghost"
          className="text-center w-full flex items-center justify-center gap-2"
        >
          Awareness Source <RiGiftLine className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const sources = row.original.awareness_source?.split('.') || []
        return (
          <div className="w-full flex flex-wrap items-center justify-center gap-1 text-center">
            {sources.map((source, index) => (
              <span
                key={index}
                className="bg-muted text-xs text-muted-foreground px-2 py-0.5 rounded-full"
              >
                {source}
              </span>
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: () => (
        <Button
          variant="ghost"
          className="text-center w-full flex items-center justify-center"
        >
          Created At <MdOutlineAccessTime className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {new Date(row.getValue('created_at')).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </div>
      ),
    },
    {
      accessorKey: 'updated_at',
      header: () => (
        <Button
          variant="ghost"
          className="text-center w-full flex items-center justify-center"
        >
          Updated At <MdOutlineUpdate className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {new Date(row.getValue('updated_at')).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
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

  const getAllDataMembershipCustomers = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/customers`,
      )
      const jsonData = response.data
      setData(jsonData.data) // <== make sure it's .data.data
    } catch (error) {
      console.error({ error })
      if (error.code === 'ERR_NETWORK') {
        Toast.fire({
          icon: 'error',
          title: `Data tidak dapat ditampilkan. Cek jaringan Anda!`,
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: `Server error, coba lagi nanti!`,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    getAllDataMembershipCustomers()
  }, [])

  return (
    <>
      <MembershipFormRegistration
        open={open}
        setOpen={setOpen}
        onSuccess={getAllDataMembershipCustomers}
      />

      {selectedCustomer && (
        <AlertDialog
          open={isCustomerDialogOpen}
          onOpenChange={setIsCustomerDialogOpen}
        >
          <AlertDialogContent className="max-w-md rounded-2xl border border-slate-200 shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <span className="text-2xl">👤</span> Customer Details
              </AlertDialogTitle>

              <AlertDialogDescription className="text-sm text-muted-foreground mt-1">
                Tampilkan informasi lengkap dari customer yang terpilih,
                termasuk identitas dan asal informasi (awareness).
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4 mt-4 text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-slate-500">Full Name:</span>
                <span className="font-medium">
                  {selectedCustomer.full_name}
                </span>

                <span className="text-slate-500">Username:</span>
                <span className="font-medium">
                  @{selectedCustomer.username}
                </span>

                <span className="text-slate-500">WhatsApp:</span>
                <span className="font-medium text-green-600">
                  {selectedCustomer.whatsapp_number}
                </span>

                <span className="text-slate-500">Phone:</span>
                <span className="font-medium">
                  {selectedCustomer.phone_number || '-'}
                </span>

                <span className="text-slate-500">Birth Date:</span>
                <span className="font-medium">
                  {selectedCustomer.birth_date}
                </span>

                <span className="text-slate-500">Awareness Source:</span>
                <span className="font-medium">
                  {selectedCustomer.awareness_source || '-'}
                </span>
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel className="mt-6 w-full bg-slate-100 hover:bg-slate-200 transition text-slate-700 rounded-md font-medium">
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <section className="gap-3 px-5  mt-5 ">
        <div className="w-full">
          <MembershipWeeklyReport
            leadsBaru={34}
            leadsToMember={12}
            klaimMembership={8}
            birthdayTreat={4}
            asalLeads={{ instagram: 10, website: 7, referral: 5 }}
          />

          <Card extra="gap-3 px-5 py-7 bg-white shadow-md rounded-2xl  mt-5">
            <div className="flex items-center justify-between py-4">
              <Input
                placeholder="Search member based on username.."
                value={table.getColumn('username')?.getFilterValue() ?? ''}
                onChange={(event) =>
                  table
                    .getColumn('username')
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <div className="flex gap-2">
                <MembershipCheck />
                <Button
                  onClick={() => setOpen(true)}
                  className="bg-orange hover:bg-orange"
                >
                  <div className="flex items-center gap-2"> Add Data </div>
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
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
        </div>
      </section>
    </>
  )
}

export default MembershipCustomers
