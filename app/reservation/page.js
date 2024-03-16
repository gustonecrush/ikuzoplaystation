import { Video } from '../components/Home'
import Reservation from './Reservations'

import { Plus_Jakarta_Sans } from 'next/font/google'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plusJakartaSans',
})

export const metadata = {
  title: 'Reservations - Ikuzo Playstation!',
  description:
    'Reservasi segera dengan pilihan layanan yang ada dan nikmati keseruan bermain bersama Ikuzo Playstation!',
  viewport:
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, shrink-to-fit=no',
  icons: ['/logo-orange.png'],
}

export default function Page() {
  return (
    <section
      className={`${plusJakartaSans.className} flex flex-col h-full w-full scroll-smooth overflow-x-hidden`}
    >
      <Video extra="!h-[1000px]" />
      <Reservation />
    </section>
  )
}
