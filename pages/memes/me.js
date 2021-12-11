import React, { useState, useEffect } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { IconLoader } from '@supabase/ui'
import { toast } from 'react-hot-toast'

import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from "next/image"
import { AiTwotoneDelete } from 'react-icons/ai'
import { Button, Container } from 'react-bootstrap';
import { createAPIEndpoint } from '../../apiUtilis';
import { useUserData } from '../../context/UserDataState';
import Masonry from 'react-masonry-css'
import ModalImage from "react-modal-image";


const me = (props) => {
    const { t } = useTranslation('common');
    const [userData] = useUserData();
    const router = useRouter()
    const [images, setImages] = useState();
    const [loading, setLoading] = useState(true)



    useEffect(() => {
        if (userData?.token) {
            const getImages = async () => {
                await createAPIEndpoint(`images/${userData?.id}`, router.locale, userData?.token).fetchAll()
                    .then(res => {
                        setImages(res.data.image);
                        setLoading(false)
                    })
                    .catch(err => {
                        console.log(err);
                        setLoading(false)

                    })
            }
            getImages()
        } else {
                setLoading(false)

        }
      

    }, [userData])

    async function handleDeleteImage(id) {
        await createAPIEndpoint(`images/${id}/delete`, router.locale, userData?.token).delete()
            .then(res => {
                setImages(images.filter(img => img.id !== id))
                toast.success(`${res.data.success} 😄`)
            })
            .catch(err => console.log(err))
    }

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <div className="me-page ">
            <div className="container ">
                <div className="d-flex justify-content-center">
                    {loading && <IconLoader className="text-white animate-spin" />}

                </div>
                {images && !loading && <>
                    <div className="col-12">
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid mt-5"
                            columnClassName="my-masonry-grid_column">
                            {images?.length > 0 &&
                                images.map(img => (
                                    <div key={img.id} className="imageMeme-container">
                                        <ModalImage
                                            small={img.image_path}
                                            large={img.image_path}
                                            alt="meme!"
                                            showRotate
                                        />
                                        <div onClick={() => handleDeleteImage(img.id)} className="delete">
                                            <AiTwotoneDelete color="#f30935" size="1.5rem" />
                                        </div>
                                    </div>

                                ))
                            }
                        </Masonry>
                    </div>
                </>

                }
                {!userData && !loading && <>
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
                                <Button variant="primary" className="d-flex align-items-center justify-content-center mx-auto  my-2 px-3 border-0 pb-2 " >
                                    <Link href="/">
                                        <a className="pb-1"> {t('me.not-pass.link')} </a>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                </>}

            </div>

        </div>
    )
}

export default me



