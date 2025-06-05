// Sample images for the gallery
const galleryImages = [
    'images/6.jpg',
    'images/IMG-20240214-WA0035.jpg',
    'images/WhatsApp Image 2024-03-04 at 16.21.52_81d25aa8.jpg',
    'images/1.jpg',
    'images/2.jpg',
    'images/3.jpg',
    'images/4.jpg',
    'images/5.jpg'
    

];

// Sample images for the close friends carousel
const carouselImages = [
    'images/IMG-20240214-WA0035.jpg',
    'images/WhatsApp Image 2024-03-04 at 16.21.52_81d25aa8.jpg',
    'images/1.jpg',
    'images/2.jpg',
    'images/3.jpg',
    'images/4.jpg',
    'images/5.jpg',
    'images/6.jpg'
];

// Background slideshow images
const heroBackgrounds = [
    'images/6.jpg',
    'images/IMG-20240214-WA0035.jpg',
    'images/WhatsApp Image 2024-03-04 at 16.21.52_81d25aa8.jpg',
    'images/1.jpg',
    'images/2.jpg',
    'images/3.jpg',
    'images/4.jpg',
    'images/5.jpg',
];

// Populate gallery
function populateGallery() {
    const galleryGrid = document.querySelector('.gallery-grid');
    galleryImages.forEach(imageUrl => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = "Gallery Image";
        
        // Add error handling for images
        img.onerror = function() {
            console.error('Failed to load image:', imageUrl);
            this.style.display = 'none';
        };
        
        img.onload = function() {
            console.log('Successfully loaded image:', imageUrl);
        };
        
        galleryItem.appendChild(img);
        galleryGrid.appendChild(galleryItem);
    });
}

// Populate carousel
function populateCarousel() {
    const carousel = document.querySelector('.carousel');
    carouselImages.forEach(imageUrl => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = "Carousel Image";
        
        // Add error handling for images
        img.onerror = function() {
            console.error('Failed to load image:', imageUrl);
            this.style.display = 'none';
        };
        
        img.onload = function() {
            console.log('Successfully loaded image:', imageUrl);
        };
        
        carouselItem.appendChild(img);
        carousel.appendChild(carouselItem);
    });
}

