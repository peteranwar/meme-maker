import 'tailwindcss/tailwind.css'
import '../styles/main.scss'
import 'bootstrap/dist/css/bootstrap.min.css'

import Layout from '../components/Layout'
import { useRouter } from 'next/router'

import React, { useEffect, useState } from 'react'



function MyApp({ Component, pageProps }) {
    const router = useRouter()


    useEffect(() => {
      let dir = router.locale === "en" ? "ltr" : "rtl";
      document.querySelector("html").setAttribute("dir", dir);
      document.querySelector("html").setAttribute("lang", router.locale);
      // localStorage.setItem("language", JSON.stringify(router.query.locale))
    }, [router.locale])
  
    
    return (
      <Layout>
        <div >
          <Component {...pageProps}   />
        </div>
      </Layout>
    )
  }
  
  export default MyApp
  