'use client'

import { Bs123 } from 'react-icons/bs'
import {
  MdManageAccounts,
  MdPriceCheck,
  MdOutlineAccessTime,
  MdOutlineUpdate,
} from 'react-icons/md'
import { FaRegUserCircle } from 'react-icons/fa'
import { HiOutlineCalendar } from 'react-icons/hi'
import { RiGiftLine } from 'react-icons/ri'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiEdit3 } from 'react-icons/fi'
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

import { IoMdAdd } from 'react-icons/io'
import axios from 'axios'

import Toast from '@/app/components/Toast'
import Loading from '../loading'
import Cookies from 'js-cookie'

function MembershipTiers() {
  const [data, setData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  const [openUpdate, setOpenUpdate] = React.useState(false)
  const [idSelected, setIdSelected] = React.useState('')

  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  }

  const clearData = () => {
    setFullName('')
    setPeriod('')
    setPrice('')
    setIcon('')
    setBenefits('')
    setFormattedBenefits('')
  }

  const handleOpenUpdate = (id) => {
    const selected = data.find((item) => item.id === id)
    if (!selected) return

    setOpenAddNewTier(true) // Open the dialog/modal
    setOpenUpdate(true) // Switch to update mode
    setIdSelected(id)

    setFullName(selected.full_name || '')
    setPrice(selected.price || '')
    setPeriod(selected.period || '')
    setIcon(selected.icon || '')
    setBenefits(stripHtmlTags(selected.benefits) || '')
    setFormattedBenefits(selected.benefits || '') // Optional: if you want preview to show too
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
          <Bs123 className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center uppercase">{row.index + 1}</div>
      ),
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex w-full items-center justify-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Action
          <MdManageAccounts className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            onClick={() => handleOpenUpdate(row.getValue('id'))}
            variant="outline"
            className="border border-yellow-500 hover:bg-yellow-500 bg-yellow-200 bg-opacity-10 text-xs text-yellow-500"
          >
            <FiEdit3 className="h-4 w-4" /> Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border border-red-500 hover:bg-red-500 bg-red-200 bg-opacity-10 text-xs hover:text-white text-red-500"
              >
                <AiOutlineDelete className="h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  item from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="border border-red-500 hover:bg-red-500 bg-red-200 bg-opacity-10 text-xs hover:text-white text-red-500"
                  onClick={() => handleDeleteMembershipTier(row.getValue('id'))}
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
      accessorKey: 'full_name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full"
        >
          Full Name
          <FaRegUserCircle className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="w-full text-center">
          {row.original.icon}
          {row.getValue('full_name')}
        </div>
      ),
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full"
        >
          Price
          <MdPriceCheck className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="w-full text-center">
          Rp {parseInt(row.getValue('price')).toLocaleString('id-ID')}
        </div>
      ),
    },
    {
      accessorKey: 'period',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full"
        >
          Period
          <HiOutlineCalendar className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="w-full text-center capitalize">
          {row.getValue('period')}
        </div>
      ),
    },
    {
      accessorKey: 'benefits',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full"
        >
          Benefits
          <RiGiftLine className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div
          className="prose max-w-none text-sm leading-none min-w-[400px] overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: row.getValue('benefits') }}
        />
      ),
    },

    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full"
        >
          Created At
          <MdOutlineAccessTime className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="w-full text-center">
          {new Date(row.getValue('created_at')).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </div>
      ),
    },
    {
      accessorKey: 'updated_at',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full"
        >
          Updated At
          <MdOutlineUpdate className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="w-full text-center">
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const token = Cookies.get('token')

  const getAllDataMembershipTiers = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/membership-tiers`,
      )
      const jsonData = await response.data
      setData(jsonData)
      console.log({ jsonData })
      setIsLoading(false)
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

  const [openAddNewTier, setOpenAddNewTier] = React.useState(false)

  // ADD TIER
  const [isUploading, setIsUploading] = React.useState(false)

  const [fullName, setFullName] = React.useState('')
  const [price, setPrice] = React.useState('')
  const [period, setPeriod] = React.useState('') // e.g. 'Monthly', 'Yearly'
  const [benefits, setBenefits] = React.useState('')
  const [formattedBenefits, setFormattedBenefits] = React.useState('')
  const [icon, setIcon] = React.useState('') // e.g. "💎"

  const formatBenefitsToHTML = (raw) => {
    const lines = raw.split('\n').filter((line) => line.trim() !== '')

    const listItems = lines
      .map(
        (line) =>
          `<li style="font-weight: 400;" aria-level="1"><span style="font-weight: 400;">${line}</span><span style="font-weight: 400;"><br /><br /></span></li>`,
      )
      .join('\n')

    return `<ul>\n${listItems}\n</ul>`
  }

  const handleAddNewTier = async (e) => {
    e.preventDefault()
    setIsUploading(true)

    const formData = new FormData()
    formData.append('full_name', fullName) // e.g. "IKUZO PREMIUM+"
    formData.append('price', price) // e.g. "199000.00"
    formData.append('period', period) // e.g. "Monthly"
    formData.append('benefits', formattedBenefits) // HTML string from editor or textarea
    formData.append('icon', icon) // e.g. "💎"

    try {
      await axios.post(`${baseUrl}/membership-tiers`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      Toast.fire({
        icon: 'success',
        title: `Membership Tier berhasil ditambahkan!`,
      })

      getAllDataMembershipTiers()
      setOpenAddNewTier(false)
      clearData()
      setIsUploading(false)
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        Toast.fire({
          icon: 'error',
          title: `Gagal menambahkan Membership Tier!`,
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: `Terjadi kesalahan server, coba lagi nanti!`,
        })
      }

      clearData()
      setIsUploading(false)
      setOpenAddNewTier(false)
    }
  }

  // UPDATE TIER
  const handleUpdateTier = async (id) => {
    const data = {
      id: id,
      full_name: fullName,
      period: period,
      price: price,
      benefits: formattedBenefits,
    }
    setIsUploading(true)

    try {
      const response = await axios.put(
        `${baseUrl}/membership-tiers/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const jsonData = await response.data
      console.log({ jsonData })

      Toast.fire({
        icon: 'success',
        title: `Data membership tiers berhasil diupdate!`,
      })

      getAllDataMembershipTiers()
      clearData()
      setOpenUpdate(false)
      setOpenAddNewTier(false)
      setIsUploading(false)
    } catch (error) {
      console.error({ error })
      clearData()
      setIsUploading(false)

      if (error.code == 'ERR_NETWORK') {
        Toast.fire({
          icon: 'error',
          title: `Data membership tiers gagal diupdate!`,
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: `Internal server sedang error, coba lagi nanti!`,
        })
      }
      setOpenUpdate(false)
      setOpenAddNewTier(false)
    }
  }

  // DELETE TIER
  const handleDeleteMembershipTier = async (id) => {
    try {
      await axios.delete(`${baseUrl}/membership-tiers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      Toast.fire({
        icon: 'success',
        title: `Data membership tier berhasil dihapus!`,
      })

      getAllDataMembershipTiers()
      setIdSelected('')
    } catch (error) {
      setIdSelected('')
      console.log({ erro })

      if (error.code == 'ERR_NETWORK') {
        Toast.fire({
          icon: 'error',
          title: `Data membership tier gagal dihapus!`,
        })
      } else {
        Toast.fire({
          icon: 'error',
          title: error.response.data,
        })
      }
    }
  }

  React.useEffect(() => {
    getAllDataMembershipTiers()
  }, [])

  return (
    <>
      <section className="gap-3 px-5 ml-8 bg-white shadow-md rounded-lg mt-5 ">
        <Card extra="mt-6 p-5 text-base">
          <div className="w-full">
            <div className="flex items-center justify-between py-4">
              <Input
                placeholder="Cari Tier..."
                value={table.getColumn('full_name')?.getFilterValue() ?? ''}
                onChange={(event) =>
                  table
                    .getColumn('full_name')
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <div className="flex gap-1">
                <Button
                  onClick={(e) => setOpenAddNewTier(!openAddNewTier)}
                  variant="outline"
                  className="ml-auto"
                >
                  Add New Tier <IoMdAdd className="ml-2 h-4 w-4" />
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

        <AlertDialog className="bg-black/20" open={openAddNewTier}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {!openUpdate ? 'Tambah' : 'Update'} Membership Tier
              </AlertDialogTitle>
              <AlertDialogDescription>
                {!openUpdate
                  ? ' Silakan isi detail untuk membership tier baru.'
                  : ' Silakan mengupdate data membership tier'}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <fieldset>
              <form className="flex flex-col gap-3">
                <>
                  <div>
                    <label className="text-black" htmlFor="full_name">
                      Nama Paket
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Contoh: IKUZO PREMIUM+"
                      className="border border-border bg-transparent text-black placeholder:text-gray-400 rounded-lg px-3 py-2 w-full focus:border-orange outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-black" htmlFor="price">
                      Harga (Rp)
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Contoh: 199000"
                      className="border border-border bg-transparent text-black placeholder:text-gray-400 rounded-lg px-3 py-2 w-full focus:border-orange outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-black" htmlFor="period">
                      Periode
                    </label>
                    <select
                      id="period"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="border border-border bg-transparent text-black rounded-lg px-3 py-2 w-full focus:border-orange outline-none"
                      required
                    >
                      <option value="" disabled>
                        Pilih periode
                      </option>
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-black" htmlFor="icon">
                      Ikon (emoji)
                    </label>
                    <input
                      type="text"
                      id="icon"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      placeholder="Contoh: 💎"
                      className="border border-border bg-transparent text-black placeholder:text-gray-400 rounded-lg px-3 py-2 w-full focus:border-orange outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-black" htmlFor="benefits">
                      Manfaat
                    </label>
                    <textarea
                      id="benefits"
                      value={benefits}
                      onChange={(e) => {
                        const rawValue = e.target.value
                        setBenefits(rawValue)
                        setFormattedBenefits(formatBenefitsToHTML(rawValue))
                      }}
                      placeholder="Tulis manfaat paket"
                      className="border border-border bg-transparent text-black placeholder:text-gray-400 rounded-lg px-3 py-2 w-full focus:border-orange outline-none min-h-[120px]"
                      required
                    />
                    <p
                      className="prose prose-sm leading-none"
                      dangerouslySetInnerHTML={{ __html: formattedBenefits }}
                    />
                  </div>
                </>
              </form>
            </fieldset>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenAddNewTier(false)}>
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isUploading}
                onClick={(e) =>
                  openUpdate
                    ? handleUpdateTier(idSelected)
                    : handleAddNewTier(e)
                }
              >
                {!openUpdate
                  ? isUploading
                    ? 'Menambahkan...'
                    : 'Tambahkan'
                  : isUploading
                  ? 'Mengupdate...'
                  : 'Update'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </>
  )
}

export default MembershipTiers
