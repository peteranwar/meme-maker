import Link from 'next/link';
import Image from "next/image"

import React, { useEffect, useRef, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { Button, Dropdown, Spinner, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { GrLanguage } from 'react-icons/gr';
import { MdOutlineNightlight, MdOutlineLightMode } from 'react-icons/md';



import { useRouter } from 'next/router';
import Login from '../Login';



const Navbar = ({ }) => {

    const router = useRouter();
    const [colorChange, setColorchange] = useState(false);
    const [openNav, setOpenNav] = useState(false);

    const [toggleMode, setToggleMode] = useState();

    const [showModal, setShowModal] = useState(false);


    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const { t, i18n } = useTranslation('common')
    const changeNavbarColorAndToggleToTopBtn = () => {
        if (window.scrollY >= 80) {
            setColorchange(true);
        }
        else {
            setColorchange(false);
        }
    };


    useEffect(() => {
        window.addEventListener('scroll', changeNavbarColorAndToggleToTopBtn);
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setToggleMode(localStorage.getItem("mode") || 'light');
            console.log('locaaaaaaaal', toggleMode)
        }
    }, [])

    useEffect(() => {
        toggleMode === "dark" ? document.querySelector("body").className = "dark-mode" :
        document.querySelector("body").classList.remove("dark-mode") ;
    }, [toggleMode])

    const headerClasses = () => {
        return (
            `navContainer ${colorChange ? 'navScroll' : ''}`
        )
    }


    function handleToggleMode() {
        if (toggleMode === 'light') {
            setToggleMode('dark');
            typeof window !== "undefined" ? localStorage.setItem("mode", 'dark') : null
        } else {
            setToggleMode('light');
            typeof window !== "undefined" ? localStorage.setItem("mode", 'light') : null
        }
    }



    function handleLogout() {
        // console.log(isLogin);
        localStorage.removeItem('isLogin');
        localStorage.removeItem('userData');
        setUserData(null)
        router.push('/login')
    }

    return (
        <>
            <nav className={headerClasses()}>
                <div className={`menuBtn ${openNav ? 'closeMenu' : ''}`} onClick={() => setOpenNav(!openNav)} >
                    <div className="btnLine"></div>
                    <div className="btnLine"></div>
                    <div className="btnLine"></div>
                </div>
                <div className="logo">
                    <Link href="/" >
                        <a>
                            <Image
                                src="/assets/images/logo.svg"
                                width="150px"
                                height="50px"
                                alt="meme-maker-logo"
                            />
                        </a>
                    </Link>

                </div>
                <div className='navContent '>
                    <div className={`linksContainer justify-content-center justify-content-md-end  d-flex align-items-center ${openNav ? "open-nav" : ''}`}>
                        <div className="d-flex align-items-center justify-content-between flex-column flex-md-row">
                            <Dropdown className="mx-2 my-2">
                                <Dropdown.Toggle className="secondary-btn d-flex align-items-center" id="dropdown-basic">
                                    <span className="mx-2  pb-1"> {t('navbar.browse-memes')}</span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item >
                                        <Link href="/memes/me">
                                            <a>{t('navbar.your-memes')}</a>
                                        </Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item >
                                        <Link href="/memes/community">
                                            <a>{t('navbar.community-memes')}</a>
                                        </Link>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            <Button onClick={handleShowModal} variant="primary" className="d-flex align-items-center  my-2 px-3 border-0 pb-2 mx-2" >
                               {t('navbar.login')} 
                            </Button>

                            <div className={`change-lang mx-2 pb-2 d-flex justify-content-end align-items-center  flex-column flex-md-row  ${openNav ? "open-nav" : ''}`} >
                                <div className="lang d-flex align-items-center my-1">
                                    {router.locale === 'ar' ?
                                        <Link href={router.asPath} locale="en">
                                            <a className="d-flex align-items-center">English <GrLanguage className="mx-1 mt-1" /></a>
                                        </Link>
                                        : <Link href={router.asPath} locale="ar">
                                            <a className="d-flex align-items-center">عربي <GrLanguage className="mx-1 mt-1"  /></a>
                                        </Link>
                                    }
                                </div>
                            </div>
                            <OverlayTrigger
                                placement="bottom"
                                overlay={
                                    <Tooltip id='tooltip-bottom'>
                                        {toggleMode === 'light' ? 'Turn off the light' : 'Turn on the light'}
                                    </Tooltip>
                                }
                            >
                                <div className="mode-container mx-2 " onClick={handleToggleMode}>
                                    {toggleMode === 'light' ? <MdOutlineNightlight size="1.5em" /> : <MdOutlineLightMode size="1.5em" />}
                                </div>
                            </OverlayTrigger>

                        </div>

                    </div>
                </div>
            </nav>
            {/* Modal Login */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Body>
                    {<Login handleCloseModal={handleCloseModal} />}
                </Modal.Body>
            </Modal>

        </>
    )
}

export default Navbar
