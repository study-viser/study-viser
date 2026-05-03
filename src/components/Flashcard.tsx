'use client';

import { useState } from 'react';

type FlashcardProps = {
  term: string;
  definition: string;
  courseCode: string;
};

export default function Flashcard({ term, definition, courseCode }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      className="term-card"
      onClick={() => setFlipped(!flipped)}
      style={{ textAlign: 'left' }}
    >
      <p className="term-submissions">{courseCode}</p>

      {!flipped ? (
        <>
          <h3 className="term-name">{term}</h3>
          <p>Click to reveal definition</p>
        </>
      ) : (
        <>
          <h3 className="term-name">Definition</h3>
          <p>{definition}</p>
        </>
      )}
    </button>
  );
}