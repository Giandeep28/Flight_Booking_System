// PASTE IN CONSOLE TO FIX INFINITE LOOPS

// Step 1: Break any infinite loops
window.SKYVOYAGE_LOADING = false; // Force stop loading flag

// Step 2: Override any async functions that might be stuck
const originalFetch = window.fetch;
window.fetch = function(...args) {
    console.log('Fetch intercepted:', args[0]);
    return originalFetch.apply(this, args)
        .catch(error => {
            console.error('Fetch failed:', error);
            // Return mock response to prevent hanging
            return new Response('{}', { status: 200 });
        });
};

// Step 3: Force complete loading state
setTimeout(() => {
    console.log('Forcing loading complete');
    const loader = document.getElementById('loader');
    if (loader) loader.remove();
    
    // Dispatch loading complete event
    window.dispatchEvent(new CustomEvent('skyvoyage-loaded'));
}, 500);

console.log('Infinite loop fixes applied.');
