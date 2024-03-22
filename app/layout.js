import './globals.css'

import { Montserrat, Plus_Jakarta_Sans } from 'next/font/google'

const inter = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plusJakartaSans',
})
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export const metadata = {
  title: 'Ikuzo Playstation!',
  description:
    'Discover the unforgettable gaming experience with your family, friends, or as a couple. Feel it and tell the world how excited it was!',
  viewport:
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, shrink-to-fit=no',
  icons: ['/logo-orange.png'],
  keywords: [
    'PlayStation',
    'Ikuzo Playstation',
    'Reservation',
    'Rental PlayStation',
    'Rental PS',
    'Bandung',
    'Rental PS di Bandung',
    'Ikuzoplaystation',
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${montserrat.variable}`}>
        {children}
      </body>
    </html>
  )
}
