// PASTE THIS IN CONSOLE TO TEST LOADER REMOVAL
console.log('Testing loader removal...');

// Force remove loader after 2 seconds
setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
        console.log('Found loader, removing...');
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
            console.log('Loader removed successfully!');
        }, 500);
    } else {
        console.error('Loader element not found!');
    }
}, 2000);

// Test currentUser state
console.log('Current user:', currentUser);
console.log('Loader element:', document.getElementById('loader'));
