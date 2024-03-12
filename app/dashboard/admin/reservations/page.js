'use client';

import React from 'react';

// COMPONENTS CUSTOM
import Card from '@/app/components/Card';
import TableReservations from '@/app/components/TableReservations';

import { MdPaid } from 'react-icons/md';
import { MdOutlineAccessTimeFilled } from 'react-icons/md';
import { TiTimes } from 'react-icons/ti';
import { IoLogoGameControllerB } from 'react-icons/io';
import { MdOutlineDoneAll } from 'react-icons/md';
import { HiPhone } from 'react-icons/hi2';
import { HiCalendar } from 'react-icons/hi';
import { FaMoneyBillWaveAlt } from 'react-icons/fa';
import { PiHouseSimpleFill } from 'react-icons/pi';
import { BiSolidTime } from 'react-icons/bi';
import { BiSolidTimeFive } from 'react-icons/bi';
import { TbNumber } from 'react-icons/tb';
import { AiFillEdit } from 'react-icons/ai';

import { MdAttachMoney } from 'react-icons/md';
import { FaRupiahSign } from 'react-icons/fa6';

import { FaCircleUser } from 'react-icons/fa6';

import { AiFillDollarCircle } from 'react-icons/ai';

import { HiMiniQuestionMarkCircle } from 'react-icons/hi2';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

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
} from '@/components/ui/alert-dialog';
import { FiEdit3 } from 'react-icons/fi';
import { AiOutlineDelete } from 'react-icons/ai';
import { ArrowUpDown } from 'lucide-react';
import { IoIosInformationCircle } from 'react-icons/io';

// TABLE CONFIG
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { IoMdAdd } from 'react-icons/io';
import axios from 'axios';
import {
  convertDateFormat,
  getCurrentDate,
  getCurrentTime,
  getMaxDate,
  getMaxTime,
} from 'utils/date';
import Toast from '@/app/components/Toast';
import Loading from '@/app/loading';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { generateRandomString } from 'utils/id';

