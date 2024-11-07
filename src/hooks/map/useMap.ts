import React, { MutableRefObject, useEffect } from 'react'
import { loader } from '@/utils/gmap'

interface MapProps {
  element?: MutableRefObject<HTMLElement | null>
  options: google.maps.MapOptions
}

const useMap = ({ element, options }: MapProps) => {
  const [loading, setLoading] = React.useState<boolean>(true)
  const mapRef = React.useRef<google.maps.Map | null>(null)

  useEffect(() => {
    const initMap = async () => {
      const { Map } = await loader.importLibrary('maps')

      if (!element?.current) return

      // check if position is correct LatLng object
      if (!options.center?.lat || !options.center?.lng) {
        console.error('Invalid position')
        return
      }

      mapRef.current = new Map(element.current, options)

      setLoading(false)
    }

    initMap().then()
  }, [element])

  useEffect(() => {
    if (!mapRef.current) return

    mapRef.current.setOptions(options)
  }, [options])

  return { mapRef, loading }
}

export default useMap
