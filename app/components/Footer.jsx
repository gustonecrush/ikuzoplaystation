import Image from 'next/image'
import Link from 'next/link'
import { FaInstagram, FaTiktok, FaWhatsapp, FaYoutube } from 'react-icons/fa6'

export const Footer = () => {
  const socials = [
    {
      id: 1,
      link: 'https://www.instagram.com/ikuzoplaystation/',
      component: <FaInstagram />,
    },
    {
      id: 2,
      link: 'https://www.youtube.com/@ikuzoplaystation',
      component: <FaYoutube />,
    },

    {
      id: 3,
      link: 'https://www.tiktok.com/@ikuzoplaystation',
      component: <FaTiktok />,
    },
    {
      id: 4,
      link: 'https://api.whatsapp.com/send?phone=6288971851615',
      component: <FaWhatsapp />,
    },
  ]
  return (
    <div className="px-4 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 pt-8 bg-orange rounded-t-xl">
      <div className="grid gap-10 row-gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <a
            href="/"
            aria-label="Go home"
            title="Company"
            className="inline-flex items-center"
          >
            <Image
              src="/logo-white.png"
              alt="logo"
              width={0}
              height={0}
              className="w-[160px] -ml-2 md:w-[140px] md:h-[80px]"
            />
          </a>
          <div className="lg:max-w-sm">
            <p className="text-base text-white">
              Rasakan dan sebarkan pengalaman yang tak terlupakan dengan bermain
              bersama keluarga, kerabat, atau bahkan pasanganmu!
            </p>
          </div>
        </div>
        <div>
          <span className="text-base font-bold tracking-wide text-white">
            Social
          </span>
          <div className="flex items-center mt-1 space-x-5">
            {socials.map((social, index) => (
              <Link
                target="_blank"
                key={index}
                href={social.link}
                className="text-white text-3xl transition-colors duration-300 hover:text-deep-purple-accent-400"
              >
                {social.component}
              </Link>
            ))}
          </div>
          <p className="mt-4 text-base text-white">
            Jl. Kosar No.Kav.9, Pasir Endah, Kec. Ujung Berung, Kota Bandung,
            Jawa Barat 40615
          </p>
        </div>
      </div>
      <div className="flex flex-col-reverse justify-between pt-5 pb-10 border-t lg:flex-row">
        <p className="text-base text-white">
          © Copyright 2024 Ikuzo Playstation. All rights reserved.
        </p>
      </div>
    </div>
  )
}
