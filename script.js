document.addEventListener('DOMContentLoaded', function () {
  const mediaItems = document.querySelectorAll('.media img, .media video');
  const timestamps = document.querySelectorAll('.timestamp span');
  const likes = document.querySelectorAll('.like span');
  const comments = document.querySelectorAll('.comment span');
  const postContents = document.querySelectorAll('.content span');
  const noContentElement = document.querySelector('.noContent');
  const buttonSidebar = document.querySelector('.sidebar');
  let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;

  const mediaOffset = 3; // Define the range of adjacent media to preload

  // Step 1: Randomize a pre-defined random index at initial page load
  let preGeneratedRandomIndex = Math.floor(Math.random() * timestamps.length);

  // Preload the first, last, and pre-defined random index
  preloadMediaAtIndex(0); // First media item
  preloadMediaAtIndex(timestamps.length - 1); // Last media item
  preloadMediaAtIndex(preGeneratedRandomIndex); // Pre-defined random index

  // Preload adjacent media around the current active index
  preloadAdjacentMedia(currentIndex);

  function preloadMediaAtIndex(index) {
    if (index >= 0 && index < timestamps.length) {
      const timestamp = timestamps[index];
      const mediaClass = timestamp.className;
      const mediaItem = Array.from(mediaItems).find(media => media.classList.contains(mediaClass) && !media.classList.contains('sub-post'));

      if (mediaItem) {
        if (mediaItem.tagName.toLowerCase() === 'video') {
          const source = mediaItem.querySelector('source[data-src]');
          if (source && source.dataset.src) {
            source.src = source.dataset.src;
            source.removeAttribute('data-src');
            mediaItem.load(); // Load the video after setting the src
          }
        } else if (mediaItem.dataset.src) {
          mediaItem.src = mediaItem.dataset.src;
          mediaItem.removeAttribute('data-src');
        }
      }
    }
  }

  function preloadAdjacentMedia(index) {
    const start = index - mediaOffset;
    const end = index + mediaOffset;
    for (let i = start; i <= end; i++) {
      const idx = (i + timestamps.length) % timestamps.length; // Ensure wrap-around
      preloadMediaAtIndex(idx);
    }
  }

  console.log(`Page loaded. Index: ${currentIndex + 1}`); // Log current index on page load

  const timestampMediaMap = {};
  timestamps.forEach((timestamp, index) => {
    const className = timestamp.className;
    timestampMediaMap[className] = index;
  });

  let mediaHeight, mediaWidth;

  function calculateMediaDistanceBottom() {
    const mediaContainer = document.querySelector('.media');
    const visibleMedia = Array.from(mediaContainer.children).find(item => window.getComputedStyle(item).display === 'block');

    if (!visibleMedia) return 0;

    const viewportHeight = window.innerHeight;
    const mediaBottomPosition = visibleMedia.getBoundingClientRect().bottom;

    return parseFloat((viewportHeight - mediaBottomPosition - 76).toFixed(6));
  }

  function calculateMediaDistanceTop() {
    const mediaContainer = document.querySelector('.media');
    const visibleMedia = Array.from(mediaContainer.children).find(item => window.getComputedStyle(item).display === 'block');

    if (!visibleMedia) return 0;

    const mediaTopPosition = visibleMedia.getBoundingClientRect().top;

    return parseFloat((mediaTopPosition - 52).toFixed(6));
  }

  function updateButtonSidebarHeight() {
    if (window.matchMedia("(max-width: 827px)").matches) {
      const displayedMedia = Array.from(mediaItems).find(item => window.getComputedStyle(item).display === 'block');
      if (displayedMedia) {
        mediaHeight = parseFloat(displayedMedia.getBoundingClientRect().height.toFixed(6));
        mediaWidth = parseFloat(displayedMedia.getBoundingClientRect().width.toFixed(6));
        buttonSidebar.style.height = `${mediaHeight}px`;
      }
    } else {
      buttonSidebar.style.height = '';
    }
  }

  function adjustButtonSidebarPosition() {
    if (window.matchMedia("(max-width: 827px)").matches) {
      const mediaContainer = document.querySelector('.media');
      if (!mediaContainer || !mediaHeight) return;

      const displayedMedia = Array.from(mediaContainer.children).find(item => window.getComputedStyle(item).display === 'block');
      if (!displayedMedia) return;

      const mediaContainerWidth = mediaContainer.clientWidth;
      const mediaContainerHeight = mediaContainer.clientHeight;
      const mediaWidth = displayedMedia.clientWidth;

      const translateY = parseFloat(((mediaContainerHeight - mediaHeight) / 2).toFixed(6));
      const translateX = parseFloat(((mediaContainerWidth - mediaWidth) / 2).toFixed(6));

      buttonSidebar.style.transform = `translate(${translateX}px, ${translateY}px)`;
    } else {
      buttonSidebar.style.transform = '';
    }
  }

  function updateContentContainerPosition() {
    const mediaDistanceBottom = calculateMediaDistanceBottom();
    document.querySelectorAll('.content-island').forEach(container => {
      container.style.bottom = `${mediaDistanceBottom.toFixed(6)}px`;
    });
  }

  function updateContentContainerWidth() {
    let adjustedMediaWidth = parseFloat(mediaWidth.toFixed(6));

    if (buttonSidebar.style.display === 'block') {
      adjustedMediaWidth += 24;
    }

    if (adjustedMediaWidth) {
      document.querySelectorAll('.content-island').forEach(container => {
        container.style.width = `${adjustedMediaWidth.toFixed(6)}px`;
      });
    }
  }

  function adjustContentContainerPosition() {
    const mediaContainer = document.querySelector('.media');
    const displayedMedia = Array.from(mediaContainer.children).find(item => window.getComputedStyle(item).display === 'block');

    if (mediaContainer && displayedMedia) {
        const mediaContainerWidth = mediaContainer.clientWidth;
        const displayedMediaWidth = displayedMedia.clientWidth;

        // Calculate the translateX value based on the difference in widths
        const translateX = parseFloat(((mediaContainerWidth - displayedMediaWidth) / 2).toFixed(6));

        // Apply the calculated translateX to the transform property
        document.querySelectorAll('.content-island, .handle').forEach(element => {
            element.style.transform = `translate(${translateX}px)`;
        });
    } else {
        // Reset transform if conditions are not met
        document.querySelectorAll('.content-island, .handle').forEach(element => {
            element.style.transform = '';
        });
    }
  }

  function updateMobileHandlePosition() {
    const mediaDistanceTop = calculateMediaDistanceTop();
    document.querySelectorAll('.handle').forEach(handle => {
      handle.style.top = `${mediaDistanceTop.toFixed(6)}px`;
    });
  }

  function updateFooterWidth() {
    const contentContainer = document.querySelector('.content-island');
    const footer = document.querySelector('.footer');
    if (contentContainer && footer) {
      const contentContainerWidth = parseFloat(window.getComputedStyle(contentContainer).width);
      footer.style.width = `${(contentContainerWidth - 26).toFixed(6)}px`;
    }
  }

  function updateAllPositions() {
    if (window.innerWidth <= 827) {
      updateContentContainerPosition();
      updateMobileHandlePosition();
      updateButtonSidebarHeight();
      updateContentContainerWidth();
      adjustButtonSidebarPosition();
      adjustContentContainerPosition();
    } else {
      document.querySelectorAll('.content-island, .handle').forEach(element => {
        element.style.bottom = '';
        element.style.width = '';
        element.style.transform = '';
      });
      document.querySelectorAll('.handle').forEach(handle => {
        handle.style.top = '';
      });
      buttonSidebar.style.height = '';
      buttonSidebar.style.transform = '';
    }
    updateFooterWidth();
  }

  let opacitySet = false; // Flag to track if opacity has been set

  function updateMedia() {
    const currentTimestamp = timestamps[currentIndex];
    if (currentTimestamp) {
      timestamps.forEach((timestamp) => timestamp.removeAttribute('style'));
      currentTimestamp.style.display = 'block';
    }
  
    // Update the current index display
    document.querySelector('.current-index span').textContent = currentIndex + 1;
  
    mediaItems.forEach((item) => {
      if (item.tagName.toLowerCase() === 'video') {
        item.pause();
        item.currentTime = 0;
      }
      item.removeAttribute('style'); // Remove any inline display styling
    });
  
    likes.forEach(like => like.removeAttribute('style'));
    comments.forEach(comment => comment.removeAttribute('style'));
    postContents.forEach(content => content.removeAttribute('style'));
    noContentElement.removeAttribute('style');
  
    const mediaClass = currentTimestamp.className;
    const mediaIndex = Array.from(mediaItems).findIndex(media => media.classList.contains(mediaClass) && !media.classList.contains('sub-post'));
  
    if (mediaIndex !== -1) {
      const currentMedia = mediaItems[mediaIndex];
      currentMedia.style.display = 'block';
  
      const handleMediaLoad = () => {
        if (!opacitySet) { // Check if opacity has already been set
          updateAllPositions();
          document.querySelector('.main').style.opacity = '1';
          document.querySelectorAll('.main-nav').forEach(nav => nav.style.opacity = '1');
          opacitySet = true; // Set the flag to true
        }
        currentMedia.removeEventListener('load', handleMediaLoad);
        currentMedia.removeEventListener('loadeddata', handleMediaLoad);
      };
  
      if (currentMedia.tagName.toLowerCase() === 'video') {
        currentMedia.volume = 0.15;
        currentMedia.play();
        currentMedia.addEventListener('loadeddata', () => {
          updateAllPositions(); // Call updateAllPositions when video is fully loaded
          handleMediaLoad();
        });
      } else {
        currentMedia.addEventListener('load', handleMediaLoad);
      }
  
      updateAllPositions();
  
      // Check for affixed media
      const affixItems = Array.from(mediaItems).filter(item => item.classList.contains(mediaClass) && item.dataset.affix);
      if (affixItems.length > 0) {
        buttonSidebar.style.display = 'block';
      } else {
        buttonSidebar.removeAttribute('style');
      }
  
      const timestampClass = currentTimestamp.className;
      const likeElement = Array.from(likes).find(like => like.classList.contains(timestampClass));
      const commentElement = Array.from(comments).find(comment => comment.classList.contains(timestampClass));
      const postContentElements = Array.from(postContents).filter(content => content.classList.contains(timestampClass));
  
      if (likeElement) {
        likeElement.style.display = 'block';
        document.querySelectorAll('.like .wrapper .noData').forEach(el => el.removeAttribute('style'));
      } else {
        document.querySelectorAll('.like .wrapper .noData').forEach(el => el.style.display = 'block');
      }
  
      if (commentElement) {
        commentElement.style.display = 'block';
        document.querySelectorAll('.comment .wrapper .noData').forEach(el => el.removeAttribute('style'));
      } else {
        document.querySelectorAll('.comment .wrapper .noData').forEach(el => el.style.display = 'block');
      }
  
      if (postContentElements.length > 0) {
        postContentElements.forEach(content => content.style.display = 'block');
        noContentElement.removeAttribute('style');
      } else {
        noContentElement.style.display = 'block';
      }
    }
  
    // Preload adjacent media around the current index
    preloadAdjacentMedia(currentIndex);
  }

  function preloadAffixedMedia(index) {
    const timestamp = timestamps[index];
    const affixItems = Array.from(mediaItems).filter(item => item.classList.contains(timestamp.className) && item.dataset.affix);
    affixItems.forEach(item => {
      if (item.dataset.src) {
        item.src = item.dataset.src;
        item.removeAttribute('data-src');
      }
    });
  }

  // Event listeners for buttons
  document.querySelector('#random').addEventListener('click', function () {
    currentIndex = preGeneratedRandomIndex;
    localStorage.setItem('currentIndex', currentIndex);
    updateMedia();
    updateAllPositions();
    preloadAffixedMedia(currentIndex);

    preGeneratedRandomIndex = Math.floor(Math.random() * timestamps.length);
    preloadMediaAtIndex(preGeneratedRandomIndex);
  });

  document.querySelector('.main-nav #next').addEventListener('click', function () {
    currentIndex = (currentIndex + 1) % timestamps.length;
    localStorage.setItem('currentIndex', currentIndex);
    updateMedia();
    updateAllPositions();
    preloadAffixedMedia(currentIndex);
  });

  document.querySelector('.main-nav #previous').addEventListener('click', function () {
    currentIndex = (currentIndex - 1 + timestamps.length) % timestamps.length;
    localStorage.setItem('currentIndex', currentIndex);
    updateMedia();
    updateAllPositions();
    preloadAffixedMedia(currentIndex);
  });

  document.querySelector('#beginning').addEventListener('click', function () {
    currentIndex = 0;
    localStorage.setItem('currentIndex', currentIndex);
    updateMedia();
    updateAllPositions();
    preloadAffixedMedia(currentIndex);
  });

  document.querySelector('#end').addEventListener('click', function () {
    currentIndex = timestamps.length - 1;
    localStorage.setItem('currentIndex', currentIndex);
    updateMedia();
    updateAllPositions();
    preloadAffixedMedia(currentIndex);
  });

  document.querySelector('.sidebar #next').addEventListener('click', function () {
    const currentTimestamp = timestamps[currentIndex].className;
    const affixItems = Array.from(mediaItems).filter(item => item.classList.contains(currentTimestamp) && item.dataset.affix);
    let currentAffixIndex = affixItems.findIndex(item => item.style.display === 'block');

    if (currentAffixIndex !== -1 && currentAffixIndex < affixItems.length - 1) {
      currentAffixIndex++;
    } else {
      currentAffixIndex = 0;
    }

    affixItems.forEach(item => {
      if (item.tagName.toLowerCase() === 'video') {
        item.pause();
        item.currentTime = 0;
      }
      item.removeAttribute('style');
    });

    const nextMedia = affixItems[currentAffixIndex];
    nextMedia.style.display = 'block';

    if (nextMedia.tagName.toLowerCase() === 'video') {
      nextMedia.volume = 0.15;
      nextMedia.play();
    }

    console.log(`Right`); // Log current index on sub-right button click
    updateAllPositions();
  });

  document.querySelector('.sidebar #previous').addEventListener('click', function () {
    const currentTimestamp = timestamps[currentIndex].className;
    const affixItems = Array.from(mediaItems).filter(item => item.classList.contains(currentTimestamp) && item.dataset.affix);
    let currentAffixIndex = affixItems.findIndex(item => item.style.display === 'block');

    if (currentAffixIndex > 0) {
      currentAffixIndex--;
    } else {
      currentAffixIndex = affixItems.length - 1;
    }

    affixItems.forEach(item => {
      if (item.tagName.toLowerCase() === 'video') {
        item.pause();
        item.currentTime = 0;
      }
      item.removeAttribute('style');
    });

    const prevMedia = affixItems[currentAffixIndex];
    prevMedia.style.display = 'block';

    if (prevMedia.tagName.toLowerCase() === 'video') {
      prevMedia.volume = 0.15;
      prevMedia.play();
    }

    console.log(`Left`); // Log current index on sub-left button click
    updateAllPositions();
  });

  document.querySelector('#go-to').addEventListener('click', function () {
    const indexInput = document.querySelector('.index').value;
    const index = parseInt(indexInput, 10);

    if (!isNaN(index) && index >= 1 && index <= timestamps.length) {
      currentIndex = index - 1;
      localStorage.setItem('currentIndex', currentIndex);
      console.log(`Go-to: ${currentIndex + 1}`); // Log current index on go-to button click
      updateMedia();
      updateAllPositions();
      preloadAffixedMedia(currentIndex);
    }
  });

  document.querySelector('.index').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      const indexInput = document.querySelector('.index').value;
      const index = parseInt(indexInput, 10);

      if (!isNaN(index) && index >= 1 && index <= timestamps.length) {
        currentIndex = index - 1;
        localStorage.setItem('currentIndex', currentIndex);
        console.log(`Key pressed. Index: ${currentIndex + 1}`); // Log current index on enter key press
        updateMedia();
        updateAllPositions();
        preloadAffixedMedia(currentIndex);
      }
    }
  });

  // Add keyboard event listener for left/right arrow keys and additional shortcuts
  document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
      document.querySelector('.main-nav #previous').click();
    } else if (event.key === 'ArrowRight') {
      document.querySelector('.main-nav #next').click();
    } else if (event.key.toLowerCase() === 's') {
      document.querySelector('#random').click();
    } else if (event.key.toLowerCase() === 'a') {
      document.querySelector('#beginning').click();
    } else if (event.key.toLowerCase() === 'd') {
      document.querySelector('#end').click();
    }
  });

  window.addEventListener("resize", updateAllPositions);
  window.addEventListener("scroll", updateAllPositions); // Trigger on scroll
  updateMedia();

  // Call updateFooterWidth on page load
  updateFooterWidth();