const IKUPNBPSakter = () => {
  /*********************************************************************
   * base url api & token
   *********************************************************************/
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [idReservasi, setIdReservasi] = React.useState(generateRandomString);

  /*********************************************************************
   * state for showing form IKU when create new IKU for PNBP Satker
   *********************************************************************/
  const [isFormIKUShowed, setIsFormIKUShowed] = React.useState(false);

  /*********************************************************************
   * state variables for storing changes data for create new IKU for PNBP Satker
   *********************************************************************/
  const [tanggal, setTanggal] = React.useState('');
  const [nilai, setNilai] = React.useState('');
  const [fungsional, setFungsional] = React.useState('');
  const [keterangan, setKeterangan] = React.useState('');
  const [linkBuktiOmspan, setLinkBuktiOmspan] = React.useState('');

  /*********************************************************************
   * state for storing all data IKU PNBP Satker
   *********************************************************************/
  const [data, setData] = React.useState([]);
  const [dataExcel, setDataExcel] = React.useState([]);

  /*********************************************************************
   * state and variables for table IKU PNBP Satker configuration
   *********************************************************************/
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
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
        );
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
        );
      },
      cell: ({ row }) => (
        <div
          className={`flex 
          items-center justify-center gap-1`}
        >
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
            onClick={() =>
              handleUpdateIKUPNBPSatker(row.getValue('IdPnbpSatker'))
            }
            variant="outline"
            className=" border border-horizonOrange-500 bg-horizonOrange-500 bg-opacity-10 text-xs  text-horizonOrange-500"
          >
            <FiEdit3 className="h-4 w-4" /> Edit
          </Button>
          <form action="" method="post">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-auto border border-horizonRed-500 bg-horizonRed-500 bg-opacity-10 text-xs text-horizonRed-500"
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
                  <AlertDialogAction
                    onClick={(e) =>
                      deleteIKUPNBPSatker(row.getValue('IdPnbpSatker'))
                    }
                  >
                    Continue
                  </AlertDialogAction>
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
            className={``}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            ID Reservasi
            <TbNumber className="ml-2 h-5 w-5" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div
          className={`text-center capitalize`}
        >
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
        );
      },
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-center text-center">
          <Badge
            className={`flex w-fit items-center gap-1 border bg-opacity-15 ${
              row.getValue('status_reserve') == 'settlement'
                ? 'border-horizonGreen-500 bg-horizonGreen-500 text-horizonGreen-600'
                : row.getValue('status_reserve') == 'pending'
                ? 'border-horizonOrange-500 bg-horizonOrange-500 text-horizonOrange-500'
                : 'border-horizonRed-500 bg-horizonRed-500 text-horizonRed-500'
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
        );
      },
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-center text-center">
          <Badge
            className={`flex w-fit items-center gap-1 border bg-opacity-15 ${
              row.getValue('status_payment') == 'done'
                ? 'border-blue-500 bg-blue-500 text-blue-600'
                : row.getValue('status_payment') == 'not playing'
                ? 'border-horizonPurple-400 bg-horizonPurple-500 text-horizonPurple-600'
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
        );
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
        );
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
        );
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
        );
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
        );
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
        );
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
        );
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
        );
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
        );
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
        );
      },
      cell: ({ row }) => (
        <div className="text-center uppercase">
          {row.getValue('updated_at').toString().slice(0, 11)}
        </div>
      ),
    },
  ];
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
  });

  const [idSelectedData, setIdSelectedData] = React.useState(0);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleUpdateIKUPNBPSatker = async (idPnbpSatker) => {
    console.log(idPnbpSatker);
    setIdSelectedData(idPnbpSatker);
    setIsFormIKUShowed(true);
    setIsUpdating(true);
    await getAllDataIKUPNBPSatkerById(idPnbpSatker);
  };

  const updateIKUPNBPSatker = async (e) => {
    e.preventDefault();

    const data = {
      Balai: balai,
      Tanggal: tanggal,
      Nilai: nilai,
      Fungsional: fungsional,
      Keterangan: keterangan,
      LinkBuktiOmspan: linkBuktiOmspan,
    };

    console.log({ data });

    try {
      const response = await fetch(
        `${baseUrl}/satminkal/Update-Iku-Pnbp-Satker/${idSelectedData}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        setIsLoading(false);
        console.error({ response });

        throw new Error('Failed to send data to the endpoint');
      }
      console.log(response);
      clearFormIKUPNBPSatker();

      Toast.fire({
        icon: 'success',
        title: `Berhasil mengupdate data pnbp satker!`,
      });

      setTimeout(() => {
        getAllDataIKUPNBPSatker();
        setIsUpdating(false);
        setIsLoading(false);
        setIsFormIKUShowed(!isFormIKUShowed);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      console.error({ error });

      Toast.fire({
        icon: 'error',
        title: `Gagal mengupdate data pnbp satker!`,
      });
    }
  };

  /*********************************************************************
   * state for displaying loading process for CRUD
   *********************************************************************/
  const [isLoading, setIsLoading] = React.useState(false);

  /*********************************************************************
   * function to GET all data IKU PNBP Satker
   *********************************************************************/
  const getAllDataIKUPNBPSatker = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/reservations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status == 200) {
        const jsonData = await response.data;
        setData(jsonData);
        console.log({ jsonData });
        setIsLoading(false);
      } else {
        setIsLoading(false);
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      setIsLoading(false);
      if (error.code == 'ERR_NETWORK') {
        Toast.fire({
          icon: 'error',
          title: `Data tidak dapat ditampilkan. Koneksi anda terputus, cek jaringan anda!`,
        });
      } else {
        Toast.fire({
          icon: 'error',
          title: `Internal server sedang error, coba lagi nanti!`,
        });
      }
    }
  };

  const [dataById, setDataById] = React.useState(null);
  const getAllDataIKUPNBPSatkerById = async (id) => {
    try {
      const response = await axios.get(
        `${baseUrl}/satminkal/Get-Iku-Pnbp-Satker/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status == 200) {
        const jsonData = await response.data;
        setSatker(jsonData.Satminkal);
        setDataById(jsonData.Data);
        setTanggal(convertDateFormat(jsonData.Data.Tanggal));
        setNilai(jsonData.Data.Nilai);
        setFungsional(jsonData.Data.Fungsional);
        setKeterangan(jsonData.Data.Keterangan);
        setLinkBuktiOmspan(jsonData.Data.LinkBuktiOmspan);
        console.log({ jsonData });
      } else {
        console.log(response);
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*********************************************************************
   * function to POST IKU PNBP Satker
   *********************************************************************/
  const clearFormIKUPNBPSatker = () => {
    setNamaReservasi('');
    setTanggalReservasi('');
    setStartTimeReservasi('');
    setEndTimeReservasi('');
    setKontakReservasi('');
    setIdReservasi(generateRandomString);
  };

  const postIKUPNBPSatker = async (e) => {
    e.preventDefault();

    const data = {
      Balai: balai,
      Tanggal: tanggal,
      Nilai: nilai,
      Fungsional: fungsional,
      Keterangan: keterangan,
      LinkBuktiOmspan: linkBuktiOmspan,
    };

    console.log({ data });

    setIsLoading(true);

    try {
      const response = await fetch(
        `${baseUrl}/satminkal/Create-Iku-Pnbp-Satker`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        setIsLoading(false);
        console.error({ response });
        throw new Error('Failed to send data to the endpoint');
      }
      console.log(response);
      clearFormIKUPNBPSatker();

      Toast.fire({
        icon: 'success',
        title: `Berhasil menambahkan data pnbp satker!`,
      });

      console.log({ response });

      setTimeout(() => {
        getAllDataIKUPNBPSatker();
        setIsLoading(false);
        setIsFormIKUShowed(!isFormIKUShowed);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      console.error({ error });

      Toast.fire({
        icon: 'error',
        title: `Gagal menambahkan data pnbp satker!`,
      });
    }
  };

  /*********************************************************************
   * function to DELETE IKU PNBP Satker
   *********************************************************************/
  const deleteIKUPNBPSatker = async (id) => {
    try {
      const response = await axios
        .delete(`${baseUrl}/satminkal/Delete-Iku-Pnbp-Satker/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Call getTokenCookie function to get the token
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log(response);
          setIsLoading(false);
          setTimeout(() => {
            Toast.fire({
              icon: 'success',
              title: `Berhasil menghapus data pnbp satker!`,
            });
            getAllDataIKUPNBPSatker();
          }, 500);
        })
        .catch((error) => {
          console.error(error);
          throw new Error('Failed to delete data to the endpoint');
        });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  /*********************************************************************
   * state variables & function to IMPORT EXCEL IKU Kelompok Disuluh
   *********************************************************************/
  const [open, setOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isLoadingSendingExcel, setIsLoadingSendingExcel] =
    React.useState(false);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleImportExcel = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    setIsLoadingSendingExcel(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post(
        `${baseUrl}/app/import-iku-pnbp`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      getAllDataIKUPNBPSatker();
      Toast.fire({
        icon: 'success',
        title: `Berhasil menambahkan data PNBP Satker Puslatluh!`,
      });

      console.log('File uploaded successfully:', response.data);

      setOpen(false);
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: `Gagal menambahkan data PNBP Satker Puslatluh!`,
      });
      console.error('Error uploading file:', error);
      setOpen(false);
    }

    setIsLoadingSendingExcel(false);
  };

  const [namaReservasi, setNamaReservasi] = React.useState('');
  const [kontakReservasi, setKontakReservasi] = React.useState('');
  const [floorSelected, setFloorSelected] = React.useState('');
  const [tanggalReservasi, setTanggalReservasi] = React.useState('');
  const [startTimeReservasi, setStartTimeReservasi] = React.useState('');
  const [endTimeReservasi, setEndTimeReservasi] = React.useState('');
  const [totalTime, setTotalTime] = React.useState(null);
  const [currentDate, setCurrentDate] = React.useState(getCurrentDate);
  const [maxDate, setMaxDate] = React.useState(getMaxDate);
  const [currentTime, setCurrentTime] = React.useState(getCurrentTime);
  const [maxTime, setMaxTime] = React.useState(getMaxTime);

  /**
   * hooks useEffect
   */
  React.useEffect(() => {
    getAllDataIKUPNBPSatker();
  }, []);

  return (
    <div className="relative">
      <div>
        <Card extra="mt-6 p-5 text-base">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            Daftar Data Reservasi
          </h4>
          <div className="w-full">
            <div className="flex items-center justify-between py-4">
              <Input
                placeholder="Cari ID Reservasi..."
                value={
                  (table.getColumn('Satminkal')?.getFilterValue()) ??
                  ''
                }
                onChange={(event) =>
                  table
                    .getColumn('Satminkal')
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <div className="flex gap-1">
                  <AlertDialog open={open}>
                    <AlertDialogTrigger asChild>
                      <Button
                        onClick={(e) => setOpen(true)}
                        variant="outline"
                        className="ml-auto"
                      >
                        Tambah Reservasi <IoMdAdd className="ml-2 h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-2xl">
                          Reservasi Ikuzo Playstation!
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                          Lakukan reservasi dan pembayaran melalui dashboard
                          admin untuk pemesanan secara offline.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <fieldset>
                        <form className="mt-3 flex w-full  flex-col gap-4">
                          <div className="grid w-full  items-center gap-1.5">
                            <Label htmlFor="kanal_pemasaran">
                              ID Reservasi
                            </Label>
                            <div className="flex-items-center flex justify-center gap-1">
                              <Input
                                type="number"
                                id="pagu"
                                className="w-full"
                                placeholder={idReservasi}
                                readOnly={true}
                                value={idReservasi}
                              />
                            </div>
                          </div>
                          <div className="flex w-full  items-center gap-1.5">
                            <div className="flex w-full flex-col gap-1">
                              <Label htmlFor="kanal_pemasaran">
                                Nama Reservasi
                              </Label>
                              <div className="flex-items-center flex justify-center gap-1">
                                <Input
                                  type="number"
                                  id="pagu"
                                  className="w-full"
                                  placeholder="Nama..."
                                  value={namaReservasi}
                                  onChange={(e) =>
                                    setNamaReservasi(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                              <Label htmlFor="kanal_pemasaran">
                                Tanggal Reservasi
                              </Label>
                              <div className="flex-items-center flex justify-center gap-1">
                                <Input
                                  type="date"
                                  id="pagu"
                                  className="w-full"
                                  placeholder="Anggaran (Rp)..."
                                  value={tanggalReservasi}
                                  onChange={(e) =>
                                    setTanggalReservasi(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="5 flex w-full items-center gap-1">
                            <div className="grid w-full  items-center gap-1.5">
                              <Label htmlFor="kanal_pemasaran">
                                Waktu Reservasi
                              </Label>
                              <div className="flex-items-center flex justify-center gap-1">
                                <Input
                                  type="time"
                                  id="pagu"
                                  className="w-full"
                                  placeholder="Anggaran (Rp)..."
                                  value={startTimeReservasi}
                                  onChange={(e) =>
                                    setStartTimeReservasi(e.target.value)
                                  }
                                />
                                <Input
                                  type="time"
                                  id="realisasi"
                                  className="w-full"
                                  placeholder="Realisasi (Rp)..."
                                  value={endTimeReservasi}
                                  onChange={(e) =>
                                    setEndTimeReservasi(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div className="grid w-full  items-center gap-1.5">
                              <Label htmlFor="kanal_pemasaran">
                                Lokasi Reservasi
                              </Label>
                              <div className="flex-items-center flex justify-center gap-1">
                                <Input
                                  type="text"
                                  id="pagu"
                                  className="w-full"
                                  placeholder="Lokasi..."
                                  value={namaReservasi}
                                  onChange={(e) =>
                                    setNamaReservasi(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid w-full  items-center gap-1.5">
                            <Label htmlFor="kanal_pemasaran">
                              Nomor Telpon/Whatsapp
                            </Label>
                            <div className="flex-items-center flex justify-center gap-1">
                              <Input
                                type="number"
                                id="pagu"
                                className="w-full"
                                placeholder="No Tlp/Whatsapp..."
                                value={kontakReservasi}
                                onChange={(e) =>
                                  setKontakReservasi(e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <AlertDialogFooter>
                            <Button
                              onClick={() => {
                                setOpen(false);
                                setIdReservasi(generateRandomString);
                              }}
                              type="button"
                              variant="outline"
                            >
                              Cancel
                            </Button>
                            <Button type="submit" variant="outline">
                              Continue
                            </Button>
                          </AlertDialogFooter>
                        </form>
                      </fieldset>
                    </AlertDialogContent>
                  </AlertDialog>
           
  
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
      </div>
    </div>
  );
};

export default IKUPNBPSakter;
