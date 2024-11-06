import { useEffect, useRef } from 'react'
import { loader } from '@/utils/gmap'

interface InfoWindowProps {
  marker: google.maps.marker.AdvancedMarkerElement | null
  map: google.maps.Map | null
}

const useInfoWindow = ({ marker, map }: InfoWindowProps) => {
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)
  const content = useRef(document.createElement('div'))

  useEffect(() => {
    const initInfoWindow = async () => {
      const { InfoWindow } = (await loader.importLibrary(
        'maps'
      )) as google.maps.MapsLibrary

      infoWindowRef.current = new InfoWindow({
        content: content.current,
        ariaLabel: 'Info Window'
      })

      marker?.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.open({
            anchor: marker,
            map
          })
        }
      })
    }

    if (marker && map) {
      initInfoWindow().then()
    }
  }, [marker, map])

  return {
    infoWindowRef,
    content
  }
}

export default useInfoWindow
