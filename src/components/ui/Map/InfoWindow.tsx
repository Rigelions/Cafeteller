import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import useInfoWindow from '@/hooks/map/useInfoWindow'

interface InfoWindowComponentProps {
  marker: google.maps.marker.AdvancedMarkerElement;
  map: google.maps.Map;
  children: React.ReactNode;
}

const InfoWindowComponent: React.FC<InfoWindowComponentProps> = ({ marker, map, children }) => {
  const { infoWindowRef } = useInfoWindow({ marker, map })

  useEffect(() => {
    if (infoWindowRef.current) {
      const contentDiv = infoWindowRef.current.getContent() as HTMLElement;
      if (contentDiv) {
        contentDiv.innerHTML = ''; // Clear previous content
        createPortal(children, contentDiv);
      }
    }
  }, [infoWindowRef, children]);

  return null;
};

export default InfoWindowComponent;