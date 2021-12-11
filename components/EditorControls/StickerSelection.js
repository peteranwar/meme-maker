import { Button, Divider, IconPlus, Typography } from '@supabase/ui'
import { Dropdown } from 'react-bootstrap';

import { useRef, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'

import * as R from 'ramda'
import sticker1 from '../../public/assets/images/stickers/blunt.png'
import sticker2 from '../../public/assets/images/stickers/laser-eyes.png'
import sticker3 from '../../public/assets/images/stickers/math.png'
import sticker4 from '../../public/assets/images/stickers/popcat.png'
import sticker5 from '../../public/assets/images/stickers/scumbag-hat.png'
import sticker6 from '../../public/assets/images/stickers/sunglasses.png'
import sticker7 from '../../public/assets/images/stickers/supacap.png'

const StickerSelection = ({
  onAddSticker = () => { },
  onSelectUploadSticker = () => { },
}) => {
  const { t, lang } = useTranslation('common')
  const [stickers, setStickers] = useState([
    { url: sticker1, name: 'blunt' },
    { url: sticker2, name: 'laser-eyes' },
    { url: sticker3, name: 'math' },
    { url: sticker4, name: 'popcat' },
    { url: sticker5, name: 'scumbag-hat' },
    { url: sticker6, name: 'sunglasses' },
    { url: sticker7, name: 'supacap' },
  ]);




  return (
    <Dropdown className="">
      <Dropdown.Toggle className="secondary-btn d-flex align-items-center" id="dropdown-basic">
        <div className="h-10 flex">
          <Button type="text">
            <img className="h-5" src="/assets/images/sticker.svg" />
          </Button>
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item key="upload" onClick={onSelectUploadSticker}>
          <div className="w-100 d-flex justify-content-between items-center py-1 ">
            <Typography.Text small> {t('upload-sticker')}</Typography.Text>
            <IconPlus strokeWidth={2} size={16} />
          </div>
        </Dropdown.Item>
        {
          R.map(
             (sticker) => (
               <Dropdown.Item className="w-100" key={sticker.name} onClick={() => onAddSticker(sticker)}>
                 <div  className="w-100 d-flex justify-content-between items-center ">
                   <img  className="" className="w-6" src={sticker.url} />
                   <Typography.Text className=" text-white" small>{sticker.name}</Typography.Text>
                 </div>
               </Dropdown.Item>
             ),
             stickers
           )}
      
      </Dropdown.Menu>
    </Dropdown>
    // <Dropdown
    //   className="max-h-[180px] !overflow-y-auto"
    //   overlay={[
    //     <Dropdown.Item key="upload" onClick={onSelectUploadSticker}>
    //       <div className="flex items-center py-1 space-x-4">
    //         <Typography.Text small> {t('upload-sticker')}</Typography.Text>
    //         <IconPlus strokeWidth={2} size={16} />
    //       </div>
    //     </Dropdown.Item>,
    //     <Divider light />,
    //     ...R.map(
    //       (sticker) => (
    //         <Dropdown.Item className="w-100" key={sticker.name} onClick={() => onAddSticker(sticker)}>
    //           <div  className="w-100 d-flex justify-content-between items-center space-x-4">
    //             <img  className="mx-3" className="w-6" src={sticker.url} />
    //             <Typography.Text className="mx-3 text-white" small>{sticker.name}</Typography.Text>
    //           </div>
    //         </Dropdown.Item>
    //       ),
    //       stickers
    //     ),
    //   ]}
    // >
    //   <div className="h-10 flex">
    //     <Button type="text">
    //       <img className="h-5" src="/assets/images/sticker.svg" />
    //     </Button>
    //   </div>
    // </Dropdown>
  )
}

export default StickerSelection
