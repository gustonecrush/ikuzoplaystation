'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Marquee from 'react-fast-marquee'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { FiUser } from 'react-icons/fi'
import getDocument from '@/firebase/firestore/getData'
import Toast from '@/app/components/Toast'

const NavbarMembership = () => {
  const [scrolled, setScrolled] = useState(false)
  const [marqueeContent, setMarqueeContent] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  async function fetchDataContents() {
    const dataContentMarquee = await getDocument('marquee-id', 'marquee-id-doc')
    setMarqueeContent(dataContentMarquee.data)
  }

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0
      setScrolled(isScrolled)
    }
    fetchDataContents()
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleLogout = async () => {
    try {
      Cookies.remove('XSRF_CUST')
      Toast.fire({
        icon: 'success',
        title: 'Berhasil logout',
      })
      setTimeout(() => {
        router.push('/membership/login')
      }, 800)
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: 'Gagal logout',
      })
      console.error(err)
    }
  }

  return (
    <>
      {marqueeContent == null ? (
        <></>
      ) : (
        <nav
          className={`flexBetween max-container z-[80] pt-1 font-montserrat flex flex-col ${
            scrolled ? 'bg-white text-black' : 'bg-transparent text-white'
          } fixed top-0 transition-all ease-in-out duration-1000 w-full`}
        >
          {/* MARQUEE TEXT */}
          <Marquee
            className={`py-2 -mt-2 ${
              scrolled
                ? 'text-black border-b border-b-primary'
                : 'text-white border-b border-b-white'
            }`}
          >
            {marqueeContent.data.map((text, index) => (
              <p key={index} className="text-base font-montserrat">
                {text}&nbsp;&nbsp;&nbsp;
              </p>
            ))}
          </Marquee>

          {/* NAV */}
          <div className="flex justify-between items-center px-3 relative w-full gap-5 my-3 md:my-5">
            <Link href="/">
              <Image
                src="/logo-orange.png"
                alt="Ikuzo Playstation's Logo"
                title="Ikuzo Playstation's Logo"
                width={0}
                height={0}
                className="w-[140px] md:w-[140px] md:hidden block"
              />
            </Link>

            {/* ✅ Collapsible User Menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`p-2 rounded-full backdrop-blur-md bg-white/20 border border-white/30 shadow-lg hover:bg-white/30 transition `}
              >
                <FiUser
                  className={`text-xl ${
                    scrolled ? '!text-orange' : 'text-white'
                  }`}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 flex flex-col gap-2 w-48 p-3 rounded-2xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-lg animate-fadeIn">
                  <button
                    onClick={() => router.push('/membership/dashboard/profile')}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition"
                  >
                    Edit Profil
                  </button>
                  <button
                    onClick={() =>
                      router.push(
                        '/membership/dashboard/profile/reset-password',
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl bg-red-500/20 text-red-200 text-sm hover:bg-red-500/30 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}
    </>
  )
}

export default NavbarMembership
