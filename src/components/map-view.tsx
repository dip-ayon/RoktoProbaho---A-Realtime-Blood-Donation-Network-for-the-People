'use client';

import * as React from 'react';

type MapViewProps = {
  lat: number;
  lng: number;
  zoom?: number;          // default 14
  height?: number | string; // default 250
  className?: string;
  rounded?: boolean;      // default true
};

export default function MapView({
  lat,
  lng,
  zoom = 14,
  height = 250,
  className = '',
  rounded = true,
}: MapViewProps) {
  // Basic validation to avoid empty/NaN if lat/lng missing
  const hasCoords =
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng);

  if (!hasCoords) {
    return (
      <div
        className={`w-full flex items-center justify-center bg-muted text-muted-foreground ${
          rounded ? 'rounded-lg' : ''
        } ${className}`}
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        📍 Map unavailable — missing coordinates
      </div>
    );
  }

  // No API key required: standard embed works fine for display
  const src = `https://www.google.com/maps?q=${encodeURIComponent(
    `${lat},${lng}`
  )}&z=${encodeURIComponent(String(zoom))}&output=embed`;

  return (
    <div
      className={`${rounded ? 'rounded-lg overflow-hidden' : ''} ${className}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
      aria-label="Map view"
    >
      <iframe
        title="map"
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
