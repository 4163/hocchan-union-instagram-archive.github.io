document.addEventListener('DOMContentLoaded', function () {
  const mediaItems = document.querySelectorAll('.media-container img, .media-container video');
  const timestamps = document.querySelectorAll('.timestamps p');
  const likes = document.querySelectorAll('.likes');
  const comments = document.querySelectorAll('.comments');
  const postContents = document.querySelectorAll('.post-content');
  const noDateElement = document.querySelector('.noDate');
  const buttonSidebar = document.querySelector('.button-sidebar');
  let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;

  const timestampMediaMap = {};
  timestamps.forEach((timestamp, index) => {
    const className = timestamp.className;
    timestampMediaMap[className] = index;
  });

  let mediaHeight, mediaWidth;

  function calculateMediaDistanceBottom() {
    const mediaContainer = document.querySelector('.media-container');
    const visibleMedia = Array.from(mediaContainer.children).find(item => window.getComputedStyle(item).display === 'block');

    if (!visibleMedia) return 0;

    const viewportHeight = window.innerHeight;
    const mediaBottomPosition = visibleMedia.getBoundingClientRect().bottom;

    return parseFloat((viewportHeight - mediaBottomPosition - 76).toFixed(2));
  }

  function calculateMediaDistanceTop() {
    const mediaContainer = document.querySelector('.media-container');
    const visibleMedia = Array.from(mediaContainer.children).find(item => window.getComputedStyle(item).display === 'block');

    if (!visibleMedia) return 0;

    const mediaTopPosition = visibleMedia.getBoundingClientRect().top;

    return parseFloat((mediaTopPosition - 52).toFixed(2));
  }

  function updateButtonSidebarHeight() {
    if (window.matchMedia("(max-width: 827px)").matches) {
      const displayedMedia = Array.from(mediaItems).find(item => window.getComputedStyle(item).display === 'block');
      if (displayedMedia) {
        mediaHeight = parseFloat(displayedMedia.getBoundingClientRect().height.toFixed(2));
        mediaWidth = parseFloat(displayedMedia.getBoundingClientRect().width.toFixed(2));
        buttonSidebar.style.height = `${mediaHeight}px`;
      }
    } else {
      buttonSidebar.style.height = '';
    }
  }

  function adjustButtonSidebarPosition() {
    if (window.matchMedia("(max-width: 827px)").matches) {
      const mediaContainer = document.querySelector('.media-container');
      if (!mediaContainer || !mediaHeight) return;

      const displayedMedia = Array.from(mediaContainer.children).find(item => window.getComputedStyle(item).display === 'block');
      if (!displayedMedia) return;

      const mediaContainerWidth = mediaContainer.clientWidth;
      const mediaContainerHeight = mediaContainer.clientHeight;
      const mediaWidth = displayedMedia.clientWidth;

      const translateY = parseFloat(((mediaContainerHeight - mediaHeight) / 2).toFixed(2));
      const translateX = parseFloat(((mediaContainerWidth - mediaWidth) / 2).toFixed(2));

      buttonSidebar.style.transform = `translate(${translateX}px, ${translateY}px)`;
    } else {
      buttonSidebar.style.transform = '';
    }
  }

  function updateContentContainerPosition() {
    const mediaDistanceBottom = calculateMediaDistanceBottom();
    document.querySelectorAll('.content-container').forEach(container => {
      container.style.bottom = `${mediaDistanceBottom.toFixed(2)}px`;
    });
  }

  function updateContentContainerWidth() {
    let adjustedMediaWidth = parseFloat(mediaWidth.toFixed(2));

    if (buttonSidebar.style.display === 'block') {
      adjustedMediaWidth += 24;
    }

    if (adjustedMediaWidth) {
      document.querySelectorAll('.content-container').forEach(container => {
        container.style.width = `${adjustedMediaWidth.toFixed(2)}px`;
      });
    }
  }

  function adjustContentContainerPosition() {
    const imageSliderContainer = document.querySelector('.image-slider-container');
    if (imageSliderContainer && mediaWidth) {
      let adjustedMediaWidth = mediaWidth;

      if (buttonSidebar.style.display === 'block') {
        adjustedMediaWidth += 24;
      }

      const sliderWidth = imageSliderContainer.clientWidth;
      const translateX = parseFloat(((sliderWidth - adjustedMediaWidth) / 2).toFixed(2));

      document.querySelectorAll('.content-container, .mobile-handle').forEach(element => {
        element.style.transform = `translate(${translateX}px)`;
      });
    } else {
      document.querySelectorAll('.content-container, .mobile-handle').forEach(element => {
        element.style.transform = '';
      });
    }
  }

  function updateMobileHandlePosition() {
    const mediaDistanceTop = calculateMediaDistanceTop();
    document.querySelectorAll('.mobile-handle').forEach(handle => {
      handle.style.top = `${mediaDistanceTop.toFixed(2)}px`;
    });
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
      document.querySelectorAll('.content-container, .mobile-handle').forEach(element => {
        element.style.bottom = '';
        element.style.width = '';
        element.style.transform = '';
      });
      document.querySelectorAll('.mobile-handle').forEach(handle => {
        handle.style.top = '';
      });
      buttonSidebar.style.height = '';
      buttonSidebar.style.transform = '';
    }
  }

  function updateMedia() {
    const currentTimestamp = timestamps[currentIndex];
    if (currentTimestamp) {
      timestamps.forEach((timestamp) => timestamp.style.display = 'none');
      currentTimestamp.style.display = 'block';
    }

    mediaItems.forEach((item) => {
      if (item.tagName.toLowerCase() === 'video') {
        item.pause();
        item.currentTime = 0;
      }
      item.style.display = 'none';
    });

    likes.forEach(like => like.style.display = 'none');
    comments.forEach(comment => comment.style.display = 'none');
    postContents.forEach(content => content.style.display = 'none');
    noDateElement.style.display = 'none';

    const noDataElements = document.querySelectorAll('.noData');
    noDataElements.forEach(el => el.style.display = 'none');

    const mediaClass = currentTimestamp.className;
    const mediaIndex = Array.from(mediaItems).findIndex(media => media.classList.contains(mediaClass) && !media.classList.contains('sub-post'));

    if (mediaIndex !== -1) {
      const currentMedia = mediaItems[mediaIndex];
      currentMedia.style.display = 'block';

      if (currentMedia.tagName.toLowerCase() === 'video') {
        currentMedia.volume = 0.15;
        currentMedia.play();
      }

      if (currentMedia.classList.contains('sub-post') || currentMedia.classList.contains('main-sub-post')) {
        buttonSidebar.style.display = 'block';
      } else {
        buttonSidebar.style.display = 'none';
      }

      const timestampClass = currentTimestamp.className;
      const likeElement = Array.from(likes).find(like => like.classList.contains(timestampClass));
      const commentElement = Array.from(comments).find(comment => comment.classList.contains(timestampClass));
      const postContentElements = Array.from(postContents).filter(content => content.classList.contains(timestampClass));

      if (likeElement) likeElement.style.display = 'block';
      if (commentElement) commentElement.style.display = 'block';
      if (postContentElements.length > 0) {
        postContentElements.forEach(content => content.style.display = 'block');
        noDateElement.style.display = 'none';
      } else {
        noDateElement.style.display = 'block';
      }

      if (!likeElement && !commentElement) {
        noDataElements.forEach(el => el.style.display = 'block');
      }
    }

    updateAllPositions();
  }
  
	function scrollToMiddle() {
	  const middlePosition = document.body.scrollHeight / 2 - window.innerHeight / 2;
	  window.scrollTo({
		top: middlePosition,
		behavior: 'smooth', // Optional for smooth scrolling
	  });
	  updateAllPositions(); // Ensure adjustments are applied after scrolling
	}

  document.querySelector('.right-button').addEventListener('click', function () {
    currentIndex = (currentIndex + 1) % timestamps.length;
    localStorage.setItem('currentIndex', currentIndex);
    updateMedia();
  });

  document.querySelector('.left-button').addEventListener('click', function () {
    currentIndex = (currentIndex - 1 + timestamps.length) % timestamps.length;
    localStorage.setItem('currentIndex', currentIndex);
    updateMedia();
  });

  document.querySelector('.beginning').addEventListener('click', function () {
    currentIndex = 0;
    localStorage.setItem('currentIndex', currentIndex);
    updateMedia();
  });

  document.querySelector('.end').addEventListener('click', function () {
    currentIndex = timestamps.length - 1;
    localStorage.setItem('currentIndex', currentIndex);
    updateMedia();
  });

  document.querySelector('.random').addEventListener('click', function () {
    currentIndex = Math.floor(Math.random() * timestamps.length);
    localStorage.setItem('currentIndex', currentIndex);
    updateMedia();
  });
  
	document.querySelector('.center').addEventListener('click', function () {
	  scrollToMiddle(); // Scroll to the middle of the page
	  updateAllPositions(); // Apply the precise adjustments
	});

  document.querySelector('.s-right-button').addEventListener('click', function () {
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
      item.style.display = 'none';
    });

    const nextMedia = affixItems[currentAffixIndex];
    nextMedia.style.display = 'block';

    if (nextMedia.tagName.toLowerCase() === 'video') {
      nextMedia.volume = 0.15;
      nextMedia.play();
    }

    updateAllPositions();
  });

  document.querySelector('.s-left-button').addEventListener('click', function () {
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
      item.style.display = 'none';
    });

    const prevMedia = affixItems[currentAffixIndex];
    prevMedia.style.display = 'block';

    if (prevMedia.tagName.toLowerCase() === 'video') {
      prevMedia.volume = 0.15;
      prevMedia.play();
    }

    updateAllPositions();
  });

  window.addEventListener("resize", updateAllPositions);
  window.addEventListener("scroll", updateAllPositions); // Trigger on scroll
  updateMedia();
  scrollToMiddle();
});
