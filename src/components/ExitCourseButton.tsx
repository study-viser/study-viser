'use client';

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

          const res = await fetch('/api/courses/exit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ crn, userId }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error);
          }
        window.location.reload();
      }}
    >
      X
    </button>
  );
}