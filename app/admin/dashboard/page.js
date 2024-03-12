// 'use client'

// import Card from '@/app/components/Card';
// import { MdPaid } from 'react-icons/md';
// import { MdOutlineAccessTimeFilled } from 'react-icons/md';
// import { TiTimes } from 'react-icons/ti';
// import { IoLogoGameControllerB, IoMdAdd } from 'react-icons/io';
// import { MdOutlineDoneAll } from 'react-icons/md';
// import { HiPhone } from 'react-icons/hi2';
// import { HiCalendar } from 'react-icons/hi';
// import { FaMoneyBillWaveAlt } from 'react-icons/fa';
// import { PiHouseSimpleFill } from 'react-icons/pi';
// import { BiSolidTime } from 'react-icons/bi';
// import { BiSolidTimeFive } from 'react-icons/bi';
// import { TbNumber } from 'react-icons/tb';
// import { AiFillEdit } from 'react-icons/ai';

// import { FaRupiahSign } from 'react-icons/fa6';

// import { FaCircleUser } from 'react-icons/fa6';

// import { HiMiniQuestionMarkCircle } from 'react-icons/hi2';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';

// import { ColumnDef } from '@tanstack/react-table';
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from '@/components/ui/drawer';

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog';
// import { FiEdit3 } from 'react-icons/fi';
// import { AiOutlineDelete } from 'react-icons/ai';
// import { ArrowUpDown } from 'lucide-react';
// import { IoIosInformationCircle } from 'react-icons/io';
// import Toast from '@/app/components/Toast';
// import Loading from '@/app/reservation/loading';
// import { Badge } from '@/components/ui/badge';
// import { Label } from '@/components/ui/label';

// // TABLE CONFIG
// import {
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from '@tanstack/react-table';
// import Image from 'next/image';
// import React from 'react';
// import { getCurrentDate, getCurrentTime, getMaxDate, getMaxTime } from '@/utils/date';
// import { generateRandomString } from '@/utils/id';
// import TableReservations from '@/app/components/TableReservations';

// const Dashboard = () => {
//   const [isLoading, setIsLoading] = React.useState(false);

//   const [open, setOpen] = React.useState(false);
//   const [sorting, setSorting] = React.useState([]);
// const [columnFilters, setColumnFilters] = React.useState([]);
// const [columnVisibility, setColumnVisibility] = React.useState({});
// const [rowSelection, setRowSelection] = React.useState({});
// const [data, setData] = React.useState([]);

// const getAllDataIKUPNBPSatker = async () => {
//   setIsLoading(true);
//   try {
//     const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/reservations`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (response.status == 200) {
//       const jsonData = await response.data;
//       setData(jsonData);
//       console.log({ jsonData });
//       setIsLoading(false);
//     } else {
//       setIsLoading(false);
//       throw new Error('Failed to fetch data');
//     }
//   } catch (error) {
//     setIsLoading(false);
//     if (error.code == 'ERR_NETWORK') {
//       Toast.fire({
//         icon: 'error',
//         title: `Data tidak dapat ditampilkan. Koneksi anda terputus, cek jaringan anda!`,
//       });
//     } else {
//       Toast.fire({
//         icon: 'error',
//         title: `Internal server sedang error, coba lagi nanti!`,
//       });
//     }
//   }
// };

// const clearFormReservations = () => {
//   setNamaReservasi('');
//   setTanggalReservasi('');
//   setStartTimeReservasi('');
//   setEndTimeReservasi('');
//   setKontakReservasi('');
//   setIdReservasi(generateRandomString);
// };

// const createNewReservation = async (e) => {
//   e.preventDefault();

//   const data = {
//     Balai: balai,
//     Tanggal: tanggal,
//     Nilai: nilai,
//     Fungsional: fungsional,
//     Keterangan: keterangan,
//     LinkBuktiOmspan: linkBuktiOmspan,
//   };

//   console.log({ data });

//   setIsLoading(true);

//   try {
//     const response = await fetch(
//       `${baseUrl}/satminkal/Create-Iku-Pnbp-Satker`,
//       {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       },
//     );

//     if (!response.ok) {
//       setIsLoading(false);
//       console.error({ response });
//       throw new Error('Failed to send data to the endpoint');
//     }
//     console.log(response);
//     clearFormReservations();

//     Toast.fire({
//       icon: 'success',
//       title: `Berhasil menambahkan data pnbp satker!`,
//     });

//     console.log({ response });

