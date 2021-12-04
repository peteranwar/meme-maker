import 'tailwindcss/tailwind.css'
import '../styles/main.scss'
import 'bootstrap/dist/css/bootstrap.min.css'

import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

import { Toaster, toast } from 'react-hot-toast'
import * as Portal from '@radix-ui/react-portal'
import { IdProvider } from '@radix-ui/react-id'

import { SSRProvider } from '@react-aria/ssr';

// import { UserDataProvider } from '../context/UserDataState'
const UserDataProvider= dynamic(
  () => import('../context/UserDataState'),
  { ssr: false, loading: () => <p>Loading...</p>, }
  
)

function MyApp({ Component, pageProps }) {
  const router = useRouter()


  useEffect(() => {
    let dir = router.locale === "en" ? "ltr" : "rtl";
    document.querySelector("html").setAttribute("dir", dir);
    document.querySelector("html").setAttribute("lang", router.locale);
    // localStorage.setItem("language", JSON.stringify(router.query.locale))
  }, [router.locale])


  return (
    <SSRProvider >
      <UserDataProvider >
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Portal.Root className="portal--toast">
          <Toaster
            toastOptions={{
              className:
                'dark:bg-bg-primary-dark dark:text-typography-body-strong-dark border border-gray-500',
              style: {
                padding: '8px',
                paddingLeft: '16px',
                paddingRight: '16px',
                fontSize: '0.875rem',
              },
            }}
          />
        </Portal.Root>
      </UserDataProvider>
    </SSRProvider>

  )
}

export default MyApp
