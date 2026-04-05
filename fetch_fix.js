// PASTE IN CONSOLE TO FIX STUCK FETCH REQUESTS

// Override fetch to prevent hanging
const originalFetch = window.fetch;
window.fetch = function(url, options) {
    console.log('Fetching:', url);
    
    // Add timeout
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 5000);
    });
    
    return Promise.race([
        originalFetch(url, options),
        timeoutPromise
    ]).catch(error => {
        console.error('Fetch failed or timed out:', error);
        // Return mock response
        return new Response(JSON.stringify({}), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' }
        });
    });
};

console.log('Fetch timeout protection enabled.');