//     setTimeout(() => {
//       getAllDataIKUPNBPSatker();
//       setIsLoading(false);
//     }, 2000);
//   } catch (error) {
//     setIsLoading(false);
//     console.error({ error });

//     Toast.fire({
//       icon: 'error',
//       title: `Gagal menambahkan data pnbp satker!`,
//     });
//   }
// };

// const [idReservasi, setIdReservasi] = React.useState(generateRandomString);


// const [namaReservasi, setNamaReservasi] = React.useState('');
// const [kontakReservasi, setKontakReservasi] = React.useState('');
// const [floorSelected, setFloorSelected] = React.useState('');
// const [tanggalReservasi, setTanggalReservasi] = React.useState('');
// const [startTimeReservasi, setStartTimeReservasi] = React.useState('');
// const [endTimeReservasi, setEndTimeReservasi] = React.useState('');
// const [totalTime, setTotalTime] = React.useState(null);
// const [currentDate, setCurrentDate] = React.useState(getCurrentDate);
// const [maxDate, setMaxDate] = React.useState(getMaxDate);
// const [currentTime, setCurrentTime] = React.useState(getCurrentTime);
// const [maxTime, setMaxTime] = React.useState(getMaxTime);

//   const [dataExcel, setDataExcel] = React.useState([]);
// const columns = [
//   {
//     accessorKey: 'reserve_id',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           className={`w-fit`}
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           No
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className={`text-center uppercase`}>{row.index + 1}</div>
//     ),
//   },
//   {
//     accessorKey: 'reserve_id',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           className={`flex w-full items-center justify-center`}
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           Action
//           <AiFillEdit className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className={`flex items-center justify-center gap-1`}>
//         <Drawer>
//           <DrawerTrigger>
//             <Button
//               variant="outline"
//               className="border-black border-opacity-5 bg-black bg-opacity-10 text-xs text-black"
//             >
//               <IoIosInformationCircle className="h-4 w-4" /> Info
//             </Button>
//           </DrawerTrigger>
//           <DrawerContent className="h-3/4">
//             <DrawerHeader>
//               <DrawerTitle>Are you absolutely sure?</DrawerTitle>
//               <DrawerDescription>
//                 This action cannot be undone.
//               </DrawerDescription>
//             </DrawerHeader>
//             <DrawerFooter>
//               <Button>Submit</Button>
//               <DrawerClose>
//                 <Button variant="outline">Cancel</Button>
//               </DrawerClose>
//             </DrawerFooter>
//           </DrawerContent>
//         </Drawer>

//         <Button
//           variant="outline"
//           className=" border border-horizonOrange-500 bg-horizonOrange-500 bg-opacity-10 text-xs  text-horizonOrange-500"
//         >
//           <FiEdit3 className="h-4 w-4" /> Edit
//         </Button>
//         <form action="" method="post">
//           <AlertDialog>
//             <AlertDialogTrigger asChild>
//               <Button
//                 variant="outline"
//                 className="ml-auto border border-horizonRed-500 bg-horizonRed-500 bg-opacity-10 text-xs text-horizonRed-500"
//               >
//                 <AiOutlineDelete className="h-4 w-4" /> Delete
//               </Button>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   This action cannot be undone. This will permanently delete
//                   your account and remove your data from our servers.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                 <AlertDialogAction>Continue</AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         </form>
//       </div>
//     ),
//   },
//   {
//     accessorKey: 'reserve_id',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           className={''}
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           ID Reservasi
//           <TbNumber className="ml-2 h-5 w-5" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className={`text-center capitalize`}>
//         {row.getValue('reserve_id')}
//       </div>
//     ),
//   },
//   {
//     accessorKey: 'status_reserve',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//           className="flex w-fit items-center justify-center"
//         >
//           Status
//           <br /> Pembayaran
//           <FaMoneyBillWaveAlt className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="flex w-full items-center justify-center text-center">
//         <Badge
//           className={`flex w-fit items-center gap-1 border bg-opacity-15 ${
//             row.getValue('status_reserve') == 'settlement'
//               ? 'border-horizonGreen-500 bg-horizonGreen-500 text-horizonGreen-600'
//               : row.getValue('status_reserve') == 'pending'
//               ? 'border-horizonOrange-500 bg-horizonOrange-500 text-horizonOrange-500'
//               : 'border-horizonRed-500 bg-horizonRed-500 text-horizonRed-500'
//           }`}
//         >
//           {' '}
//           {row.getValue('status_reserve') == 'settlement' && <MdPaid />}
//           {row.getValue('status_reserve') == 'pending' && (
//             <MdOutlineAccessTimeFilled />
//           )}
//           {row.getValue('status_reserve') != 'pending' &&
//             row.getValue('status_reserve') != 'settlement' && <TiTimes />}
//           {row.getValue('status_reserve') == 'settlement'
//             ? 'paid'
//             : row.getValue('status_reserve')}
//         </Badge>
//       </div>
//     ),
//   },
//   {
//     accessorKey: 'status_payment',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//           className="flex w-full items-center justify-center"
//         >
//           Status
//           <br /> Reservasi
//           <IoLogoGameControllerB className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="flex w-full items-center justify-center text-center">
//         <Badge
//           className={`flex w-fit items-center gap-1 border bg-opacity-15 ${
//             row.getValue('status_payment') == 'done'
//               ? 'border-blue-500 bg-blue-500 text-blue-600'
//               : row.getValue('status_payment') == 'not playing'
//               ? 'border-horizonPurple-400 bg-horizonPurple-500 text-horizonPurple-600'
//               : 'border-gray-500 bg-gray-500 text-gray-700'
//           }`}
//         >
//           {' '}
//           {row.getValue('status_payment') == 'playing' && (
//             <IoLogoGameControllerB />
//           )}
//           {row.getValue('status_payment') == 'done' && <MdOutlineDoneAll />}
//           {row.getValue('status_payment') != 'playing' &&
//             row.getValue('status_payment') != 'done' && (
//               <HiMiniQuestionMarkCircle />
//             )}
//           {row.getValue('status_payment') == 'settlement'
//             ? 'paid'
//             : row.getValue('status_payment')}
//         </Badge>
//       </div>
//     ),
//   },

