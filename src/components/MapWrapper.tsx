'use client';

import dynamic from 'next/dynamic';

// Move the dynamic import here. 
// Now it's inside a Client Component ('use client'), so ssr: false is allowed.
const CourseMap = dynamic(() => import('./CourseMap'), { 
  ssr: false,
  loading: () => (
    <div style={{ height: '100%', width: '100%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading Map...
    </div>
  )
});

export default function MapWrapper({ courses }: { courses: any[] }) {
  return <CourseMap courses={courses} />;
}