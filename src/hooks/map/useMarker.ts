import React, { MutableRefObject, useEffect } from 'react'
import { loader } from '@/utils/gmap'

interface MarkerProps {
  map: MutableRefObject<google.maps.Map | null>
  options: google.maps.marker.AdvancedMarkerElementOptions
}

const useMarker = ({ map, options }: MarkerProps) => {
  const marker = React.useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  )

  useEffect(() => {
    const initMarker = async () => {
      const { AdvancedMarkerElement } = (await loader.importLibrary(
        'marker'
      )) as google.maps.MarkerLibrary

      const image = document.createElement('img')
      image.src = '/assets/Images/pin.png'

      marker.current = new AdvancedMarkerElement({
        ...options,
        content: image,
        map: map.current
      })
    }

    if (!map?.current) return
    initMarker().then()
  }, [map, map.current])

  // useEffect(() => {
  //   if (!marker.current) return
  //
  //   // Update marker when options change
  //   marker.current.position = options.position || marker.current.position
  //   marker.current.title = options.title || marker.current.title
  //   marker.current.gmpDraggable =
  //     options.gmpDraggable || marker.current.gmpDraggable
  //   marker.current.map = map // Ensure that the marker is still attached to the map
  // }, [options])

  // Optionally, clean up the marker if the component using it unmounts
  useEffect(() => {
    return () => {
      if (marker.current) {
        marker.current.map = null
      }
    }
  }, [])

  return { marker }
}

export default useMarker
