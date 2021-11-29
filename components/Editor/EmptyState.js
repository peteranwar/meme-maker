import { Button, IconLoader, Typography } from '@supabase/ui'
import useTranslation from 'next-translate/useTranslation'

import { useRef } from 'react'

const EmptyState = ({
  uploading = false,
  onFilesUpload = () => {},
  onSelectChangeTemplate = () => {},
}) => {
  const uploadButtonRef = useRef(null)
  const { t, lang } = useTranslation('common')

  const onSelectUpload = () => {
    if (uploadButtonRef.current) {
      uploadButtonRef.current.click()
    }
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center space-y-4 z-10">
      {uploading ? (
        <>
          <IconLoader className="animate-spin" strokeWidth={2} />
          <Typography.Text>Uploading image</Typography.Text>
        </>
      ) : (
        <>
          <div className="d-none">
            <input
              ref={uploadButtonRef}
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={onFilesUpload}
            />
          </div>
          <Button type="secondary" onClick={onSelectUpload}>
          {t('home.upload-image')}
          </Button>
          <div className="border-b border-gray-600 w-48" />
          <Button type="primary" onClick={onSelectChangeTemplate}>
              {t('home.select-template')}
          </Button>
        </>
      )}
    </div>
  )
}

export default EmptyState
