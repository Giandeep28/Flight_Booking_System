// PASTE IN CONSOLE TO FIX JAVASCRIPT ERRORS

// Step 1: Force remove loader immediately
const loader = document.getElementById('loader');
if (loader) {
    console.log('Removing loader...');
    loader.remove();
}

// Step 2: Fix common errors
window.currentUser = null; // Reset user state
localStorage.removeItem('skyVoyageUser'); // Clear corrupted data

// Step 3: Re-initialize safely
try {
    if (typeof initAuth === 'function') {
        initAuth();
        console.log('Auth re-initialized');
    }
} catch (error) {
    console.error('Auth init failed:', error);
}

console.log('JavaScript errors fixed. Page should load now.');
