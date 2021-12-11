import React, { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'

import Link from 'next/link';
import Image from "next/image"
import { Button } from 'react-bootstrap';
import ModalImage from "react-modal-image";
import Masonry from 'react-masonry-css'
import { createAPIEndpoint } from '../../apiUtilis/index'

const community = (props) => {
    const { t } = useTranslation('common');

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };
    // console.log('props', props.images)
    return (
        <div className="community-page">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="header-container my-2">
                            <div className="main-title">
                                <h1 className=" text-md-center py-3">{t('community.title')}</h1>
                            </div>
                            <Button variant="primary" className="d-flex align-items-center  mx-auto   px-2 border-0 py-1 " >
                                <Link href="/">
                                    <a className="pb-1"> {t('community.link')} </a>
                                </Link>
                            </Button>

                        </div>
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid mt-5"
                            columnClassName="my-masonry-grid_column">
                            {/* <ModalImage
                            small='/assets/images/girl-running.png'
                            large='/assets/images/girl-running.png'
                            alt="Hello World!"
                        /> */}
                            {props.images.length > 0 ?
                                props.images.map(img => (
                                    <ModalImage
                                        key={img.id}
                                        small={img.image_path}
                                        large={img.image_path}
                                        alt="meme!"
                                        showRotate
                                    />
                                )) :
                                <h1>No Memes</h1>
                            }
                        </Masonry>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default community


export async function getStaticProps(context) {
    // console.log('contextttttttttttttttttttttttttt about', context.locale)
    let images = "";

    images = await createAPIEndpoint('images', context.locale).fetchAll()
        .then(res => {
            console.log('resssssssss', res.data)
            return res.data.images
        })

    return {
        props: {
            images: images || [],
        },
        revalidate: 10000000,
    };
}