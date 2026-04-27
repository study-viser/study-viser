import Link from "next/link";
import "./contact.css";

export default function TeamPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>StudyViser Team</h1>

      <section style={{ marginTop: '2rem' }}>
        <h2>Address</h2>
        <p>Post 319</p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Members</h2>
        <ul>
          <li>Asano, Noah</li>
          <li>Gillan, Michaela</li>
          <li>Kim, Seonwoo</li>
          <li>Valera, Khloe</li>
          <li>Wong, Marie</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Organization</h2>
        <Link href="https://github.com/study-viser" target="_blank">
          Study-Viser GitHub Organization
        </Link>
      </section>
    </main>
  );
}