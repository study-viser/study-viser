"use client";
 
import { useState } from "react";
import Image from "next/image";
import "./globals.css"; 
 
export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <main className="min-h-screen bg-white font-sans overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="hero">
        {/* Search Bar */}
        <div className="search-bar-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="search-bar"
            placeholder="Search for courses"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
 
        {/* Headline + CTA */}
        <div className="hero-content">
          <h1 className="hero-headline">
            Earn Credit. Build Knowledge.<br />
            Learn Better Together.
          </h1>
          <button className="visit-btn">Visit Courses</button>
        </div>
 
        {/* Triangle Background */}
        <div className="wave-section">
          <svg viewBox="0 0 1440 480" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
            {/* Back triangle - lightest */}
            <polygon points="0,280 1440,160 1440,480 0,480" fill="#c8e6d0" opacity="0.55"/>
            {/* Mid triangle */}
            <polygon points="0,320 1440,200 1440,480 0,480" fill="#4a9b65" opacity="0.7"/>
            {/* Front triangle - darkest */}
            <polygon points="0,370 1440,250 1440,480 0,480" fill="#1a4a2e"/>
          </svg>
        </div>
 
        {/* Sitting Figure SVG */}
        <div className="figure-wrapper">
          <div className="figure-wrapper">
            <Image
              src="/sittingLady.png"
              alt="Student sitting at laptop"
              width={260}
              height={400}
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </section>

    </main>
  );
}
 