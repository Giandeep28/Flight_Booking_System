'use client';

import { useEffect } from 'react';

export default function PageLoader() {
  useEffect(() => {
    const t = setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 500);
      }
    }, 600);
    return () => clearTimeout(t);
  }, []);
  return null;
}