//   {
//     accessorKey: 'reserve_name',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           Nama Customer
//           <FaCircleUser className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="text-center capitalize">
//         {row.getValue('reserve_name')}
//       </div>
//     ),
//   },
//   {
//     accessorKey: 'price',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//           className="w-full"
//         >
//           Harga
//           <FaRupiahSign className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="w-full text-center">
//         Rp {parseInt(row.getValue('price')).toLocaleString('id-ID')}
//       </div>
//     ),
//   },
//   {
//     accessorKey: 'reserve_contact',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           className="w-[150px] text-center "
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           Nomor Tlp
//           <HiPhone className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="w-[150px] text-center">
//         {row.getValue('reserve_contact')}
//       </div>
//     ),
//   },
//   {
//     accessorKey: 'location',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           Lantai Reservasi
//           <PiHouseSimpleFill className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="text-center">{row.getValue('location')}</div>
//     ),
//   },
//   {
//     accessorKey: 'position',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           Posisi
//           <TbNumber className="ml-2 h-6 w-6" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="text-center">{row.getValue('position')}</div>
//     ),
//   },
//   {
//     accessorKey: 'reserve_date',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//           className="w-full"
//         >
//           Tanggal Reservasi
//           <HiCalendar className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="w-full text-center">{row.getValue('reserve_date')}</div>
//     ),
//   },
//   {
//     accessorKey: 'reserve_start_time',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//           className="w-full"
//         >
//           Waktu Mulai
//           <BiSolidTime className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="w-full text-center ">
//         {row.getValue('reserve_start_time')} WIB
//       </div>
//     ),
//   },
//   {
//     accessorKey: 'reserve_end_time',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//           className="w-full"
//         >
//           Waktu Berakhir
//           <BiSolidTimeFive className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="w-2/3 text-center ">
//         {row.getValue('reserve_end_time')} WIB
//       </div>
//     ),
//   },
//   {
//     accessorKey: 'created_at',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           Created at
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="text-center uppercase">
//         {row.getValue('created_at').toString().slice(0, 11)}
//       </div>
//     ),
//   },
//   {
//     accessorKey: 'updated_at',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           Updated at
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="text-center uppercase">
//         {row.getValue('updated_at').toString().slice(0, 11)}
//       </div>
//     ),
//   },
// ];
// const table = useReactTable({
//   data,
//   columns,
//   onSortingChange: setSorting,
//   onColumnFiltersChange: setColumnFilters,
//   getCoreRowModel: getCoreRowModel(),
//   getPaginationRowModel: getPaginationRowModel(),
//   getSortedRowModel: getSortedRowModel(),
//   getFilteredRowModel: getFilteredRowModel(),
//   onColumnVisibilityChange: setColumnVisibility,
//   onRowSelectionChange: setRowSelection,
//   state: {
//     sorting,
//     columnFilters,
//     columnVisibility,
//     rowSelection,
//   },
// });


