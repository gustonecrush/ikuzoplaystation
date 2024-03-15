'use client'

import Toast from '@/app/components/Toast'
import axios from 'axios'
import Image from 'next/image'
import React from 'react'
import { redirect, useRouter } from 'next/navigation'

function Login() {
  const router = useRouter()

  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    setIsLoading(true)

    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/login`
      const data = {
        username,
        password,
      }
      console.log({ data })
      const response = await axios.post(url, data)

      if (response.status === 200) {
        console.log({ response })
        localStorage.setItem('token', response.data.token)
        Toast.fire({
          icon: 'success',
          title: `Selamat datang kembali ke dashboard Ikuzo!`,
        })

        setTimeout(() => {
          router.replace('/admin/dashboard/reservations')
        }, 2000)
      } else {
        console.error({ response })
        setIsLoading(false)
        Toast.fire({
          icon: 'error',
          title: `Gagal login, periksa kembali username dan password!`,
        })
      }
    } catch (error) {
      console.error({ error })
      Toast.fire({
        icon: 'error',
        title: `Gagal login, periksa kembali username dan password!`,
      })
      setIsLoading(false)
    }
  }

  return (
    <div class="mx-auto max-w-screen-xl px-4 py-16 mt-10 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-lg text-center">
        <Image
          src={'/logo-orange.png'}
          width={0}
          height={0}
          className="w-[450px] mx-auto"
        />

        <p class="text-gray-500 font-plusSansJakarta -mt-6">
          Silahkan login sebagai admin untuk melakukan reservasi ditempat dan
          memanajemen konten website.
        </p>
      </div>

      <form
        action="#"
        onSubmit={handleLogin}
        class="mx-auto mb-0 max-w-md space-y-4 mt-3"
      >
        <div>
          <label for="email" class="sr-only">
            Username
          </label>

          <div class="relative">
            <input
              type="text"
              class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <span class="absolute inset-y-0 end-0 grid place-content-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <label for="password" class="sr-only">
            Password
          </label>

          <div class="relative">
            <input
              type="password"
              class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span class="absolute inset-y-0 end-0 grid place-content-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="inline-block rounded-lg bg-orange px-5 py-3 text-sm font-medium text-white"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
