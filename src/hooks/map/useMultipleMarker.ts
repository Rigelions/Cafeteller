import React, { MutableRefObject, useEffect } from 'react'
import { loader } from '@/utils/gmap'

interface MarkerProps {
  map: MutableRefObject<google.maps.Map | null>
  options: (google.maps.marker.AdvancedMarkerElementOptions & {
    onClick?: (marker?: google.maps.marker.AdvancedMarkerElement) => void
  })[]
}

const useMultipleMarker = ({ map, options }: MarkerProps) => {
  const markers = React.useRef<google.maps.marker.AdvancedMarkerElement[]>([])

  useEffect(() => {
    const initMarkers = async () => {
      const { AdvancedMarkerElement } = (await loader.importLibrary(
        'marker'
      )) as google.maps.MarkerLibrary

      // Clear existing markers
      markers.current.forEach((marker) => {
        marker.map = null
      })
      markers.current = []

      options.forEach(({ onClick, ...option }) => {
        const image = document.createElement('img')
        image.src = '/assets/Images/pin.png'

        const marker = new AdvancedMarkerElement({
          ...option,
          content: image,
          map: map.current
        })

        marker.addListener('click', () => {
          onClick?.(marker)
        })

        markers.current.push(marker)
      })
    }

    if (!map?.current) return
    initMarkers().then()
  }, [map, map.current, options.length])

  // Optionally, clean up the markers if the component using them unmounts
  useEffect(() => {
    return () => {
      markers.current.forEach((marker) => {
        marker.map = null
      })
    }
  }, [])

  return { markers }
}

export default useMultipleMarker
