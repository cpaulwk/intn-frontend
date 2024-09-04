// app/layout.tsx
import './globals.css';
import React from 'react';

export const metadata = {
  title: 'I Need That Now',
  description: 'Submit and vote for business ideas!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}
