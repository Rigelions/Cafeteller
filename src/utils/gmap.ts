import { Loader } from '@googlemaps/js-api-loader'

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '',
  version: 'weekly',
  libraries: ['places', 'marker']
  // language: 'th',
  // region: 'TH'
})

export { loader }
