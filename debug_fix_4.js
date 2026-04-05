// PASTE IN CONSOLE TO FIX EVENT LISTENER ISSUES

// Step 1: Check if load event is attached
console.log('Window.onload:', window.onload);

// Step 2: Force attach new load listener
window.addEventListener('load', function() {
    console.log('Load event triggered (forced listener)');
    
    // Remove loader immediately
    const loader = document.getElementById('loader');
    if (loader) {
        loader.remove();
        console.log('Loader removed by forced listener');
    }
    
    // Initialize auth if needed
    if (typeof initAuth === 'function') {
        try {
            initAuth();
        } catch (error) {
            console.error('Auth init failed:', error);
        }
    }
});

// Step 3: Manual trigger if page already loaded
if (document.readyState === 'complete') {
    console.log('Page already loaded, triggering manually');
    window.dispatchEvent(new Event('load'));
}

console.log('Event listener fixes applied.');
