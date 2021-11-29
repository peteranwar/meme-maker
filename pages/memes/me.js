import React from 'react'
import useTranslation from 'next-translate/useTranslation'

import Link from 'next/link';
import Image from "next/image"
import { Button} from 'react-bootstrap';

const me = () => {
    const { t } = useTranslation('common')

    return (
        <div className="me-page ">
            <div className="container ">
                <div className="row justify-content-center ">
                    <div className="col-lg-7 col-md-9 col-11 d-flex flex-column align-items-center justify-content-center">
                        <div className="content text-center">
                            <div className="image-container">
                                <Image
                                    src="/assets/images/you-shall-not-pass.png"
                                    width="350px"
                                    height="200px"
                                    alt="you-shall-not-pass"
                                />
                                <h2 className="title">
                                    {t('me.not-pass.title')}
                                </h2>
                            </div>

                            <h5 className="subtitle mt-2 mb-3">
                            {t('me.not-pass.subtitle')}
                            </h5>

                            <Button  variant="primary" className="d-flex align-items-center justify-content-center mx-auto  my-2 px-3 border-0 pb-2 " >
                               <Link href="/">
                                <a className="pb-1"> {t('me.not-pass.link')} </a>
                               </Link>

                            </Button>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default me
