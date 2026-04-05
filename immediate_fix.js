// PASTE THIS IN CONSOLE FOR IMMEDIATE LOADER REMOVAL
console.log('Force removing loader...');

// Method 1: Direct removal
const loader = document.getElementById('loader');
if (loader) {
    loader.remove();
    console.log('Loader removed directly');
}

// Method 2: Hide loader
const loaders = document.querySelectorAll('.loader');
loaders.forEach(el => {
    el.style.display = 'none';
    console.log('Hidden loader element');
});

// Method 3: Remove all loading screens
document.querySelectorAll('[class*="loader"]').forEach(el => el.remove());
console.log('All loading elements removed');