// Intersection Observer for lazy loading images and videos
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const media = entry.target;
      if (media.tagName.toLowerCase() === 'video') {
        const source = media.querySelector('source[data-src]');
        if (source && source.dataset.src) {
          source.src = source.dataset.src;
          source.removeAttribute('data-src');
          media.load(); // Load the video after setting the src
        }
      } else if (media.dataset.src) {
        media.src = media.dataset.src;
        media.removeAttribute('data-src');
      }
      observer.unobserve(media);
      media.addEventListener('load', updateAllPositions);
    }
  });
});

document.querySelectorAll('.media img, .media video').forEach(media => {
  observer.observe(media);
});

  // Preload adjacent media items and affixed media on initial load
  const prevIndex = (currentIndex - mediaOffset + timestamps.length) % timestamps.length;
  const nextIndex = (currentIndex + mediaOffset) % timestamps.length;

  [currentIndex, prevIndex, nextIndex].forEach(index => {
    const timestamp = timestamps[index];
    const mediaClass = timestamp.className;
    const mediaItem = Array.from(mediaItems).find(media => media.classList.contains(mediaClass) && !media.classList.contains('sub-post'));

    if (mediaItem && mediaItem.dataset.src) {
      mediaItem.src = mediaItem.dataset.src;
      mediaItem.removeAttribute('data-src');
    }
  });

  // Preload all affixed media for the current index on initial load
  const currentTimestamp = timestamps[currentIndex];
  const affixItems = Array.from(mediaItems).filter(item => item.classList.contains(currentTimestamp.className) && item.dataset.affix);
  affixItems.forEach(item => {
    if (item.dataset.src) {
      item.src = item.dataset.src;
      item.removeAttribute('data-src');
    }
  });

  // Add event listener to the input field
  const indexInput = document.querySelector('.index');
  indexInput.addEventListener('input', function () {
    const index = parseInt(indexInput.value, 10) - 1; // Convert to zero-based index
    if (!isNaN(index)) {
      preloadMediaAtIndex(index);
    }
  });
});

// Update CSS custom property for correct mobile viewport height
function updateViewportHeight() {
  const vh = window.innerHeight * 0.01; // Get 1% of the viewport height
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initial update
updateViewportHeight();

// Update on resize and orientation change
window.addEventListener('resize', updateViewportHeight);
window.addEventListener('orientationchange', updateViewportHeight);

// Fallback for cases where resize and orientation events don't trigger viewport changes
document.addEventListener('DOMContentLoaded', () => {
  updateViewportHeight();

  // Monitor for any additional environmental changes
  const observer = new MutationObserver(() => updateViewportHeight());
  observer.observe(document.body, { attributes: true, childList: true, subtree: true });
});
