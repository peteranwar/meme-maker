import { useEffect, useState } from 'react'
import Link from 'next/link'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'
import * as R from 'ramda'

import Editor from '../components/Editor/Editor'
import TemplatesPanel from '../components/TemplatesPanel/TemplatesPanel'
import { createAPIEndpoint } from '../apiUtilis'
export default function Home(props) {
  const { t, lang } = useTranslation('common')


  // const [templates, setTemplates] = useState([])
  const [stickers, setStickers] = useState([])

  const [loadingAssets, setLoadingAssets] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadedFileUrl, setUploadedFileUrl] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [loadAnimations, setLoadAnimations] = useState(false)
  const [showTemplatesPanel, setShowTemplatesPanel] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)


  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 500
  // const isAdmin = R.pathOr('', ['email'], user).includes('@supabase.io')

  const onSelectChangeTemplate = () => {
    setShowTemplatesPanel(true)
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const onTemplateUpload = async (event) => {
    setUploading(true)
    setSelectedTemplate(null)
    event.persist()
    const file = event.target.files[0];
    // const key = await uploadFile(files[0], user, TEMPLATES_BUCKET)
    // const formattedKey = key.split('/').slice(1).join('/')
    // const url = await getSignedUrl(TEMPLATES_BUCKET, formattedKey)
    const base64 = await convertBase64(file);
    // console.log('base64', base64)
    setUploadedFileUrl(base64)
    setUploading(false)
    setShowTemplatesPanel(false)
    event.target.value = ''
  }



  const onTemplateUpload2 = async (img) => {

    console.log('img from homee', img)
    setUploadedFileUrl(img)
    setUploading(false)
    setShowTemplatesPanel(false)
  }


  const loadTemplate = async (img) => {
    setSelectedTemplate(img)
    setShowTemplatesPanel(false)
  }



  return (
    <div className="home-page">
      <div className="">
        <div className="text-center pt-3 pb-4">
          {<Trans
            i18nKey="common:home.title"
            components={[
              <h1 className="title" />,
              <span ></span>,
            ]}
          />}
          <h4 className="subtitle">{t('home.subtitle')} 💚</h4>
        </div>
        {typeof window !== 'undefined' && (
          <Editor
            // stickers={stickers}
            // templates={templates}
            isMobile={isMobile}
            // isAdmin={isAdmin}
            loadTemplate={loadTemplate}
            selectedTemplate={selectedTemplate}
            uploading={uploading}
            uploadedFileUrl={uploadedFileUrl}
            onTemplateUpload={onTemplateUpload}
            onSelectChangeTemplate={onSelectChangeTemplate}
          />
        )}
        <TemplatesPanel
          templates={props.templates}
          loadingAssets={loadingAssets}
          onTemplateUpload2={onTemplateUpload2}
          uploading={uploading}

          
          uploadedFileUrl={uploadedFileUrl}


          visible={showTemplatesPanel}
          loadTemplate={loadTemplate}
          onTemplateUpload={onTemplateUpload}
          hideTemplatesPanel={() => setShowTemplatesPanel(false)}
        />
      </div>
    </div>
  )
}


export async function getStaticProps(context) {
  let templates = "";
  templates = await createAPIEndpoint('images', context.locale).fetchAll()
    .then(res => {
      return res.data.images
    })
  return {
    props: {
      templates: templates || [],
    },
    revalidate: 10000000,
  };
}