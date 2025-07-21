'use client';

import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

interface MapViewProps {
  lat?: number;
  lng?: number;
  address?: string;
}

const mapContainerStyle = {
  height: '250px',
  width: '100%',
};

const libraries: ('places' | 'drawing' | 'geometry' | 'localContext' | 'visualization')[] = ['places'];

const MapView: React.FC<MapViewProps> = ({ lat, lng, address }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
    id: 'display-map-script', // Unique ID to avoid conflicts
  });

  if (loadError) {
    return (
      <div className="h-[250px] rounded-lg bg-muted flex items-center justify-center text-center p-4 text-muted-foreground">
        Map could not be loaded. Please ensure the Google Maps API key is correct and has the necessary APIs enabled.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-[250px] rounded-lg bg-muted flex items-center justify-center text-center p-4 text-muted-foreground">
        Loading map...
      </div>
    );
  }
  
  if (typeof lat === 'undefined' || typeof lng === 'undefined') {
    return (
        <div className="h-[250px] rounded-lg bg-muted flex items-center justify-center text-center p-4 text-muted-foreground">
            Location data not available.
        </div>
    )
  }
  
  const center = { lat, lng };

  return (
    <div className="relative h-[250px] w-full rounded-lg overflow-hidden group">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={center}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        <Marker position={center} />
      </GoogleMap>
      {address && <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-xs text-center">{address}</div>}
    </div>
  );
};

export default MapView;
