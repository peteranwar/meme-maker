import { useState } from 'react'
import Link from 'next/link'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'
import * as R from 'ramda'

import Layout from '../components/Layout'
import Editor from '../components/Editor/Editor'
export default function Home() {
  const { t, lang } = useTranslation()
  const isRTL = lang === 'ar' || lang === 'he'
  const arrow = isRTL ? String.fromCharCode(8592) : String.fromCharCode(8594)


  const [templates, setTemplates] = useState([])
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
    console.log('base64', base64)
    setUploadedFileUrl(base64)
    setUploading(false)
    setShowTemplatesPanel(false)
    event.target.value = ''
  }


  const loadTemplate = async (template) => {
    const formattedTemplate = await resignTemplateUrls(template)
    setSelectedTemplate(formattedTemplate)
    setShowTemplatesPanel(false)
  }

  return (
    <Layout>
      <main dir={isRTL ? 'rtl' : 'ltr'}>
        <Trans
          i18nKey="home:title"
          components={[
            <h1 className="title" />,
            <a href="https://nextjs.org">Next.js!</a>,
          ]}
        />

        <p className="description">
          {t('home:description')} <code>_pages/index.js</code>
        </p>

        <div className="grid">
          <Link href="/" locale="en">
            <div className="card">
              <h3>{t('home:english')}</h3>
              <p>{t('home:change-english')}</p>
            </div>
          </Link>

          <Link href="/" locale="ca">
            <div className="card">
              <h3>{t('home:catalan')}</h3>
              <p>{t('home:change-catalan')}</p>
            </div>
          </Link>

          <Link href="/" locale="ar">
            <div className="card">
              <h3>{t('home:arabic')}</h3>
              <p>{t('home:change-arabic')}</p>
            </div>
          </Link>

          <Link href="/" locale="he">
            <div className="card">
              <h3>{t('home:hebrew')}</h3>
              <p>{t('home:change-hebrew')}</p>
            </div>
          </Link>
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
       

          <a
            href="https://github.com/vinissimus/next-translate"
            className="card"
          >
            <h3>{`Learn ${arrow}`}</h3>
            <p>{t('home:plugin-docs')}</p>
          </a>
        </div>
      </main>

     
    </Layout>
  )
}
