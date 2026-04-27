'use client';

import { unenrollStudent } from '@/lib/dbActions';

type Props = {
  crn: number;
  userId: string;
};

export default function ExitCourseButton({ crn, userId }: Props) {
  return (
    <button
      className="course-exit-btn"
      onClick={async () => {
        if (!confirm("Leave this course?")) return;

        await unenrollStudent(crn, userId);
        window.location.reload();
      }}
    >
      X
    </button>
  );
}