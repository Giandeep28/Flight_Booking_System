// PASTE IN CONSOLE TO FIX ASYNC ISSUES

// Override setTimeout to prevent hanging
const originalSetTimeout = window.setTimeout;
window.setTimeout = function(callback, delay) {
    if (delay > 10000) { // Cap at 10 seconds
        console.warn('Timeout too long, capping at 10 seconds');
        delay = 10000;
    }
    return originalSetTimeout(callback, delay);
};

// Force resolve any hanging promises
Promise.resolve().then(() => {
    console.log('Forcing async resolution...');
    const loader = document.getElementById('loader');
    if (loader) {
        loader.remove();
    }
});

// Add timeout to any async operation
const withTimeout = (promise, timeout = 5000) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Operation timeout')), timeout)
        )
    ]);
};

console.log('Async timeout protection enabled.');
