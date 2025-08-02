'use client'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import { Users, UserPlus, Gift, Cake, Globe2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const stats = [
  {
    id: 'new_leads',
    label: 'Leads Baru',
    value: 142,
    icon: <UserPlus className="w-6 h-6 text-white" />,
  },
  {
    id: 'converted',
    label: 'Leads Member',
    value: 87,
    icon: <Users className="w-6 h-6 text-white" />,
  },
  {
    id: 'claim_activity',
    label: 'Aktivitas Klaim',
    value: 56,
    icon: <Gift className="w-6 h-6 text-white" />,
  },
  {
    id: 'birthday_treat',
    label: 'Birthday Treat',
    value: 18,
    icon: <Cake className="w-6 h-6 text-white" />,
  },
  {
    id: 'lead_origin',
    label: 'Asal Leads',
    value: 5,
    icon: <Globe2 className="w-6 h-6 text-white" />,
  },
]

const chartData = [
  { name: 'Instagram', value: 22 },
  { name: 'Website', value: 18 },
  { name: 'Referral', value: 15 },
  { name: 'Offline', value: 10 },
  { name: 'Other', value: 5 },
]

export default function MembershipWeeklyReports() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  const handleClick = (id) => {
    if (id === 'lead_origin') {
      setOpen(true)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 w-full">
        {stats.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              handleClick(item.id)
              setSelected(item.id)
            }}
            className={cn(
              'group flex flex-row justify-center items-center py-5 rounded-2xl shadow-md bg-white hover:scale-[1.02] gap-2 duration-300 cursor-pointer border transition-all',
              selected === item.id
                ? 'border-orange bg-orange/5'
                : 'border-muted',
            )}
          >
            <div className="flex items-center justify-center rounded-full bg-orange p-3">
              {item.icon}
            </div>
            <div className="flex flex-col gap-0">
              <h4 className="text-sm text-muted-foreground">{item.label}</h4>
              <p className="text-2xl font-semibold text-orange group-hover:text-orange">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog for Asal Leads */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-2xl rounded-2xl shadow-xl border border-muted-foreground/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-semibold leading-none text-orange-600">
              Asal Leads
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-none text-muted-foreground">
              Sumber awareness dari peserta dalam bentuk visual grafik.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="w-full h-[300px] mt-4 rounded-lg bg-muted/30 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0px 4px 10px rgba(0,0,0,0.05)',
                  }}
                />
                <Bar dataKey="value" fill="#f97316" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors w-full">
              Tutup
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
