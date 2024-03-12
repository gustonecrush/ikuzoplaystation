'use client';

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
import { Button } from '@/components/ui/button';
import { FiEdit3 } from 'react-icons/fi';
import { AiOutlineDelete } from 'react-icons/ai';
import { ArrowUpDown } from 'lucide-react';
import { IoIosInformationCircle } from 'react-icons/io';
import { Badge } from '@/components/ui/badge';

import { MdAccountBalance } from 'react-icons/md';

export const columns = [
  {
    accessorKey: 'IdPnbpSatker',
    header: 'Action',
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <Drawer>
          <DrawerTrigger>
            <Button variant="outline" className="">
              <IoIosInformationCircle className="h-4 w-4" />
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
          onClick={(e) => handleUpdate(row.getValue('IdPnbpSatker'))}
          variant="outline"
          className=" border border-yellow-500 bg-white text-yellow-500 hover:bg-yellow-500 hover:text-white"
        >
          <FiEdit3 className="h-4 w-4" />
        </Button>
        <form action="" method="post">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto border border-red-600 bg-white text-red-600 hover:bg-red-600 hover:text-white"
              >
                <AiOutlineDelete className="h-4 w-4" />
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
                  onClick={(e) => handleDelete(row.getValue('IdPnbpSatker'))}
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
    accessorKey: 'verified_by',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Verified By
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex flex-wrap items-center justify-center gap-1">
        <Badge className="flex items-center gap-1 border border-blue-400 px-2 py-1 text-black">
          <MdAccountBalance />
          Pusat
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'Satminkal',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Balai
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center uppercase">{row.getValue('Satminkal')}</div>
    ),
  },
  {
    accessorKey: 'Tanggal',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tanggal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center uppercase">{row.getValue('Tanggal')}</div>
    ),
  },
  {
    accessorKey: 'Nilai',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nilai
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center uppercase">Rp {row.getValue('Nilai')}</div>
    ),
  },
  {
    accessorKey: 'Fungsional',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fungsional/Umum
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center uppercase">{row.getValue('Fungsional')}</div>
    ),
  },
  {
    accessorKey: 'Keterangan',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Keterangan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center uppercase">{row.getValue('Keterangan')}</div>
    ),
  },
];
