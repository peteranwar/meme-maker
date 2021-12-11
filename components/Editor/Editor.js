import { fabric } from 'fabric'
import { v4 } from 'uuid'
import {
  Input,
  Button,
  IconType,
  IconChevronDown,
  IconSave,
  IconImage,
  IconArchive,
} from '@supabase/ui'
import { Dropdown } from 'react-bootstrap';

import { useEffect, useState, useRef } from 'react'
import * as R from 'ramda'
import confetti from 'canvas-confetti'
import { DEFAULT_SWATCHES, DEFAULT_FONTS } from './constants'
import {
  resizeImageToFitCanvas,
  resizeImageWithinCanvas,
  getCanvasJson,
  dataURLtoFile,
} from '../../utils/editor'
import useTranslation from 'next-translate/useTranslation'


import EmptyState from './EmptyState'
import {
  FontSize,
  FontFamily,
  LayerOrder,
  Remove,
  StickerSelection,
  TextAlign,
  TextFillColour,
  TextStrokeColour,
} from '../EditorControls'
import toast from 'react-hot-toast'
import { useUserData } from '../../context/UserDataState';
import { createAPIEndpoint } from '../../apiUtilis';

const STICKERS_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STICKERS_BUCKET

const Editor = ({
  user,
  isMobile = false,
  isAdmin = false,
  stickers = [],
  selectedTemplate = null,
  uploadedFileUrl = '',
  uploading = false,
  onTemplateUpload = () => { },
  onSelectChangeTemplate = () => { },
}) => {
  const editorDimensions = {
    // width: isMobile ? 400 : 800,
    // height: isMobile ? 400 : 450,
    width: 1120,
    height: 450,
  }

  const { t, i18n, lang } = useTranslation('common')
  const [userData, setUserData] = useUserData();


  const editorRef = useRef(null)
  const copiedObject = useRef(null)
  const uploadStickerButtonRef = useRef(null)

  const [name, setName] = useState('')
  const [selectedObject, setSelectedObject] = useState(null)
  const isCanvasEmpty = !(selectedTemplate || uploadedFileUrl)
  const isTextObjectSelected = R.hasPath(['fontSize'], selectedObject)

  useEffect(() => {
    const editor = new fabric.Canvas('editor', {
      preserveObjectStacking: true,
    })

    window.addEventListener('keydown', handleKeyPress)
    editor.on('selection:created', onSelectionCreated)
    editor.on('selection:updated', onSelectionUpdated)
    editor.on('selection:cleared', onSelectionCleared)
    editor.on('object:modified', onObjectModified)

    editorRef.current = editor
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      editorRef.current.__eventListeners = {}
    }
  }, [])

  useEffect(() => {
    if (uploadedFileUrl) {
      mountBackgroundImage(uploadedFileUrl)
    }
  }, [uploadedFileUrl])

  useEffect(() => {
    if (selectedTemplate) {
      editorRef.current.remove(...editorRef.current.getObjects())
      editorRef.current.loadFromJSON(selectedTemplate.json, () => {
        const objects = editorRef.current.getObjects()
        const [backgroundObject] = objects.filter((object) => object.isBackground)
        backgroundObject.set({ selectable: false, evented: false })

        if (isMobile) {
          // We added some mobile responsiveness support in retrospect, hence we
          // need to resize the saved templates cause they were configured on large screens
          if (backgroundObject.width >= backgroundObject.height) {
            const zoomScale =
              editorDimensions.width / (backgroundObject.width * backgroundObject.scaleX)
            editorRef.current.setZoom(zoomScale)
            editorRef.current.setHeight(
              backgroundObject.height * backgroundObject.scaleY * zoomScale
            )
            editorRef.current.setWidth(editorDimensions.width)
          } else if (backgroundObject.width < backgroundObject.height) {
            const zoomScale =
              editorDimensions.height / (backgroundObject.height * backgroundObject.scaleY)
            editorRef.current.setZoom(zoomScale)
            editorRef.current.setHeight(editorDimensions.height)
            editorRef.current.setWidth(backgroundObject.width * backgroundObject.scaleX * zoomScale)
          }
        } else {
          editorRef.current.setWidth(backgroundObject.width * backgroundObject.scaleX)
          editorRef.current.setHeight(backgroundObject.height * backgroundObject.scaleY)
        }

        editorRef.current.requestRenderAll()
      })
    }
  }, [selectedTemplate])

  /* Event listeners */
  const handleKeyPress = (event) => {
    const { keyCode } = event
    const activeObject = editorRef.current.getActiveObject()
    const targetType = event.target.tagName.toUpperCase()

    if (activeObject && !activeObject.isEditing && targetType !== 'INPUT') {
      switch (keyCode) {
        case 8: {
          // Remove object
          editorRef.current.remove(activeObject)
          break
        }
        case 67: {
          if (event.metaKey) {
            copiedObject.current = activeObject
          }
          break
        }
      }
    }

    if (targetType !== 'INPUT') {
      switch (keyCode) {
        case 86: {
          if (event.metaKey && copiedObject.current) {
            const clonedObject = fabric.util.object.clone(copiedObject.current)
            clonedObject.set({ top: clonedObject.top + 10, left: clonedObject.left + 10 })
            editorRef.current.add(clonedObject)
          }
          break
        }
        case 90: {
          if (event.metaKey) {
            console.log('Undo')
          }
          break
        }
      }
    }
  }

  const onSelectionCreated = (event) => {
    const objectJSON = JSON.parse(JSON.stringify(event.target))
    setSelectedObject(objectJSON)
  }

  const onSelectionUpdated = (event) => {
    const objectJSON = JSON.parse(JSON.stringify(event.target))
    setSelectedObject(objectJSON)
  }

  const onSelectionCleared = () => {
    setSelectedObject(null)
  }

  const onObjectModified = (event) => {
    // Update fontSize when we scale textboxes
    if (event.action === 'scale' && R.hasPath(['fontSize'], event.target)) {
      event.target.fontSize *= event.target.scaleX
      event.target.fontSize = event.target.fontSize.toFixed(0)
      event.target.scaleX = 1
      event.target.scaleY = 1
      event.target._clearCache()
      updateTextAttribute({ fontSize: event.target.fontSize })
    }
  }

  /* Canvas interaction methods */
  const addNewText = () => {
    const text = new fabric.IText('New textbox', {
      left: editorRef.current.width / 2,
      top: editorRef.current.height / 2,
      originX: 'center',
      originY: 'center',
      fontSize: 30,
      fontFamily: 'Impact',
      fill: '#FFFFFF',
      stroke: '#000000',
      strokeWidth: 1,
      textAlign: 'center',
    })
    text.setControlsVisibility({
      mt: false,
      mr: false,
      mb: false,
      ml: false,
    })
    editorRef.current.add(text)
    editorRef.current.bringToFront(text)
    editorRef.current.setActiveObject(text)
  }

  const updateTextAttribute = (attribute) => {
    const textObject = editorRef.current.getActiveObject()
    textObject.set(attribute)
    editorRef.current.requestRenderAll()

    const updatedSelectedObject = {
      ...selectedObject,
      ...attribute,
    }
    setSelectedObject(updatedSelectedObject)
  }

  const addSticker = async (sticker) => {
    const stickerUrl = await getSignedUrl(STICKERS_BUCKET, sticker.path)
    fabric.Image.fromURL(
      stickerUrl,
      (img) => {
        const imageDimensions = { width: img.width, height: img.height }
        const editorDimensions = {
          width: editorRef.current.width,
          height: editorRef.current.height,
        }
        const scale = resizeImageWithinCanvas(imageDimensions, editorDimensions)
        img.set({
          left: editorRef.current.width / 2,
          top: editorRef.current.height / 2,
          originX: 'center',
          originY: 'center',
          scaleX: scale,
          scaleY: scale,
        })
        editorRef.current.add(img)
        editorRef.current.setActiveObject(img)
      },
      { crossOrigin: 'anonymous' }
    )
  }

  const onSelectUploadSticker = () => {
    if (uploadStickerButtonRef.current) {
      uploadStickerButtonRef.current.click()
    }
  }

  const uploadSticker = async (event) => {
    event.persist()
    const files = event.target.files
    // const key = await uploadFile(files[0], user, STICKERS_BUCKET)
    // const formattedKey = key.split('/').slice(1).join('/')
    // await addSticker({ path: formattedKey })
    event.target.value = ''
  }

  const removeObject = () => {
    const activeObject = editorRef.current.getActiveObject()
    editorRef.current.remove(activeObject)
  }

  const shiftObjectForward = () => {
    const activeObject = editorRef.current.getActiveObject()
    editorRef.current.bringForward(activeObject)
  }

  const shiftObjectBackward = () => {
    const activeObject = editorRef.current.getActiveObject()
    const objectIndex = editorRef.current.getObjects().indexOf(activeObject)
    if (objectIndex > 1) {
      editorRef.current.sendBackwards(activeObject)
    }
  }

  const mountBackgroundImage = (url) => {
    editorRef.current.remove(...editorRef.current.getObjects())
    fabric.Image.fromURL(
      url,
      (img) => {
        const imageDimensions = { width: img.width, height: img.height }
        const scale = resizeImageToFitCanvas(imageDimensions, editorDimensions)

        // Resize the canvas to fit the background snuggly so that we do not export
        // with any whitespace
        // [TODO] Small bug - uploading drake meme, followed by communist bugs meme
        // The canvas resizing isn't updating properly
        if (editorDimensions.width > img.width * scale) {
          editorRef.current.setWidth(img.width * scale)
        } else if (editorDimensions.height > img.height * scale) {
          editorRef.current.setHeight(img.height * scale)
        }
        editorRef.current.calcOffset()

        img.set({
          left: editorRef.current.width / 2,
          top: editorRef.current.height / 2,
          originX: 'center',
          originY: 'center',
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
          isBackground: true,
        })
        editorRef.current.add(img)
        editorRef.current.sendToBack(img)
      },
      { crossOrigin: 'anonymous' }
    )
  }

  /* Misc methods */

  const onSaveDefaultTemplate = async () => {
    const canvasJson = getCanvasJson(editorRef.current)
    if (!name) {
      return toast.error('You need a name for your template')
    }
    if (canvasJson.objects.length === 0) {
      return toast.error('There are no objects on your canvas')
    }
    await saveDefaultTemplate(name, canvasJson)
  }

  const onSaveTemplate = async () => {
    if (!userData) {
      return toast(`${lang === 'ar' ? 'قم بتسجيل الدخول أولا ثم أحفظ الميم!' : 'Log in to save your memes!'}`, { icon: '🔒' })
    }
    const canvasJson = getCanvasJson(editorRef.current)
    const dataURL = editorRef.current.toDataURL('image/png', 1.0)
    const file = dataURLtoFile(dataURL, v4())
    // await saveUserTemplate(user, file, canvasJson, selectedTemplate)
    console.log('res cora', dataURL)

    await createAPIEndpoint('save-image', lang, userData.token).create({
      image: dataURL
    }).
    then(res=> {
      console.log('res cora', res)

    })
    .catch(err=> {
      console.log('err cora', err)

    })
    // console.log('cora', file)
    // console.log('cora', dataURL)
    return toast.success('Successfully saved your meme!', { icon: '🎁' })
  }

  const onExportCanvas = () => {
    const link = document.createElement('a')
    link.href = editorRef.current.toDataURL('image/png', 1.0)
    link.setAttribute('download', `meme-maker.png`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    confetti({
      spread: randomInRange(50, 70),
      particleCount: randomInRange(50, 100),
      origin: { y: 0.6 },
    })
    return toast(`${lang === 'ar' ? 'استمتع بالميم بتاعك!' : 'Enjoy your meme!'}`, { icon:'🥳' })

  }

  return (
    <div className="container editor-container">
      <div className="row justify-content-center">
        <div className=" col-md-12">

          <div className="d-none">
            <input
              ref={uploadStickerButtonRef}
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={uploadSticker}
            />
          </div>
          <div className="w-full flex flex-col sm:flex-row space-y-2 sm:space-y-0 items-center justify-between">
            {isTextObjectSelected ? (
              <div className="flex items-center space-x-2">
                <FontFamily
                  fonts={DEFAULT_FONTS}
                  selectedObject={selectedObject}
                  updateTextAttribute={updateTextAttribute}
                />

                <FontSize selectedObject={selectedObject} updateTextAttribute={updateTextAttribute} />

                <div className=" flex items-center space-x-1">
                  <TextFillColour
                    swatches={DEFAULT_SWATCHES}
                    selectedObject={selectedObject}
                    updateTextAttribute={updateTextAttribute}
                  />

                  <TextStrokeColour
                    swatches={DEFAULT_SWATCHES}
                    selectedObject={selectedObject}
                    updateTextAttribute={updateTextAttribute}
                  />

                  <TextAlign
                    selectedObject={selectedObject}
                    updateTextAttribute={updateTextAttribute}
                  />
                </div>
              </div>
            ) : (
              <div />
            )}

            {!isCanvasEmpty ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex items-center space-x-1">
                  {!R.isNil(selectedObject) && (
                    <LayerOrder
                      shiftObjectForward={shiftObjectForward}
                      shiftObjectBackward={shiftObjectBackward}
                    />
                  )}
                  {!R.isNil(selectedObject) && <Remove onRemoveObject={removeObject} />}
                  <StickerSelection
                    stickers={stickers}
                    onAddSticker={addSticker}
                    onSelectUploadSticker={onSelectUploadSticker}
                  />
                  <div className="h-10 flex">
                    <Button
                      type="text"
                      icon={<IconType size="medium" strokeWidth={2} />}
                      onClick={addNewText}
                    />
                  </div>
                </div>
                <Button type="secondary" onClick={onSelectChangeTemplate}>
                  Change template
                </Button>
              </div>
            ) : (
              <div className="h-[40px]" />
            )}
          </div>

          <div
            className="border border-gray-500 rounded-md flex items-center justify-center relative"
            style={{ width: editorDimensions.width }}
          >
            {isCanvasEmpty && (
              <EmptyState
                uploading={uploading}
                onFilesUpload={onTemplateUpload}
                onSelectChangeTemplate={onSelectChangeTemplate}
              />
            )}
            <canvas id="editor" width={editorDimensions.width} height={editorDimensions.height} />
          </div>

          {!isCanvasEmpty && (
            <div className="w-full flex items-center justify-between">
              {isAdmin ? (
                <Input
                  className="w-64"
                  placeholder="Name your meme template"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              ) : (
                <div />
              )}
           
              <Dropdown className="mx-2 my-2">
                <Dropdown.Toggle className="secondary-btn d-flex align-items-center" id="dropdown-basic">
                  <span className="mx-2  pb-1"> {t('editor.save')}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item className="d-flex" onClick={onSaveTemplate}>
                    <IconSave /> <span className="mx-2">{t('editor.save-meme')}</span>
                  </Dropdown.Item>
                  <Dropdown.Item className="d-flex" onClick={onExportCanvas}>
                    <IconImage /> <span className="mx-2">{t('editor.export')}</span> 
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Editor


