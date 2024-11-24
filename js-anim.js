// Arrays with the possible widths for the elements
const widthsA1 = [132, 122, 82, 40]; // Possible widths for class a1 to h1

// Different arrays for widthsA2 based on screen size
const widthsA2_1 = [256, 192, 96, 48, 256, 192, 96, 320]; // Default
const widthsA2_2 = [256, 192, 96, 48, 192, 96]; // No 320 for max-width: 1671px
const widthsA2_3 = [192, 96, 48, 96]; // No 256 and 320 for max-width: 1403px

// Flags to control randomization for each button
let canRandomizeBeginning = true;
let canRandomizeEnd = true;

// Variables to track the current screen size category
let currentScreenCategory = 'large'; // Can be 'large', 'medium', or 'small'

// Function to generate a random number within a range
function getRandomWidth(widths) {
    return widths[Math.floor(Math.random() * widths.length)];
}

// Function to get the appropriate widthsA2 array based on screen size
function getResponsiveWidthsA2() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 1403) {
        return widthsA2_3;
    } else if (screenWidth <= 1671) {
        return widthsA2_2;
    } else {
        return widthsA2_1;
    }
}

// Function to determine the current screen category
function getScreenCategory() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 1403) {
        return 'small';
    } else if (screenWidth <= 1671) {
        return 'medium';
    } else {
        return 'large';
    }
}

// Function to update widths dynamically
function updateWidths() {
    const classPrefixes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const widthsA2 = getResponsiveWidthsA2();

    classPrefixes.forEach(prefix => {
        const element1 = document.querySelector(`.${prefix}1`);
        const element2 = document.querySelector(`.${prefix}2`);

        // Check if elements exist before updating their width
        if (element1 && element2) {
            element1.style.width = getRandomWidth(widthsA1) + 'px';
            element2.style.width = getRandomWidth(widthsA2) + 'px';
        }
    });
}

// Function to handle screen resize and update widths only if the category changes
function handleResize() {
    const newScreenCategory = getScreenCategory();
    if (newScreenCategory !== currentScreenCategory) {
        currentScreenCategory = newScreenCategory;
        console.log(`Screen category changed to: ${currentScreenCategory}`);
        updateWidths();
    }
}

// Function to handle the beginning button click
function handleBeginning() {
    console.log('Beginning button clicked');
    if (canRandomizeBeginning) {
        updateWidths();
        canRandomizeBeginning = false; // Prevent further randomizing until the end button is clicked
        canRandomizeEnd = true; // Allow end button to randomize again
    }
}

// Function to handle the end button click
function handleEnd() {
    console.log('End button clicked');
    if (canRandomizeEnd) {
        updateWidths();
        canRandomizeEnd = false; // Prevent further randomizing until the beginning button is clicked
        canRandomizeBeginning = true; // Allow beginning button to randomize again
    }
}

// Function to handle the random button click
function handleRandom() {
    console.log('Random button clicked');
    updateWidths(); // Always allow randomization
    canRandomizeBeginning = true; // Reset the flag for beginning button
    canRandomizeEnd = true; // Reset the flag for end button
}

// Add event listeners to the buttons
document.querySelector('.left-button').addEventListener('click', () => {
    updateWidths();
    canRandomizeBeginning = true; // Reset the flag for beginning button
    canRandomizeEnd = true; // Reset the flag for end button
});
document.querySelector('.right-button').addEventListener('click', () => {
    updateWidths();
    canRandomizeBeginning = true; // Reset the flag for beginning button
    canRandomizeEnd = true; // Reset the flag for end button
});
document.querySelector('.beginning').addEventListener('click', handleBeginning);
document.querySelector('.end').addEventListener('click', handleEnd);
document.querySelector('.random').addEventListener('click', handleRandom);

// Update widths on page load and when the window crosses a breakpoint
window.addEventListener('load', updateWidths);
window.addEventListener('resize', handleResize);
