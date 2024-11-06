import React, { forwardRef, MutableRefObject, useEffect } from 'react'
import { Cafe } from '@/types'
import useMultipleMarker from '@/hooks/map/useMultipleMarker'

interface MarkerPopupProps {
  map: MutableRefObject<google.maps.Map | null>
  cafes: Cafe[]
}

const MarkerPopup = forwardRef(({ map, cafes }: MarkerPopupProps, ref) => {
  const { markers } = useMultipleMarker({
    map,
    options: cafes
      .filter((cafe) => {
        // Filter out cafes without location
        return cafe.location.lat && cafe.location.lon
      })
      .map((cafe) => ({
        id: cafe.id,
        position: {
          lat: cafe.location.lat,
          lng: cafe.location.lon
        },
        title: cafe.name,
        gmpClickable: true
      }))
  })

  useEffect(() => {
    // on click marker
    console.log([...markers.current])
    markers.current?.forEach((marker) => {
      marker.addListener('click', () => {
        console.log('click', marker.id)
      })
    })
  }, [markers])

  useEffect(() => {
    if (!map.current) return

    const bounds = new google.maps.LatLngBounds()
    cafes.forEach((cafe) => {
      if (cafe.location.lat && cafe.location.lon) {
        bounds.extend({
          lat: cafe.location.lat,
          lng: cafe.location.lon
        })
      }
    })

    map.current?.fitBounds(bounds)
  }, [cafes])

  return <></>
})

export default MarkerPopup
