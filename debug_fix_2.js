// PASTE IN CONSOLE TO FIX MISSING LOADER

// Step 1: Check if loader exists
const loader = document.getElementById('loader');
console.log('Loader found:', loader);

// Step 2: Remove all loader elements (multiple methods)
document.getElementById('loader')?.remove();
document.querySelector('.loader')?.remove();
document.querySelectorAll('[class*="loader"]').forEach(el => el.remove());

// Step 3: Force show main content
document.body.style.display = 'block';
document.body.style.opacity = '1';

console.log('Loader elements removed. Content should be visible.');
