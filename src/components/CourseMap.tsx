'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { buildingCoords, MANOA_CENTER } from '@/lib/manoaData';

// Fix for default Leaflet icon missing
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

type CourseMapCourse = {
  crn: number;
  code: string;
  title: string;
  location: string | null;
};

export default function CourseMap({ courses }: { courses: CourseMapCourse[] }) {
  return (
    <MapContainer 
      center={MANOA_CENTER} 
      zoom={16} 
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {courses.map((course) => {
        // 1. Skip if location is missing or set to TBD
        if (!course.location || course.location.toUpperCase() === 'TBD') return null;

        // 2. Extract building code (e.g., "POST" from "POST 319") and normalize
        const bldgKey = course.location.trim().split(' ')[0].toUpperCase();
        
        // 3. Look up coordinates from your manoaData.ts
        const coords = buildingCoords[bldgKey];
        
        if (!coords) {
          console.warn(`No coordinates found for building code: ${bldgKey}`);
          return null;
        }

        return (
          <Marker key={course.crn} position={coords}>
            <Popup>
              <div style={{ fontFamily: 'sans-serif' }}>
                <strong style={{ color: '#003366', fontSize: '14px' }}>{course.code}</strong><br />
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{course.location}</span><br />
                <span style={{ fontSize: '12px', color: '#666' }}>{course.title}</span>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}