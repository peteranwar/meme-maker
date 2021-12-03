import 'tailwindcss/tailwind.css'
import '../styles/main.scss'
import 'bootstrap/dist/css/bootstrap.min.css'

import Layout from '../components/Layout'
import { useRouter } from 'next/router'

import React, { useEffect, useState } from 'react'

import { UserDataProvider } from '../context/UserDataState'

function MyApp({ Component, pageProps }) {
  const router = useRouter()


  useEffect(() => {
    let dir = router.locale === "en" ? "ltr" : "rtl";
    document.querySelector("html").setAttribute("dir", dir);
    document.querySelector("html").setAttribute("lang", router.locale);
    // localStorage.setItem("language", JSON.stringify(router.query.locale))
  }, [router.locale])


  return (
    <UserDataProvider >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserDataProvider>
  )
}

export default MyApp
