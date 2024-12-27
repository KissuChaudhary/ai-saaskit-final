import ImageGenerator from '@/components/dashboard/AIImageGenerator';
import React from 'react';

export default function AIImage() {
  return (
    <>
  
      <div className="min-h-screen" style={{ paddingBottom: '3rem' }}>
        <ImageGenerator />
      </div>
    </>
  );
}