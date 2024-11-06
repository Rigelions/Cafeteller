import { useEffect, useRef, useState } from 'react'
import { loader } from '@/utils/gmap'
import { uuidv4 } from '@firebase/util'

interface InfoWindowProps {
  map: google.maps.Map | null
}

const useInfoWindow = ({ map }: InfoWindowProps) => {
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)
  const [content, setContent] = useState<HTMLElement | null>(null)
  const [id] = useState(uuidv4())

  const openInfoWindow = (marker: google.maps.marker.AdvancedMarkerElement) => {
    infoWindowRef.current?.open({
      anchor: marker,
      map: map
    })
    const infoWindow = infoWindowRef.current?.getContent()
    setContent(infoWindow as HTMLDivElement)
  }

  useEffect(() => {
    const initInfoWindow = async () => {
      const content = document.createElement('div')
      content.id = id

      const { InfoWindow } = (await loader.importLibrary(
        'maps'
      )) as google.maps.MapsLibrary

      infoWindowRef.current = new InfoWindow({
        content,
        ariaLabel: 'Info Window'
      })
    }

    if (map) {
      initInfoWindow().then()
    }
  }, [map])

  return {
    infoWindowRef,
    id,
    content,
    openInfoWindow
  }
}

export default useInfoWindow