// React.useEffect(() => {
//   getAllDataIKUPNBPSatker();
// }, []);


//   return (
//     <body className="flex bg-gray-100 min-h-screen">
//       <aside className="hidden sm:flex sm:flex-col">
//         <a href="#" className="inline-flex items-center justify-center h-20 w-20 bg-orange hover:bg-orange-500 focus:bg-orange-500">
//           <Image alt='Ikuzo Playstation Logo' src={'/logo-white.png'} width={0} height={0} className='w-[100px]' />
//         </a>
//         <div className="flex-grow flex flex-col justify-between text-gray-500 bg-gray-200">
//           <nav className="flex flex-col mx-4 my-6 space-y-4">
//             <a href="#" className="inline-flex items-center justify-center py-3 hover:text-white hover:bg-orange focus:text-gray-400 focus:bg-gray-700 rounded-lg">
//               <span className="sr-only">Folders</span>
//               <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
//               </svg>
//             </a>
//             <a href="#" className="inline-flex items-center justify-center py-3 text-orange bg-white rounded-lg">
//               <span className="sr-only">Dashboard</span>
//               <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//               </svg>
//             </a>
//             <a href="#" className="inline-flex items-center justify-center py-3 hover:text-white hover:bg-orange focus:text-gray-400 focus:bg-gray-700 rounded-lg">
//               <span className="sr-only">Messages</span>
//               <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//               </svg>
//             </a>
//           </nav>
//         </div>
//       </aside>
//       <main className="w-full h-full bg-gray-100 px-4 py-8 sm:px-8 flex-none">

//       <div>
//         <Card extra="mt-6 p-5 text-base ml-[20%] overflow-scroll">
//           <h4 className="text-xl font-bold text-navy-700 dark:text-white">
//             Daftar Data Reservasi
//           </h4>
//           <div className="w-full">
//             <div className="flex items-center justify-between py-4">
//               <Input
//                 placeholder="Cari ID Reservasi..."
//                 value={
//                   (table.getColumn('Satminkal')?.getFilterValue()) ??
//                   ''
//                 }
//                 onChange={(event) =>
//                   table
//                     .getColumn('Satminkal')
//                     ?.setFilterValue(event.target.value)
//                 }
//                 className="max-w-sm"
//               />
//               <div className="flex gap-1">
//                 <AlertDialog open={open}>
//                   <AlertDialogTrigger asChild>
//                     <Button
//                       onClick={(e) => setOpen(true)}
//                       variant="outline"
//                       className="ml-auto"
//                     >
//                       Tambah Reservasi <IoMdAdd className="ml-2 h-4 w-4" />
//                     </Button>
//                   </AlertDialogTrigger>
//                   <AlertDialogContent>
//                     <AlertDialogHeader>
//                       <AlertDialogTitle className="text-center text-2xl">
//                         Reservasi Ikuzo Playstation!
//                       </AlertDialogTitle>
//                       <AlertDialogDescription className="text-center">
//                         Lakukan reservasi dan pembayaran melalui dashboard admin
//                         untuk pemesanan secara offline.
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <fieldset>
//                       <form
//                         onSubmit={createNewReservation}
//                         className="mt-3 flex w-full  flex-col gap-4"
//                       >
//                         <div className="grid w-full  items-center gap-1.5">
//                           <Label htmlFor="kanal_pemasaran">ID Reservasi</Label>
//                           <div className="flex-items-center flex justify-center gap-1">
//                             <Input
//                               type="number"
//                               id="pagu"
//                               className="w-full"
//                               placeholder={idReservasi}
//                               readOnly={true}
//                               value={idReservasi}
//                             />
//                           </div>
//                         </div>
//                         <div className="flex w-full  items-center gap-1.5">
//                           <div className="flex w-full flex-col gap-1">
//                             <Label htmlFor="kanal_pemasaran">
//                               Nama Reservasi
//                             </Label>
//                             <div className="flex-items-center flex justify-center gap-1">
//                               <Input
//                                 type="text"
//                                 id="pagu"
//                                 className="w-full"
//                                 placeholder="Nama..."
//                                 value={namaReservasi}
//                                 onChange={(e) =>
//                                   setNamaReservasi(e.target.value)
//                                 }
//                               />
//                             </div>
//                           </div>
//                           <div className="flex w-full flex-col gap-1">
//                             <Label htmlFor="kanal_pemasaran">
//                               Tanggal Reservasi
//                             </Label>
//                             <div className="flex-items-center flex justify-center gap-1">
//                               <Input
//                                 type="date"
//                                 id="pagu"
//                                 className="w-full"
//                                 placeholder="Anggaran (Rp)..."
//                                 value={tanggalReservasi}
//                                 onChange={(e) =>
//                                   setTanggalReservasi(e.target.value)
//                                 }
//                               />
//                             </div>
//                           </div>
//                         </div>
//                         <div className="5 flex w-full items-center gap-1">
//                           <div className="grid w-full  items-center gap-1.5">
//                             <Label htmlFor="kanal_pemasaran">
//                               Waktu Reservasi
//                             </Label>
//                             <div className="flex-items-center flex justify-center gap-1">
//                               <Input
//                                 type="time"
//                                 id="pagu"
//                                 className="w-full"
//                                 placeholder="Anggaran (Rp)..."
//                                 value={startTimeReservasi}
//                                 onChange={(e) =>
//                                   setStartTimeReservasi(e.target.value)
//                                 }
//                               />
//                               <Input
//                                 type="time"
//                                 id="realisasi"
//                                 className="w-full"
//                                 placeholder="Realisasi (Rp)..."
//                                 value={endTimeReservasi}
//                                 onChange={(e) =>
//                                   setEndTimeReservasi(e.target.value)
//                                 }
//                               />
//                             </div>
//                           </div>
//                           <div className="grid w-full  items-center gap-1.5">
//                             <Label htmlFor="kanal_pemasaran">
//                               Lokasi Reservasi
//                             </Label>
//                             <div className="flex-items-center flex justify-center gap-1">
//                               <Input
//                                 type="text"
//                                 id="pagu"
//                                 className="w-full"
//                                 placeholder="Lokasi..."
//                                 value={namaReservasi}
//                                 onChange={(e) =>
//                                   setNamaReservasi(e.target.value)
//                                 }
//                               />
//                             </div>
//                           </div>
//                         </div>

