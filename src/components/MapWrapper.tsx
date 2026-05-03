'use client';

import dynamic from 'next/dynamic';


type CourseMapCourse = {
  crn: number;
  code: string;
  title: string;
  location: string | null;
};

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

export default function MapWrapper({ courses }: { courses: CourseMapCourse[] }) {
  return <CourseMap courses={courses} />;
}