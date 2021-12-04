import React, { useState } from 'react'
import Image from "next/image"
import { toast } from 'react-hot-toast'

import { Modal, Button } from 'react-bootstrap';
import { AiOutlineMail, AiOutlineKey, AiOutlineLogin } from 'react-icons/ai'
import { BiLogIn } from 'react-icons/bi'

import useTranslation from 'next-translate/useTranslation'
import { useUserData } from '../context/UserDataState';
import { createAPIEndpoint } from '../apiUtilis';

function Login({ show, handleCloseModal }) {
  
  const { t, i18n, lang} = useTranslation('common');
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
    if(view === 'SIGN_IN') {
      createAPIEndpoint('login', lang).create(formValues)
      .then(res => {
          // console.log('res dff from login', res);
          console.log('res dff from loginnnnnnn', res);
        if(res.data.status === true){
          console.log('res dff from loginnnnnnn status true', res);

          localStorage.setItem("isLogin", JSON.stringify(true));
          localStorage.setItem("userData", JSON.stringify(res.data.user))
          setUserData(res.data.user);
          toast.success(`${res.data.msg} 😄`)
        } else {
          toast.error(res.data.msg)
        }
      })
      .catch(err => {
        console.log('err from rgister', err);
      });
  
    } else {
      createAPIEndpoint('/register', lang).create(formValues)
      .then(res => {
        // toast.error('Please enter a password')
        console.log('res dff from registerrrrrr', res);
        if(res.data.status === true){
          localStorage.setItem("isLogin", JSON.stringify(true));
          localStorage.setItem("userData", JSON.stringify(res.data.token))
          setUserData(res.data.token)
        } else {
          toast.error(res.data.msg)
        }
      })
      .catch(err => {
          console.log('err from rgister', err);
      });
    }

    handleCloseModal()
    
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
