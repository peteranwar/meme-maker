import React, { useState } from 'react'
import Image from "next/image"

import { Modal, Button } from 'react-bootstrap';
import { AiOutlineMail, AiOutlineKey, AiOutlineLogin } from 'react-icons/ai'
import { BiLogIn } from 'react-icons/bi'

import useTranslation from 'next-translate/useTranslation'
import { useUserData } from '../context/UserDataState';

function Login({ show, handleCloseModal }) {
  
  const { t, i18n } = useTranslation('common');
  const [view, setView] = useState('SIGN_IN')
  const [formValues, setFormValues] = useState({ email: '', password: '' })
  
  const [userData, setUserData] = useUserData();

  const toggleView = () => {
    if (view === 'SIGN_IN') {
      return setView('SIGN_UP')
    }
    return setView('SIGN_IN')
  }

  function handleLoginSubmit(e) {
    e.preventDefault();

    setUserData(formValues);
    handleCloseModal()
    
    console.log('fff', formValues)
  }

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }


  return (
    <div className="container" >
      <div className="row justify-content-center">
        <div className="col-lg-6 my-2 ">
          <h2 className="title mb-3">{t('login.title')}</h2>
          <h5>{t('login.subtitle')}</h5>
          <ul>
            <li> 💾 {t('login.text1')}</li>
            <li> 💕 {t('login.text2')}</li>
            <li> 🏆 {t('login.text3')}</li>
          </ul>
          <div className="images">
            <Image
              src="/assets/images/me-and-the-boys.png"
              width="220px"
              height="100px"
              alt="me-and-the-boys"
            />
            <Image
              src="/assets/images/popcat.gif"
              width="110px"
              height="120px"
              alt="popcat"
              className="rounded-top"
            />

          </div>
        </div>
        <div className="col-lg-6 my-2">
          <form onSubmit={handleLoginSubmit}>
            <div className="input-container mb-4">
              <h5 className="mb-2">{t('login.email')}</h5>
              <div className="input">
                <label htmlFor="email"> <AiOutlineMail size="1.3em" color="#707070" />  </label>
                <input
                  name="email"
                  value={formValues.email}
                  onChange={(e) => handleChange(e)}
                  className="py-1 w-100" autoComplete="off" type="email" id="email" required />
              </div>
            </div>
            <div className="input-container mb-4">
              <h5 className="mb-2">{t('login.password')}</h5>
              <div className="input">
                <label htmlFor="password"> <AiOutlineKey size="1.3em" color="#707070" />  </label>
                <input
                  name="password"
                  value={formValues.password}
                  onChange={(e) => handleChange(e)}
                  className="py-1 w-100" autoComplete="off" type="password" id="password" required />
              </div>
            </div>
            <Button variant="primary" type="submit" className="w-100  d-flex align-items-center justify-content-center  mt-2 mb-3 px-3 border-0 " >
              <span className="pb-1">{view === 'SIGN_IN' ? t('login.signin') : t('login.signup')}</span>  <BiLogIn className="mx-2" size="1.4em" />
            </Button>
            <div onClick={toggleView} className="text-center my-2 have-account">
              {view === 'SIGN_IN' ? t('login.not-have') : t('login.have')}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
