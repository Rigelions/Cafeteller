import { UploadResponse } from '@/types'
import { uploadImageRepo } from '@/repositories/media/images'
import { AxiosProgressEvent } from 'axios'

export const uploadImageService = async (
  file: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<UploadResponse> => {
  // sent file using axios
  try {
    const response = await uploadImageRepo(file, onUploadProgress)
    return response.data
  } catch (error) {
    console.error('Error uploading image:', error)
    return {
      success: 0,
      id: 0,
      urls: {
        '@1980': '',
        '@1024': '',
        '@720': ''
      }
    }
  }
}
