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

// Flag to control randomization for the go-to button
let canRandomizeGoTo = true;

// Variable to track the last index used
let lastIndex = null;

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
    if (window.innerWidth <= 827) return; // Disable script for max-width: 827px

    const classPrefixes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    const widthsA2 = getResponsiveWidthsA2();

    classPrefixes.forEach(prefix => {
        const element1 = document.querySelector(`.${prefix}1`);
        const element2 = document.querySelector(`.${prefix}2`);

        if (element1 && element2) {
            const randomWidth1 = getRandomWidth(widthsA1);
            const randomWidth2 = getRandomWidth(widthsA2);

            element1.dataset.width = randomWidth1;
            element2.dataset.width = randomWidth2;
        }
    });
    adjustWidths();
}

// Function to adjust widths on resize
function adjustWidths() {
    const classPrefixes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    
    classPrefixes.forEach(prefix => {
        const element1 = document.querySelector(`.${prefix}1`);
        const element2 = document.querySelector(`.${prefix}2`);

        if (element1 && element2) {
            const parent1 = element1.parentElement;
            const parent2 = element2.parentElement;
            
            const width1 = parseInt(element1.dataset.width, 10) || 0;
            const width2 = parseInt(element2.dataset.width, 10) || 0;
            
            const imaginaryWidth1 = width1 + 12;
            const imaginaryWidth2 = width2 + 12;
            
            element1.style.width = (imaginaryWidth1 >= parent1.clientWidth) ? 'calc(100% - 2px)' : width1 + 'px';
            element2.style.width = (imaginaryWidth2 >= parent2.clientWidth) ? 'calc(100% - 2px)' : width2 + 'px';
        }
    });
}

// Function to handle screen resize and update widths only if the category changes
function handleResize() {
    if (window.innerWidth <= 827) return; // Disable script for max-width: 827px
    
    const newScreenCategory = getScreenCategory();
    if (newScreenCategory !== currentScreenCategory) {
        currentScreenCategory = newScreenCategory;
        console.log(`Screen category changed to: ${currentScreenCategory}`);
        updateWidths();
    }
    adjustWidths();
}

// Update widths on page load and adjust on window resize
window.addEventListener('load', updateWidths);
window.addEventListener('resize', handleResize);

// Function to handle the beginning button click
function handleBeginning() {
    if (canRandomizeBeginning) {
        updateWidths();
        canRandomizeBeginning = false; // Prevent further randomizing until the end button is clicked
        canRandomizeEnd = true; // Allow end button to randomize again
        canRandomizeGoTo = true; // Allow go-to button to randomize again
    }
}

// Function to handle the end button click
function handleEnd() {
    if (canRandomizeEnd) {
        updateWidths();
        canRandomizeEnd = false; // Prevent further randomizing until the beginning button is clicked
        canRandomizeBeginning = true; // Allow beginning button to randomize again
        canRandomizeGoTo = true; // Allow go-to button to randomize again
    }
}

// Function to handle the random button click
function handleRandom() {
    updateWidths(); // Always allow randomization
    canRandomizeBeginning = true; // Reset the flag for beginning button
    canRandomizeEnd = true; // Reset the flag for end button
    canRandomizeGoTo = true; // Allow go-to button to randomize again
}

// Function to handle the go-to button click
function handleGoTo() {
    const currentIndex = document.querySelector('.index').value; // Assuming the index is stored in an input field

    if (currentIndex !== lastIndex) {
        updateWidths(); // Randomize only if the index has changed
        lastIndex = currentIndex; // Update the last index
    }

    canRandomizeGoTo = false; // Prevent further randomizing until another button is clicked
    canRandomizeBeginning = true; // Reset the flag for beginning button
    canRandomizeEnd = true; // Reset the flag for end button
}

// Add event listener to the input element with class 'index' for Enter key
document.querySelector('.index').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleGoTo();
    }
});

// Add event listeners to the buttons
document.querySelector('.main-nav #previous').addEventListener('click', () => {
    updateWidths();
    canRandomizeBeginning = true; // Reset the flag for beginning button
    canRandomizeEnd = true; // Reset the flag for end button
});
document.querySelector('.main-nav #next').addEventListener('click', () => {
    updateWidths();
    canRandomizeBeginning = true; // Reset the flag for beginning button
    canRandomizeEnd = true; // Reset the flag for end button
});
document.querySelector('#beginning').addEventListener('click', handleBeginning);
document.querySelector('#end').addEventListener('click', handleEnd);
document.querySelector('#random').addEventListener('click', handleRandom);
document.querySelector('#go-to').addEventListener('click', handleGoTo);

// Update widths on page load and when the window crosses a breakpoint
window.addEventListener('load', updateWidths);
window.addEventListener('resize', handleResize);