// Carousel functionality
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const totalItems = carouselImages.length;
    let currentPosition = 0;
    let maxPosition = 0;
    const tolerance = 0.5; // Small tolerance for floating point comparisons

    // Function to calculate layout and update max position
    function updateLayout() {
        const firstItem = carousel.querySelector('.carousel-item');
        const lastItem = carousel.querySelector('.carousel-item:last-child');
        
        if (totalItems === 0 || !firstItem || !lastItem) {
             maxPosition = 0;
             currentPosition = 0;
             updateCarousel();
             return; // No items to display
        }

        const itemWidth = firstItem.offsetWidth; // Get actual rendered width
        const gap = parseFloat(getComputedStyle(carousel).getPropertyValue('gap')) || 0;
        const carouselWidth = carousel.offsetWidth; // Inner width of the carousel container
        
        // Calculate the total width of all items including gaps
        const totalContentWidth = totalItems * itemWidth + Math.max(0, totalItems - 1) * gap;

        // Calculate the maximum negative position (end of the carousel)
        // This is the point where the right edge of the last item aligns with the right edge of the carousel container
        // Ensure maxPosition is not positive
        maxPosition = Math.min(0, carouselWidth - totalContentWidth);
        
         // If total content width is less than or equal to carousel width, maxPosition should be 0
         // Use a small tolerance for comparison to avoid floating point issues
         if (totalContentWidth <= carouselWidth + tolerance) {
            maxPosition = 0;
        }

        console.log('updateLayout:', { itemWidth, gap, carouselWidth, totalContentWidth, maxPosition, totalItems });

        // Ensure current position doesn't exceed the new maxPosition after resize
        // Use tolerance for comparison when adjusting current position
         if (currentPosition < maxPosition - tolerance) {
             currentPosition = maxPosition;
        }
        // Ensure current position is not positive
        if (currentPosition > tolerance) {
            currentPosition = 0;
        }

        updateCarousel(); // Update carousel position and button states after layout change
    }

    function updateCarousel() {
        // Round currentPosition to avoid potential floating point issues
        const roundedPosition = Math.round(currentPosition);
        carousel.style.transform = `translateX(${roundedPosition}px)`;
        
        console.log('updateCarousel:', { currentPosition: roundedPosition, maxPosition: Math.round(maxPosition) });

        // Update button visibility and state
        // Use tolerance for comparisons with rounded position
        if (roundedPosition >= -tolerance) { 
            prevButton.style.opacity = '0.5';
            prevButton.style.pointerEvents = 'none';
        } else {
            prevButton.style.opacity = '1';
            prevButton.style.pointerEvents = 'auto';
        }

        if (roundedPosition <= Math.round(maxPosition) + tolerance) { // Compare with rounded maxPosition
            nextButton.style.opacity = '0.5';
            nextButton.style.pointerEvents = 'none';
        } else {
            nextButton.style.opacity = '1';
            nextButton.style.pointerEvents = 'auto';
        }
    }

    // Button click handlers
    prevButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
         const firstItem = carousel.querySelector('.carousel-item');
        const itemWidth = firstItem ? firstItem.offsetWidth : 300;
        const gap = parseFloat(getComputedStyle(carousel).getPropertyValue('gap')) || 0;
        
        // Calculate how many items to move based on current view
        const carouselWidth = carousel.offsetWidth;
        const itemsToMove = Math.floor(carouselWidth / (itemWidth + gap)) || 1;

        // Move left by a calculated step, but not past the beginning (0)
        // Use Math.ceil when adding to ensure we don't undershoot 0
        currentPosition = Math.min(currentPosition + itemsToMove * (itemWidth + gap), 0);
        console.log('Prev button clicked. New position:', currentPosition);
        updateCarousel();
    });

    nextButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
         const firstItem = carousel.querySelector('.carousel-item');
        const itemWidth = firstItem ? firstItem.offsetWidth : 300;
        const gap = parseFloat(getComputedStyle(carousel).getPropertyValue('gap')) || 0;

         // Calculate how many items to move based on current view
        const carouselWidth = carousel.offsetWidth;
        const itemsToMove = Math.floor(carouselWidth / (itemWidth + gap)) || 1;

        // Move right by a calculated step, but not past the end (maxPosition)
        // Use Math.floor when subtracting to ensure we don't overshoot maxPosition
        currentPosition = Math.max(currentPosition - itemsToMove * (itemWidth + gap), maxPosition);
         console.log('Next button clicked. New position:', currentPosition);
        updateCarousel();
    });

    // Touch and mouse swipe functionality
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    function touchStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        carousel.style.cursor = 'grabbing';
        carousel.style.transition = 'none';
        prevTranslate = currentPosition; // Store the current position at the start of the drag
         console.log('Drag started. Start position:', startPos);
    }

    function touchMove(event) {
        if (!isDragging) return;

        const currentDragPos = getPositionX(event);
        const diff = currentDragPos - startPos;
        currentTranslate = prevTranslate + diff;

        // Limit the drag movement within the bounds
         // Use tolerance for comparisons
        if (currentTranslate > tolerance) {
             currentTranslate = 0;
        } else if (currentTranslate < maxPosition - tolerance) {
             currentTranslate = maxPosition;
        }
        
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    function touchEnd() {
        isDragging = false;
        carousel.style.cursor = 'grab';
        carousel.style.transition = 'transform 0.3s ease';
        
        // Snap to nearest item position after drag ends
        const firstItem = carousel.querySelector('.carousel-item');
        const itemWidth = firstItem ? firstItem.offsetWidth : 300;
        const gap = parseFloat(getComputedStyle(carousel).getPropertyValue('gap')) || 0;
        const itemWidthWithGap = itemWidth + gap;
        
        // Determine which direction was moved significantly
        const movedBy = currentTranslate - prevTranslate;
        let snapDirection = 0;
         // Use tolerance for significant move check
        if (movedBy < -(itemWidthWithGap * 0.1) && currentTranslate < prevTranslate + tolerance) { // Moved left significantly and is indeed moving left
            snapDirection = -1;
        } else if (movedBy > (itemWidthWithGap * 0.1) && currentTranslate > prevTranslate - tolerance) { // Moved right significantly and is indeed moving right
            snapDirection = 1;
        }

        // Calculate snap position based on direction and current translate
        let snapPosition = currentTranslate;
        if (snapDirection !== 0) {
             snapPosition = Math.round(currentTranslate / itemWidthWithGap) * itemWidthWithGap;
        }

        // Ensure the snap position is within bounds
        // Use tolerance when clamping the final position
        currentPosition = Math.max(Math.min(snapPosition, 0), maxPosition);
        
        console.log('Drag ended. New position:', currentPosition);
        updateCarousel();
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    // Event listeners for touch and mouse
    carousel.addEventListener('mousedown', touchStart);
    carousel.addEventListener('touchstart', touchStart);
    
    carousel.addEventListener('mousemove', touchMove);
    carousel.addEventListener('touchmove', touchMove);
    
    carousel.addEventListener('mouseup', touchEnd);
    carousel.addEventListener('touchend', touchEnd);
    
    carousel.addEventListener('mouseleave', touchEnd);

    // Prevent context menu on long press
    carousel.addEventListener('contextmenu', (e) => e.preventDefault());

    // Initialize carousel
    // Use a slight delay to ensure items are rendered and have dimensions
    // Also observe resize for responsiveness
    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(carousel);

    // Initial layout update
    // Use a slight delay to ensure images are loaded and layout is stable
    setTimeout(updateLayout, 200);
}

// Initialize hero background slideshow
function initHeroSlideshow() {
    const hero = document.querySelector('#hero');
    let currentIndex = 0;

    // Create overlay div for smooth transitions
    const overlay = document.createElement('div');
    overlay.className = 'hero-overlay';
    hero.appendChild(overlay);

    // Set initial background
    hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${heroBackgrounds[0]}')`;

    // Change background every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % heroBackgrounds.length;
        overlay.style.opacity = '1';
        
        setTimeout(() => {
            hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${heroBackgrounds[currentIndex]}')`;
            overlay.style.opacity = '0';
        }, 1000);
    }, 5000);
}

