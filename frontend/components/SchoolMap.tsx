import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { School } from '../lib/api';

interface SchoolMapProps {
  schools: School[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

export const SchoolMap: React.FC<SchoolMapProps> = ({
  schools,
  center = { lat: 25.2854, lng: 51.5310 }, // Doha, Qatar center
  zoom = 11,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter schools with valid coordinates
  const schoolsWithCoordinates = schools.filter(
    (school) => school.latitude && school.longitude
  );

  // Load Google Maps Script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError('Google Maps API key not configured');
      return;
    }

    // Check if Google Maps is fully loaded
    const checkGoogleLoaded = () => {
      const google = (window as any).google;
      return google && google.maps && google.maps.Map;
    };

    // If already loaded, set state
    if (checkGoogleLoaded()) {
      setIsLoaded(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[data-google-maps]');
    if (existingScript) {
      // Poll until Google Maps is ready
      const pollInterval = setInterval(() => {
        if (checkGoogleLoaded()) {
          clearInterval(pollInterval);
          setIsLoaded(true);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(pollInterval);
        if (!checkGoogleLoaded()) {
          setError('Google Maps failed to initialize');
        }
      }, 10000); // 10 second timeout

      return () => clearInterval(pollInterval);
    }

    // Load script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async`;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-google-maps', 'true');

    const handleLoad = () => {
      // Poll until Google Maps API is fully initialized
      const pollInterval = setInterval(() => {
        if (checkGoogleLoaded()) {
          clearInterval(pollInterval);
          setIsLoaded(true);
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(pollInterval);
        if (!checkGoogleLoaded()) {
          setError('Google Maps failed to initialize');
        }
      }, 10000);
    };

    const handleError = () => {
      setError('Failed to load Google Maps');
    };

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
    };
  }, []);

  // Initialize map and markers
  useEffect(() => {
    if (!isLoaded || !mapRef.current || schoolsWithCoordinates.length === 0) return;

    const google = (window as any).google;
    if (!google?.maps) return;

    // Create map if not exists
    if (!googleMapRef.current) {
      googleMapRef.current = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      infoWindowRef.current = new google.maps.InfoWindow();
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Create bounds to fit all markers
    const bounds = new google.maps.LatLngBounds();

    // Add markers
    schoolsWithCoordinates.forEach((school) => {
      const position = {
        lat: school.latitude!,
        lng: school.longitude!,
      };

      const marker = new google.maps.Marker({
        position,
        map: googleMapRef.current,
        title: school.name,
        animation: google.maps.Animation.DROP,
      });

      bounds.extend(position);

      // Create info window content
      const contentString = `
        <div style="padding: 12px; max-width: 300px; font-family: system-ui, -apple-system, sans-serif;">
          <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 12px 0; color: #111827; line-height: 1.4;">
            ${school.name}
          </h3>

          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px;">
            ${
              school.curriculum
                ? `
              <div style="display: flex; align-items: start; gap: 8px;">
                <svg style="width: 16px; height: 16px; color: #2563eb; flex-shrink: 0; margin-top: 2px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div>
                  <span style="font-size: 11px; color: #6b7280; display: block;">Curriculum</span>
                  <span style="font-size: 14px; font-weight: 500; color: #374151;">${school.curriculum}</span>
                </div>
              </div>
            `
                : ''
            }

            ${
              school.type
                ? `
              <div style="display: flex; align-items: start; gap: 8px;">
                <svg style="width: 16px; height: 16px; color: #9333ea; flex-shrink: 0; margin-top: 2px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div>
                  <span style="font-size: 11px; color: #6b7280; display: block;">Type</span>
                  <span style="font-size: 14px; font-weight: 500; color: #374151;">${school.type}</span>
                </div>
              </div>
            `
                : ''
            }

            ${
              school.address
                ? `
              <div style="display: flex; align-items: start; gap: 8px;">
                <svg style="width: 16px; height: 16px; color: #16a34a; flex-shrink: 0; margin-top: 2px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <span style="font-size: 11px; color: #6b7280; display: block;">Address</span>
                  <span style="font-size: 13px; color: #374151;">${school.address}</span>
                </div>
              </div>
            `
                : ''
            }

            ${
              school.contact
                ? `
              <div style="display: flex; align-items: start; gap: 8px;">
                <svg style="width: 16px; height: 16px; color: #06b6d4; flex-shrink: 0; margin-top: 2px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <span style="font-size: 11px; color: #6b7280; display: block;">Phone</span>
                  <a href="tel:${school.contact}" style="font-size: 14px; font-weight: 500; color: #06b6d4; text-decoration: none;">
                    ${school.contact}
                  </a>
                </div>
              </div>
            `
                : ''
            }
          </div>

          <a
            href="/schools/${school.id}"
            style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 10px 16px; background: linear-gradient(to right, #2563eb, #06b6d4); color: white; font-size: 14px; font-weight: 600; border-radius: 8px; text-decoration: none; transition: all 0.2s;"
            onmouseover="this.style.boxShadow='0 10px 15px -3px rgba(0, 0, 0, 0.1)'"
            onmouseout="this.style.boxShadow='none'"
          >
            View Full Details
            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      `;

      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(contentString);
          infoWindowRef.current.open(googleMapRef.current, marker);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (schoolsWithCoordinates.length > 1) {
      googleMapRef.current.fitBounds(bounds);

      // Add padding
      const padding = { top: 50, right: 50, bottom: 50, left: 50 };
      googleMapRef.current.fitBounds(bounds, padding);
    } else if (schoolsWithCoordinates.length === 1) {
      googleMapRef.current.setCenter({
        lat: schoolsWithCoordinates[0].latitude!,
        lng: schoolsWithCoordinates[0].longitude!,
      });
      googleMapRef.current.setZoom(15);
    }
  }, [isLoaded, schoolsWithCoordinates, center, zoom]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-lg">
        <div className="text-center p-6">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 font-medium">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full min-h-[400px]" />
      {schoolsWithCoordinates.length < schools.length && (
        <div className="absolute bottom-4 left-4 bg-white px-4 py-3 rounded-lg shadow-lg border-2 border-blue-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-900">
              Showing {schoolsWithCoordinates.length} of {schools.length} schools with location data
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
