import React, { forwardRef, MutableRefObject, useEffect } from 'react'
import { Cafe } from '@/types'
import useMultipleMarker from '@/hooks/map/useMultipleMarker'
import useInfoWindow from '@/hooks/map/useInfoWindow'
import { createPortal } from 'react-dom'
import Link from 'next/link'

interface MarkerPopupProps {
  map: MutableRefObject<google.maps.Map | null>
  cafes: Cafe[]
}

const MarkerPopup = forwardRef(({ map, cafes }: MarkerPopupProps, ref) => {
  const [focusCafe, setFocusCafe] = React.useState<Cafe | null>(null)
  const { content, openInfoWindow } = useInfoWindow({ map: map.current })

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
        onClick: (marker) => {
          setFocusCafe(cafe)
          if (marker) openInfoWindow(marker)
        }
      }))
  })

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

  const popup = (
    <div className='mt-3'>
      <Link href={`reviews/${focusCafe?.review_id}`}>
        <h1 className='text-2xl font-bold text-center text-primary georgia-font cursor-pointer'>
          {focusCafe?.name}
        </h1>
      </Link>

      <p className='w-full text-center text-lg text-primary'>
        {focusCafe?.sublocality_level_1} •{' '}
        {focusCafe?.administrative_area_level_1}
      </p>
    </div>
  )

  if (!content) return null
  return createPortal(popup, content)
})

export default MarkerPopup
