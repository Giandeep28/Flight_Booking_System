// PASTE THIS IN CONSOLE TO ADD DEBUGGING
console.log('=== STARTING LOADER DEBUG ===');

// Override initAuth to add debugging
const originalInitAuth = window.initAuth;
window.initAuth = function() {
    console.log('initAuth() called');
    console.log('savedUser:', localStorage.getItem('skyVoyageUser'));
    
    try {
        originalInitAuth.call(this);
        console.log('initAuth() completed successfully');
    } catch (error) {
        console.error('initAuth() failed:', error);
        // Force remove loader on error
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) loader.remove();
        }, 100);
    }
};

// Override loader removal to add debugging
const originalLoadHandler = window.onload;
window.addEventListener('load', function() {
    console.log('Window load event fired');
    setTimeout(() => {
        console.log('Loader removal timeout triggered');
        const loader = document.getElementById('loader');
        if (loader) {
            console.log('Loader found, removing...');
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
                console.log('Loader removed successfully!');
            }, 500);
        } else {
            console.error('Loader element not found!');
        }
    }, 1500);
});

console.log('=== DEBUGGING LOADED ===');
