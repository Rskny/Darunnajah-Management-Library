import React from "react";

export const Icons = {
  Home: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
      <path strokeWidth={2} d="M3 12l9-9 9 9v9H3z" />
    </svg>
  ),

  Books: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
      <path strokeWidth={2} d="M12 6v12M3 6v12M21 6v12" />
    </svg>
  ),

  Users: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
      <circle cx="9" cy="7" r="4" strokeWidth={2}/>
      <path strokeWidth={2} d="M2 21c1-4 5-6 7-6s6 2 7 6"/>
    </svg>
  ),

  History: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="9" strokeWidth={2}/>
      <path strokeWidth={2} d="M12 7v6l4 2"/>
    </svg>
  ),

  Upload: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
      <path strokeWidth={2} d="M12 16V4m0 0l-4 4m4-4l4 4"/>
      <path strokeWidth={2} d="M4 20h16"/>
    </svg>
  ),

  Search: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
      <circle cx="11" cy="11" r="7" strokeWidth={2}/>
      <path strokeWidth={2} d="M21 21l-4.3-4.3"/>
    </svg>
  ),
};