//                         <div className="grid w-full  items-center gap-1.5">
//                           <Label htmlFor="kanal_pemasaran">
//                             Nomor Telpon/Whatsapp
//                           </Label>
//                           <div className="flex-items-center flex justify-center gap-1">
//                             <Input
//                               type="number"
//                               id="pagu"
//                               className="w-full"
//                               placeholder="No Tlp/Whatsapp..."
//                               value={kontakReservasi}
//                               onChange={(e) =>
//                                 setKontakReservasi(e.target.value)
//                               }
//                             />
//                           </div>
//                         </div>
//                         <AlertDialogFooter>
//                           <Button
//                             onClick={() => {
//                               setOpen(false);
//                               setIdReservasi(generateRandomString);
//                             }}
//                             type="button"
//                             variant="outline"
//                           >
//                             Cancel
//                           </Button>
//                           <Button type="submit" variant="outline">
//                             Continue
//                           </Button>
//                         </AlertDialogFooter>
//                       </form>
//                     </fieldset>
//                   </AlertDialogContent>
//                 </AlertDialog>

//                 {/* <ExcelExport
//                   apiData={dataExcel}
//                   fileName={'IKU PNBP Satker Puslatluh'}
//                 /> */}
//               </div>
//             </div>

//             {isLoading ? (
//               <div className="flex h-[300px] w-full flex-col items-center justify-center py-20">
//                 <Loading />
//               </div>
//             ) : (
//               <TableReservations
//                 isLoading={isLoading}
//                 columns={columns}
//                 table={table}
//                 type={'short'}
//               />
//             )}

//             <div className="flex items-center justify-end space-x-2 py-4">
//               <div className="text-muted-foreground flex-1 text-sm">
//                 {table.getFilteredSelectedRowModel().rows.length} of{' '}
//                 {table.getFilteredRowModel().rows.length} row(s) selected.
//               </div>
//               <div className="space-x-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => table.previousPage()}
//                   disabled={!table.getCanPreviousPage()}
//                 >
//                   Previous
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => table.nextPage()}
//                   disabled={!table.getCanNextPage()}
//                 >
//                   Next
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </div>
//       </main>
//     </body>
//   );
// };

// export default Dashboard;
