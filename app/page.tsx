// app/page.tsx
"use client"

import React from 'react';
import Header from './components/Header';
import IdeaList from './components/IdeaList';
import IdeaSubmissionForm from './components/IdeaSubmissionForm';

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Header />
      <IdeaList />
      <IdeaSubmissionForm />
    </div>
  );
}
