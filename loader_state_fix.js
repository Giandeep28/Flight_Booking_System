// PASTE IN CONSOLE TO FIX LOADER STATE

// Force loader state to complete
window.SKYVOYAGE_LOADED = true;
window.SKYVOYAGE_LOADING = false;

// Override any loading state management
let loadingState = false;
const setLoadingState = (isLoading) => {
    loadingState = isLoading;
    const loader = document.getElementById('loader');
    if (!isLoading && loader) {
        loader.remove();
        console.log('Loader removed via state management');
    }
};

// Force complete
setLoadingState(false);

console.log('Loader state forced to complete.');
