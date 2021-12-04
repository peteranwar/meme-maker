import React, { useState } from 'react'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import {Modal, Button} from 'react-bootstrap';

import Footer from './Footer'
import Navbar from './Navbar'
import LoginModal from '../Login'
import UserDataProvider from '../../context/UserDataState';

const index = ({ children }) => {
  const { t } = useTranslation()

  return (
    <>
      <Head>
        <title>{t('common:title')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar  />
      <main style={{marginTop: '90px', minHeight: "100vh"}}>
        {children}
      </main>
      <Footer />
    </>
  )
}

export default index
