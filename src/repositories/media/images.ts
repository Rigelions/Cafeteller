import axios from '@/utils/axios'
import { AxiosProgressEvent } from 'axios'

export const uploadImageRepo = async (
  file: File,
  onUploadProgress = (progressEvent: AxiosProgressEvent) => {}
): Promise<any> => {
  // sent file using axios
  const formData = new FormData()

  formData.append('file', file)

  return await axios.post('/media/image/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  })
}
