import React, { useEffect, useRef } from 'react';

type GoogleMapProps = {
  lat: number;
  lng: number;
  zoom?: number;
  className?: string;
};

export const GoogleMap: React.FC<GoogleMapProps> = ({ lat, lng, zoom = 16, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkGoogleLoaded = () => {
      const g = (window as any).google;
      return g && g.maps && g.maps.Map;
    };

    const initMap = () => {
      const g = (window as any).google;
      if (!g || !g.maps || !g.maps.Map || !containerRef.current) return;

      mapRef.current = new g.maps.Map(containerRef.current, {
        center: { lat, lng },
        zoom,
        disableDefaultUI: false,
      });

      markerRef.current = new g.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
      });
    };

    // If already loaded, initialize immediately
    if (checkGoogleLoaded()) {
      initMap();
      return;
    }

    // Check if script already exists
    const existing = document.querySelector(`script[data-google-maps]`);
    if (existing) {
      // Poll until Google Maps is ready
      const pollInterval = setInterval(() => {
        if (checkGoogleLoaded()) {
          clearInterval(pollInterval);
          initMap();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(pollInterval);
      }, 10000); // 10 second timeout

      return () => clearInterval(pollInterval);
    }

    // Load script
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async`;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-google-maps', 'true');

    const handleLoad = () => {
      // Poll until Google Maps API is fully initialized
      const pollInterval = setInterval(() => {
        if (checkGoogleLoaded()) {
          clearInterval(pollInterval);
          initMap();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(pollInterval);
      }, 10000);
    };

    script.addEventListener('load', handleLoad);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', handleLoad);
    };
  }, [lat, lng, zoom]);

  return <div ref={containerRef} className={className || 'w-full h-48 rounded'} />;
};

export default GoogleMap;
