'use client'

import { useState } from 'react'
import axios from 'axios'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import parse from 'html-react-parser'
import { apiBaseUrl } from '@/utils/urls'

export default function MembershipCheck() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [result, setResult] = useState(null)
  const [succes, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCheck = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`${apiBaseUrl}/membership/check`, {
        phone_number: phoneNumber,
      })
      setResult(res.data)
      setLoading(false)
      setSuccess(true)
      setDialogOpen(true)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || 'Unknown error'
        setResult({ message })
        setLoading(false)
        setSuccess(false)
        setDialogOpen(true)
      } else {
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter phone number..."
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="max-w-sm"
          disabled={loading}
        />
        <Button
          onClick={handleCheck}
          className="bg-orange hover:bg-orange"
          disabled={!phoneNumber || loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Checking...
            </div>
          ) : (
            'Check Membership'
          )}
        </Button>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <div className="hidden" />
        </AlertDialogTrigger>

        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              {result?.customer
                ? `${result.membership_tier?.icon ?? '🎮'} ${
                    result.customer.full_name
                  }`
                : 'Membership Info'}
            </AlertDialogTitle>

            <AlertDialogDescription className="mt-2">
              {result?.message && result?.customer && (
                <p className="mb-4 text-sm text-muted-foreground">
                  {result.message}
                </p>
              )}

              {result?.customer ? (
                <div className="overflow-x-auto rounded border border-muted p-1">
                  <table className="w-full text-sm">
                    <tbody className="[&_tr:last-child]:border-0">
                      <tr className="border-b border-muted">
                        <td className="font-medium py-2 pr-4 w-48">Phone</td>
                        <td>{result.customer.phone_number}</td>
                      </tr>
                      <tr className="border-b border-muted">
                        <td className="font-medium py-2 pr-4">Tier</td>
                        <td>
                          <Badge>{result.membership_tier.tier_name}</Badge>
                        </td>
                      </tr>
                      <tr className="border-b border-muted">
                        <td className="font-medium py-2 pr-4">Status Tier</td>
                        <td>
                          <Badge
                            variant="outline"
                            className={
                              result.membership.status_tier === 'Active'
                                ? 'border-green-500 text-green-600'
                                : 'border-red-500 text-red-500'
                            }
                          >
                            {result.membership.status_tier}
                          </Badge>
                        </td>
                      </tr>
                      <tr className="border-b border-muted">
                        <td className="font-medium py-2 pr-4">Start</td>
                        <td>
                          {format(
                            new Date(result.membership.start_periode),
                            'PPP',
                          )}
                        </td>
                      </tr>
                      <tr className="border-b border-muted">
                        <td className="font-medium py-2 pr-4">End</td>
                        <td>
                          {format(
                            new Date(result.membership.end_periode),
                            'PPP',
                          )}
                        </td>
                      </tr>
                      <tr className="border-b border-muted">
                        <td className="font-medium py-2 pr-4">Kuota Weekly</td>
                        <td>{result.membership.kuota_weekly}</td>
                      </tr>
                      <tr className="border-b border-muted">
                        <td className="font-medium py-2 pr-4">
                          Membership Count
                        </td>
                        <td>{result.membership.membership_count}</td>
                      </tr>
                      <tr className="border-b border-muted">
                        <td className="font-medium py-2 pr-4">
                          Status Payment
                        </td>
                        <td>
                          <Badge
                            variant="outline"
                            className={
                              result.membership.status_payment === 'settlement'
                                ? 'border-green-500 text-green-600'
                                : 'border-yellow-500 text-yellow-500'
                            }
                          >
                            {result.membership.status_payment}
                          </Badge>
                        </td>
                      </tr>
                      <tr className="border-b border-muted">
                        <td className="font-medium py-2 pr-4">
                          Status Benefit
                        </td>
                        <td>{result.membership.status_benefit}</td>
                      </tr>
                      <tr className="border-b border-muted">
                        <td className="font-medium py-2 pr-4">
                          Birthday Treat
                        </td>
                        <td>{result.membership.status_birthday_treat}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="font-medium py-2 pr-4">Benefits</td>
                        <td>
                          <div className="prose prose-sm max-w-none leading-snug">
                            {parse(result.membership_tier.benefits || '')}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {result?.message || 'No data'}
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
