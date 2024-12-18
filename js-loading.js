// Function to check if the image inside .media-container is loaded
function checkImageLoaded() {
    // Select the media-container and its image
    const mediaContainer = document.querySelector('.media-container');
    const image = mediaContainer ? mediaContainer.querySelector('img') : null;

    // Select the loading-box
    const loadingBox = document.querySelector('.loading-box');

    if (image && window.getComputedStyle(image).display === 'block') {
        // Add onload event to the image
        image.onload = function () {
            // Hide the loading-box when the image is fully loaded
            if (loadingBox) {
                loadingBox.style.display = 'none';
            }
        };

        // If the image hasn't loaded yet, show the loading-box
        if (!image.complete) {
            if (loadingBox) {
                loadingBox.style.display = 'flex';
            }
        } else {
            // If already loaded, ensure loading-box is hidden
            if (loadingBox) {
                loadingBox.style.display = 'none';
            }
        }
    } else {
        // If no valid image, ensure loading-box is hidden
        if (loadingBox) {
            loadingBox.style.display = 'none';
        }
    }
}

// Run the check on window load
window.addEventListener('load', checkImageLoaded);

// Optional: Re-run on DOM changes (e.g., if images are dynamically added)
new MutationObserver(checkImageLoaded).observe(document.body, { childList: true, subtree: true });
