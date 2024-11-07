import { Review } from '@/types/reviews'

export * from './reviews'

export interface Banner {
  date: string
  name: string
  url: string
  alternative?: {
    '@1980': string
    '@1024': string
    '@720': string
  }
}

export interface Location {
  lat: number
  lon: number
}

export interface Cafe {
  administrative_area_level_1: string
  banner: Banner
  country: string
  description?: string
  details: string
  fb?: string
  ig?: string
  tw?: string
  review_id?: string
  landmark?: string
  location: Location
  name: string
  openhour: string
  parking: string
  phone?: string
  postal_code: string
  route: string
  sublocality_level_1: string
  sublocality_level_2: string
  tags: string[]
  id?: string
  street_number?: string
}

export type DisplayReview = Review | { id: 'add-review' }
export type DisplayReviewRow = DisplayReview[]

export interface URLSImageSrc {
  '@1980': string
  '@1024': string
  '@720': string
}

export interface UploadResponse {
  success: number
  id: number
  urls: URLSImageSrc
}
