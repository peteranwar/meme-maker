import { Button, IconLoader, SidePanel, Typography } from '@supabase/ui'
import { useRef } from 'react'
import useTranslation from 'next-translate/useTranslation'

import * as R from 'ramda'

const TemplatesPanel = ({
  templates ,

  uploadedFileUrl,


  loadingAssets = false,
  uploading = false,
  visible = false,
  loadTemplate = () => {},
  onTemplateUpload = () => {},
  onTemplateUpload2 = () => {},
  hideTemplatesPanel = () => {},
}) => {
  const uploadButtonRef = useRef(null);

  const { t, lang } = useTranslation('common')

  const onSelectUpload = () => {
    if (uploadButtonRef.current) {
      uploadButtonRef.current.click()
    }
  }

  return (
    <SidePanel
      hideFooter
      title={t('templatePanel.title')}
      description={t('templatePanel.subtitle')}
      visible={visible}
      onCancel={hideTemplatesPanel}
    >
      <div className="flex flex-col h-full">
        <div className="hidden">
          <input
            ref={uploadButtonRef}
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={onTemplateUpload}
          />
        </div>
        <Button block loading={uploading} onClick={onSelectUpload}>
          {/* {!uploading ? 'Upload your own template' : 'Uploading template'} */}
          {t('templatePanel.btnText')}
        </Button>

        <div className="mt-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 190px)' }}>
          {templates.length < 0 ? (
            <div
              className="space-y-2 flex flex-col items-center justify-center"
              style={{ height: 'calc(100vh - 190px)' }}
            >
              <IconLoader className="text-white animate-spin" />
              <Typography.Text small>{t('templatePanel.loading')}</Typography.Text>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {R.map(
                (template) => (
                  <div
                    key={template.id}
                    className="h-32 bg-center bg-no-repeat bg-cover rounded-md cursor-pointer"
                    style={{ backgroundImage: `url('${template.image_path}')` }}
                    onClick={() => onTemplateUpload2(template.image_path)}
                  />
                ),
                templates
              )}
            </div>
          )}
        </div>

        {/* Probably add some search or something */}
      </div>
    </SidePanel>
  )
}

export default TemplatesPanel
