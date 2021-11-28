import 'tailwindcss/tailwind.css'
import '../styles/globals.css'

import { useRouter } from 'next/router'

import React, { useEffect, useState } from 'react'



function MyApp({ Component, pageProps }) {
    const router = useRouter()
    return (
      <>
        <div className="bg-gray-800 relative">
          <Component {...pageProps}   />
        </div>
      </>
    )
  }
  
  export default MyApp
  