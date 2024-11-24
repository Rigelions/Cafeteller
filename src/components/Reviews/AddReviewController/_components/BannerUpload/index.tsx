import React, { useState } from 'react'
import { uploadImageService } from '@/services/media/images'
import dynamic from 'next/dynamic'
import { useAtom } from 'jotai'
import { cafeAtom } from '@/components/Reviews/AddReviewController/atom/cafe'
const FileDrop = dynamic(
  () => import('core_cafeteller/components').then((module) => module.FileDrop),
  { ssr: false }
)

interface BannerUploadProps {}

const BannerUpload: React.FC<BannerUploadProps> = () => {
  const [cafe, setCafe] = useAtom(cafeAtom)
  const [loading, setLoading] = useState<boolean>(false)

  const handleImageChange = async (files: FileList) => {
    const file = files[0]
    if (file) {
      setLoading(true)
      const data = await uploadImageService(file)

      setCafe((cafe) => ({
        ...cafe,
        banner: {
          date: new Date().toISOString(),
          name: file.name,
          url: data.urls['@1980'],
          alternative: data.urls
        }
      }))

      setLoading(false)
    }
  }

  const handleOnClear = () => {
    setCafe((cafe) => ({
      ...cafe,
      banner: {
        date: '',
        name: '',
        url: '',
        alternative: {
          '@1980': '',
          '@1024': '',
          '@720': ''
        }
      }
    }))
  }

  return (
    <div className='banner-upload w-[98%] relative'>
      <FileDrop
        type='image'
        loading={loading}
        onClear={handleOnClear}
        onFileChange={handleImageChange}
        innerDivClassName='aspect-[4/3]'
        preview={cafe.banner?.url}
      />
    </div>
  )
}

export default BannerUpload
