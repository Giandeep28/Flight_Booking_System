// PASTE IN CONSOLE TO FIX TIMEOUT ISSUES

// Step 1: Force immediate loader removal (bypass setTimeout)
const loader = document.getElementById('loader');
if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 100); // Faster timeout
}

// Step 2: Override window.load to ensure it fires
window.addEventListener('load', function() {
    console.log('Window load event fired (override)');
    const loader = document.getElementById('loader');
    if (loader) {
        loader.remove();
        console.log('Loader removed on load event');
    }
}, { once: true });

// Step 3: Manual trigger if load event doesn't fire
setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
        console.log('Manual loader removal (timeout backup)');
        loader.remove();
    }
}, 2000);

console.log('Timeout fixes applied.');
