'use client'

import { Bs123 } from 'react-icons/bs'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  MdOutlineAccessTime,
  MdOutlineUpdate,
  MdInfoOutline,
} from 'react-icons/md'
import { RiGiftLine } from 'react-icons/ri'
import {
  FaCalendarAlt,
  FaClock,
  FaEdit,
  FaGift,
  FaPlus,
  FaRegUserCircle,
  FaTrash,
  FaWhatsapp,
  FaUsers,
  FaMapMarkerAlt,
  FaMoneyBillWave,
} from 'react-icons/fa'
import { BsTelephone, BsPerson } from 'react-icons/bs'
import { HiOutlineCalendar } from 'react-icons/hi'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import React from 'react'
import Card from '@/app/components/Card'
import TableReservations from '@/app/components/TableReservations'
import Toast from '@/app/components/Toast'
import Loading from '../loading'
import MembershipFormRegistration from '@/app/components/Membership/MembershipFormRegistration'

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import axios from 'axios'
import { ChevronDown, Plus, Users } from 'lucide-react'

function MembershipCustomers() {
  const [data, setData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [selectedCustomer, setSelectedCustomer] = React.useState(null)
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = React.useState(false)
  const [isBenefitsDialogOpen, setIsBenefitsDialogOpen] = React.useState(false)
  const [
    isBulkBenefitsDialogOpen,
    setIsBulkBenefitsDialogOpen,
  ] = React.useState(false)
  const [isSavedTimesDialogOpen, setIsSavedTimesDialogOpen] = React.useState(
    false,
  )
  const [
    isReservationsDialogOpen,
    setIsReservationsDialogOpen,
  ] = React.useState(false)

  const [open, setOpen] = React.useState(false)
  const [benefitInputs, setBenefitInputs] = React.useState([''])
  const [bulkBenefitInputs, setBulkBenefitInputs] = React.useState([''])
  const [isBulkLoading, setIsBulkLoading] = React.useState(false)

  const [globalFilter, setGlobalFilter] = React.useState('')

  const customGlobalFilterFn = (row, columnId, filterValue) => {
    const username = row.getValue('username')?.toString().toLowerCase() || ''
    const phoneNumber = row.getValue('phone_number')?.toString() || ''
    const searchValue = filterValue.toLowerCase()

    // Jika tidak ada search, tampilkan semua
    if (!searchValue) return true

    // Normalize nomor telepon ke format 62xxx
    const normalizePhone = (phone) => {
      if (!phone) return ''
      phone = phone.replace(/\D/g, '')
      if (phone.startsWith('0')) {
        return '62' + phone.substring(1)
      }
      if (phone.startsWith('62')) {
        return phone
      }
      return phone
    }

    const normalizedPhone = normalizePhone(phoneNumber)
    const normalizedSearch = normalizePhone(searchValue)

    // Search di username ATAU phone_number
    const matchUsername = username.includes(searchValue)
    const matchPhone =
      normalizedPhone.includes(normalizedSearch) ||
      phoneNumber.includes(searchValue)

    return matchUsername || matchPhone
  }

  // Columns Definition
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
      accessorKey: 'actions',
      header: () => (
        <Button
          variant="ghost"
          className="text-center w-full flex items-center justify-center"
        >
          Action <FaEdit className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="flex gap-2 flex-col">
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
              onClick={() => {
                setSelectedCustomer(customer)
                setIsBenefitsDialogOpen(true)
              }}
            >
              <FaGift className="w-3 h-3 mr-1" />
              Benefits
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="text-green-600 border-green-600 hover:bg-green-50"
              onClick={() => {
                setSelectedCustomer(customer)
                setIsSavedTimesDialogOpen(true)
              }}
            >
              <FaClock className="w-3 h-3 mr-1" />
              Saved Times
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="text-purple-600 border-purple-600 hover:bg-purple-50"
              onClick={() => {
                setSelectedCustomer(customer)
                setIsReservationsDialogOpen(true)
              }}
            >
              <FaCalendarAlt className="w-3 h-3 mr-1" />
              Reservations
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'username',
      header: () => (
        <Button
          variant="ghost"
          className="text-center w-full flex items-center justify-center"
        >
          Member Info <FaRegUserCircle className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="text-left space-y-1">
            <button
              onClick={() => {
                setSelectedCustomer(customer)
                setIsCustomerDialogOpen(true)
              }}
              className="font-bold text-primary gap-1 flex leading-none hover:underline transition-all"
            >
              {customer.full_name}
              <MdInfoOutline className="w-4 h-4 text-gray-500" />
            </button>

            <div className="flex gap-2 items-center">
              <div className="space-y-1 leading-none">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BsPerson className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{customer.username}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <HiOutlineCalendar className="w-4 h-4 text-gray-500" />
                  <span>{customer.birth_date}</span>
                </div>
              </div>

              <div className="space-y-1 text-sm border-l leading-none text-muted-foreground pl-2">
                <div className="flex items-center gap-2">
                  <BsTelephone className="w-4 h-4 text-blue-500" />
                  <span>{customer.phone_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="w-4 h-4 text-green-500" />
                  <span>{customer.whatsapp_number}</span>
                </div>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'phone_number',
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

  // Table Configuration
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: customGlobalFilterFn,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  // API Functions
  const getAllDataMembershipCustomers = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/customers`,
      )
      setData(response.data.data)
    } catch (error) {
      console.error({ error })
      const message =
        error.code === 'ERR_NETWORK'
          ? 'Data tidak dapat ditampilkan. Cek jaringan Anda!'
          : 'Server error, coba lagi nanti!'
      Toast.fire({ icon: 'error', title: message })
    } finally {
      setIsLoading(false)
    }
  }

  console.log('ALL MEMBER', data)

  // Function untuk save benefits (single customer)
  const handleSaveBenefits = async () => {
    if (!selectedCustomer) return

    try {
      const benefitsString = benefitInputs.filter((b) => b.trim()).join('.')

      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${selectedCustomer.id}/benefits`,
        { benefits: benefitsString },
      )

      Toast.fire({
        icon: 'success',
        title: 'Benefits updated successfully!',
      })

      setIsBenefitsDialogOpen(false)
      setBenefitInputs([''])
      getAllDataMembershipCustomers()
    } catch (error) {
      console.error(error)
      Toast.fire({
        icon: 'error',
        title: 'Failed to update benefits!',
      })
    }
  }

  // Function untuk save benefits ke semua customer
  const handleSaveBulkBenefits = async () => {
    setIsBulkLoading(true)
    try {
      const benefitsString = bulkBenefitInputs.filter((b) => b.trim()).join('.')

      // Loop through all customers
      const promises = data.map((customer) =>
        axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${customer.id}/benefits`,
          { benefits: benefitsString },
        ),
      )

      await Promise.all(promises)

      Toast.fire({
        icon: 'success',
        title: `Benefits updated for ${data.length} customers!`,
      })

      setIsBulkBenefitsDialogOpen(false)
      setBulkBenefitInputs([''])
      getAllDataMembershipCustomers()
    } catch (error) {
      console.error(error)
      Toast.fire({
        icon: 'error',
        title: 'Failed to update benefits!',
      })
    } finally {
      setIsBulkLoading(false)
    }
  }

  // Reset inputs saat dialog dibuka
  React.useEffect(() => {
    if (isBenefitsDialogOpen && selectedCustomer?.benefits) {
      setBenefitInputs(selectedCustomer.benefits.split('.'))
    } else if (isBenefitsDialogOpen) {
      setBenefitInputs([''])
    }
  }, [isBenefitsDialogOpen, selectedCustomer])

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

      <section className="gap-3 px-5">
        <div className="w-full">
          <Card extra="gap-3 px-5 py-7 bg-white shadow-md rounded-2xl">
            <div className="flex items-center justify-between py-4">
              <Input
                placeholder="Search by username or phone number..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="max-w-sm"
              />
              <div className="flex gap-2 items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="bg-orange hover:bg-orange/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Settings
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent align="end" className="w-48 p-2">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => setOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-neutral-100 transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Member
                      </button>

                      <button
                        onClick={() => setIsBulkBenefitsDialogOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-neutral-100 transition-colors text-sm"
                      >
                        <Users className="w-4 h-4" />
                        Bulk Benefits
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
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
                  type="short"
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

      {/* Customer Details Dialog */}
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
                Informasi lengkap customer termasuk identitas dan asal
                informasi.
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

      {/* Single Customer Benefits Dialog */}
      <AlertDialog
        open={isBenefitsDialogOpen}
        onOpenChange={setIsBenefitsDialogOpen}
      >
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <FaGift className="w-5 h-5 text-blue-600" />
              Customer Benefits
            </AlertDialogTitle>
            <AlertDialogDescription>
              Add benefits for {selectedCustomer?.full_name}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4 space-y-4">
            {selectedCustomer?.benefits && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Current Benefits:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedCustomer.benefits
                    .split('.')
                    .map((benefit, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"
                      >
                        {benefit}
                      </span>
                    ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-sm font-medium">Add New Benefits</label>
              {benefitInputs.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Benefit ${index + 1}`}
                    value={benefit}
                    onChange={(e) => {
                      const newInputs = [...benefitInputs]
                      newInputs[index] = e.target.value
                      setBenefitInputs(newInputs)
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => {
                      const newInputs = benefitInputs.filter(
                        (_, i) => i !== index,
                      )
                      setBenefitInputs(newInputs)
                    }}
                  >
                    <FaTrash className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
                onClick={() => setBenefitInputs([...benefitInputs, ''])}
              >
                <FaPlus className="w-3 h-3 mr-1" />
                Add More Benefit
              </Button>
            </div>

            {benefitInputs.some((b) => b.trim()) && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Preview:
                </p>
                <p className="text-sm text-gray-600">
                  {benefitInputs.filter((b) => b.trim()).join('.')}
                </p>
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSaveBenefits}
            >
              Save Benefits
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Benefits Dialog */}
      <AlertDialog
        open={isBulkBenefitsDialogOpen}
        onOpenChange={setIsBulkBenefitsDialogOpen}
      >
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <FaUsers className="w-5 h-5 text-orange" />
              Bulk Add Benefits to All Customers
            </AlertDialogTitle>
            <AlertDialogDescription>
              Add benefits to all {data.length} customers at once
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4 space-y-4">
            <div className="p-3 bg-orange/10 border border-orange/30 rounded-lg">
              <p className="text-sm font-medium text-orange-900 mb-1">
                ⚠️ Warning
              </p>
              <p className="text-xs text-orange-800">
                This will apply the same benefits to all customers. Existing
                benefits will be replaced.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Benefits to Add</label>
              {bulkBenefitInputs.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Benefit ${index + 1}`}
                    value={benefit}
                    onChange={(e) => {
                      const newInputs = [...bulkBenefitInputs]
                      newInputs[index] = e.target.value
                      setBulkBenefitInputs(newInputs)
                    }}
                    className="flex-1"
                  />
                  {bulkBenefitInputs.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => {
                        const newInputs = bulkBenefitInputs.filter(
                          (_, i) => i !== index,
                        )
                        setBulkBenefitInputs(newInputs)
                      }}
                    >
                      <FaTrash className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                className="w-full text-orange border-orange hover:bg-orange/10"
                onClick={() => setBulkBenefitInputs([...bulkBenefitInputs, ''])}
              >
                <FaPlus className="w-3 h-3 mr-1" />
                Add More Benefit
              </Button>
            </div>

            {bulkBenefitInputs.some((b) => b.trim()) && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Preview:
                </p>
                <p className="text-sm text-gray-600">
                  {bulkBenefitInputs.filter((b) => b.trim()).join('.')}
                </p>
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkLoading}>
              Cancel
            </AlertDialogCancel>
            <Button
              className="bg-orange hover:bg-orange/90"
              onClick={handleSaveBulkBenefits}
              disabled={
                !bulkBenefitInputs.some((b) => b.trim()) || isBulkLoading
              }
            >
              {isBulkLoading
                ? 'Saving...'
                : `Save to All ${data.length} Customers`}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Saved Times Dialog */}
      <AlertDialog
        open={isSavedTimesDialogOpen}
        onOpenChange={setIsSavedTimesDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <FaClock className="w-5 h-5 text-green-600" />
              Saved Times
            </AlertDialogTitle>
            <AlertDialogDescription>
              Saved times for {selectedCustomer?.full_name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <p>Saved times content goes here...</p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reservations Dialog */}
      <AlertDialog
        open={isReservationsDialogOpen}
        onOpenChange={setIsReservationsDialogOpen}
      >
        <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <FaCalendarAlt className="w-5 h-5 text-purple-600" />
              Reservations History
            </AlertDialogTitle>
            <AlertDialogDescription>
              Showing all reservations for{' '}
              <span className="font-semibold text-black">
                {selectedCustomer?.full_name}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4 overflow-y-auto max-h-[500px]">
            {selectedCustomer?.reservations?.length > 0 ? (
              <div className="space-y-3">
                {selectedCustomer.reservations.map((reservation, index) => (
                  <div
                    key={reservation.reserve_id || index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    {/* Header with Status */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base text-gray-900">
                          {reservation.location}
                        </h3>
                        <p className="text-xs text-gray-500">
                          ID: {reservation.reserve_id}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          reservation.status_reserve === 'settlement'
                            ? 'bg-green-100 text-green-700'
                            : reservation.status_reserve === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : reservation.status_reserve === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {reservation.status_reserve?.toUpperCase()}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {/* Date */}
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="font-medium text-gray-900">
                            {new Date(
                              reservation.reserve_date,
                            ).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-2">
                        <FaClock className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="font-medium text-gray-900">
                            {reservation.reserve_start_time} -{' '}
                            {reservation.reserve_end_time}
                          </p>
                        </div>
                      </div>

                      {/* Position */}
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Position</p>
                          <p className="font-medium text-gray-900">
                            Position {reservation.position}
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <FaMoneyBillWave className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="font-medium text-gray-900">
                            IDR {reservation.price?.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm">
                        <FaWhatsapp className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600">
                          {reservation.reserve_contact}
                        </span>
                      </div>
                    </div>

                    {/* Saving Times if exists */}
                    {reservation.saving_times?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Modified Times:
                        </p>
                        <div className="space-y-1">
                          {reservation.saving_times.map((saveTime, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs bg-blue-50 p-2 rounded"
                            >
                              <span>
                                {new Date(
                                  saveTime.date_saving,
                                ).toLocaleDateString('id-ID')}{' '}
                                • {saveTime.start_time_saving} -{' '}
                                {saveTime.end_time_saving}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded ${
                                  saveTime.is_active === 'Active'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {saveTime.is_active}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaCalendarAlt className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Reservations Yet
                </h3>
                <p className="text-sm text-gray-500 text-center max-w-sm">
                  This customer hasn't made any reservations yet.
                </p>
              </div>
            )}
          </div>

          {/* Footer with Summary */}
          {selectedCustomer?.reservations?.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Total Reservations:{' '}
                  <span className="font-semibold text-gray-900">
                    {selectedCustomer.reservations.length}
                  </span>
                </span>
                <span className="text-gray-600">
                  Total Spent:{' '}
                  <span className="font-semibold text-purple-600">
                    IDR{' '}
                    {selectedCustomer.reservations
                      .reduce((sum, r) => sum + (r.price || 0), 0)
                      .toLocaleString('id-ID')}
                  </span>
                </span>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default MembershipCustomers