// Hamburger Menu Functionality
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// Lightbox functionality
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');
    const downloadLightbox = document.getElementById('download-lightbox'); // Get the download link element

    // Function to open lightbox
    function openLightbox(imageSrc) {
        lightboxImg.src = imageSrc;
        downloadLightbox.href = imageSrc; // Set the download link href to the image source
        // Optionally, set the download attribute value for a suggested filename
        const filename = imageSrc.split('/').pop(); // Extract filename from path/URL
        downloadLightbox.download = filename || 'downloaded_image.jpg'; // Set download filename

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
    }

    // Function to close lightbox
    function closeLightboxHandler() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        lightboxImg.src = ''; // Clear image source when closing
        downloadLightbox.href = ''; // Clear download link when closing
    }

    // Add click event to gallery images
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', () => openLightbox(img.src));
    });

    // Add click event to carousel images
    document.querySelectorAll('.carousel-item img').forEach(img => {
        img.addEventListener('click', () => openLightbox(img.src));
    });

    // Close lightbox when clicking the close button
    closeLightbox.addEventListener('click', closeLightboxHandler);

    // Close lightbox when clicking outside the image (and not on the download link)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === closeLightbox) {
            closeLightboxHandler();
        }
    });

    // Close lightbox when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightboxHandler();
        }
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initHamburgerMenu();
    initHeroSlideshow();
    populateGallery();
    populateCarousel();
    initCarousel();
    populateGallery(); // Populate gallery again to add event listeners after images are added
    populateCarousel(); // Populate carousel again to add event listeners after images are added
    initLightbox(); 
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Ensure lightbox is initialized after images are loaded into the DOM
document.addEventListener('DOMContentLoaded', () => {
    // Initial population
    populateGallery();
    populateCarousel();

    // Use a MutationObserver to watch for when images are added to the DOM
    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList' && (mutation.addedNodes.length > 0)) {
                // If images are added, initialize lightbox functionality
                initLightbox();
                // Once initialized, we can disconnect the observer if we only need to do it once
                // observer.disconnect(); 
                return; // Exit after initializing
            } else if (mutation.type === 'childList' && mutation.target.classList.contains('carousel') && mutation.addedNodes.length > 0) {
                 initLightbox(); // Also initialize if carousel items are added dynamically
                 return;
            }
        }
    });

    // Observe the gallery and carousel containers for changes in their child list
    const galleryGrid = document.querySelector('.gallery-grid');
    const carouselContainer = document.querySelector('.carousel');
    
    if(galleryGrid) observer.observe(galleryGrid, { childList: true });
    if(carouselContainer) observer.observe(carouselContainer, { childList: true });


    initHamburgerMenu();
    initHeroSlideshow();
    initCarousel();
    
}); 