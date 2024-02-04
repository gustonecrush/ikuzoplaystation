import { Button } from '@/components/ui/button';
import React from 'react';

const Invoice = () => {
  return (
    <section class="bg-black">
 <div class="max-w-5xl mx-auto pt-16 bg-white">
  <article class="overflow-hidden">
   <div class="bg-[white] rounded-b-md">
    <div class="px-9">
     <div class="space-y-2 text-slate-700">
      <img class="object-cover h-20" src="/logo-orange.png" />

      <p class="text-xl font-extrabold text-black tracking-tight uppercase font-body">
       #PLAYIKUZO987239499872
      </p>
     </div>
    </div>
    <div class="px-9 mt-7">
     <div class="flex w-full">
      <div class="flex flex-col gap-3">
       <div class="text-sm font-light text-slate-500">
        <p class="text-sm font-normal text-slate-700">
         Invoice Detail:
        </p>
        <p>Unwrapped</p>
       </div>
       <div class="text-sm font-light text-slate-500">
        <p class="text-sm font-normal text-slate-700">Billed To</p>
        <p>The Boring Company</p>
       </div>
       <div class="text-sm font-light text-slate-500">
        <p class="text-sm font-normal text-slate-700">Invoice Number</p>
        <p>000000</p>
       </div>
       <div class="text-sm font-light text-slate-500">
        <p class="text-sm font-normal text-slate-700">Terms</p>
        <p>0 Days</p>
       </div>
      </div>
     </div>
    </div>

    <div class="px-9">
     <div class="flex flex-col mx-0 mt-8">
      <table class="min-w-full divide-y divide-slate-500">
       <thead>
        <tr>
         <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-normal text-slate-700 sm:pl-6 md:pl-0">
          Description
         </th>
         <th scope="col" class="hidden py-3.5 px-3 text-right text-sm font-normal text-slate-700 sm:table-cell">
          Quantity
         </th>
         <th scope="col" class="hidden py-3.5 px-3 text-right text-sm font-normal text-slate-700 sm:table-cell">
          Rate
         </th>
         <th scope="col" class="py-3.5 pl-3 pr-4 text-right text-sm font-normal text-slate-700 sm:pr-6 md:pr-0">
          Amount
         </th>
        </tr>
       </thead>
       <tbody>
        <tr class="border-b border-slate-200">
         <td class="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
          <div class="font-medium text-slate-700">Tesla Truck</div>
          <div class="mt-0.5 text-slate-500 sm:hidden">
           1 unit at IDR 50000
          </div>
         </td>
         <td class="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
          48
         </td>
         <td class="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
          IDR 50000
         </td>
         <td class="py-4 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
          IDR 50000
         </td>
        </tr>
       </tbody>
       <tfoot>
        <tr>
         <th scope="row" colspan="3" class="hidden pt-6 pl-6 pr-3 text-sm font-light text-right text-slate-500 sm:table-cell md:pl-0">
          Subtotal
         </th>
         <th scope="row" class="pt-6 pl-4 pr-3 text-sm font-light text-left text-slate-500 sm:hidden">
          Subtotal
         </th>
         <td class="pt-6 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
          IDR 50000
         </td>
        </tr>
        <tr>
         <th scope="row" colspan="3" class="hidden pt-6 pl-6 pr-3 text-sm font-light text-right text-slate-500 sm:table-cell md:pl-0">
          Discount
         </th>
         <th scope="row" class="pt-6 pl-4 pr-3 text-sm font-light text-left text-slate-500 sm:hidden">
          Discount
         </th>
         <td class="pt-6 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
          IDR 50000
         </td>
        </tr>
        <tr>
         <th scope="row" colspan="3" class="hidden pt-4 pl-6 pr-3 text-sm font-light text-right text-slate-500 sm:table-cell md:pl-0">
          Tax
         </th>
         <th scope="row" class="pt-4 pl-4 pr-3 text-sm font-light text-left text-slate-500 sm:hidden">
          Tax
         </th>
         <td class="pt-4 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
          IDR 50000
         </td>
        </tr>
        <tr>
         <th scope="row" colspan="3" class="hidden pt-4 pl-6 pr-3 text-sm font-normal text-right text-slate-700 sm:table-cell md:pl-0">
          Total
         </th>
         <th scope="row" class="pt-4 pl-4 pr-3 text-sm font-normal text-left text-slate-700 sm:hidden">
          Total
         </th>
         <td class="pt-4 pl-3 pr-4 text-sm font-normal text-right text-slate-700 sm:pr-6 md:pr-0">
          IDR 50000
         </td>
        </tr>
       </tfoot>
      </table>
     </div>
    </div>

    <div class="mt-2 p-9">
     <div class="border-t pt-9 border-slate-200">
      <div class="text-sm font-light text-slate-700">
       <p>
        Payment terms are 14 days. Please be aware that according to the
        Late Payment of Unwrapped Debts Act 0000, freelancers are
        entitled to claim a 00.00 late fee upon non-payment of debts
        after this time, at which point a new invoice will be submitted
        with the addition of this fee. If payment of the revised invoice
        is not received within a further 14 days, additional interest
        will be charged to the overdue account and a statutory rate of
        8% plus Bank of England base of 0.5%, totalling 8.5%. Parties
        cannot contract out of the Act’s provisions.
       </p>
      </div>
     </div>
    </div>
    
    <div className='px-9'>
    <Button className="bg-orange rounded-lg px-5 mt-2 py-6 text-sm font-jakarta hover:bg-orange w-full">
          Download
        </Button>
    </div>
    
   </div>
  </article>
 </div>
</section>
  );
}

export default Invoice;
