import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Link from 'next/link';
import { School } from '../lib/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface SchoolMapProps {
  schools: School[];
  center?: [number, number];
  zoom?: number;
}

export const SchoolMap: React.FC<SchoolMapProps> = ({
  schools,
  center = [25.2854, 51.531], // Doha, Qatar center
  zoom = 12,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  // Only render map on client side to avoid SSR issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-gray-600">Loading map...</div>
      </div>
    );
  }

  // Filter schools with valid coordinates
  const schoolsWithCoordinates = schools.filter(
    (school) => school.latitude && school.longitude
  );

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {schoolsWithCoordinates.map((school) => (
          <Marker
            key={school.id}
            position={[school.latitude!, school.longitude!]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-base mb-2">{school.name}</h3>
                {school.curriculum && (
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Curriculum:</strong> {school.curriculum}
                  </p>
                )}
                {school.type && (
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Type:</strong> {school.type}
                  </p>
                )}
                {school.address && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Address:</strong> {school.address}
                  </p>
                )}
                <Link
                  href={`/schools/${school.id}`}
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  View Details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {schoolsWithCoordinates.length < schools.length && (
        <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md text-sm text-gray-600">
          Showing {schoolsWithCoordinates.length} of {schools.length} schools with location data
        </div>
      )}
    </div>
  );
};
