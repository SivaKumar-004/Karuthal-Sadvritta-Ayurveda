document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Accordion Functionality
    const triggers = document.querySelectorAll('.accordion-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.accordion-item');
            const content = item.querySelector('.accordion-content');
            const isOpen = item.getAttribute('data-state') === 'open';

            // Check state before closing others
            const openItems = document.querySelectorAll('.accordion-item[data-state="open"]');
            const isMultipleOpen = openItems.length > 1;

            // Close all other accordions
            triggers.forEach(otherTrigger => {
                if (otherTrigger !== trigger) {
                    const otherItem = otherTrigger.closest('.accordion-item');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    otherItem.setAttribute('data-state', 'closed');
                    otherTrigger.setAttribute('data-state', 'closed');
                    if (otherContent) otherContent.style.maxHeight = null;
                }
            });

            // Toggle current (Focus logic)
            if (isOpen && !isMultipleOpen) {
                item.setAttribute('data-state', 'closed');
                trigger.setAttribute('data-state', 'closed');
                content.style.maxHeight = null;
            } else {
                item.setAttribute('data-state', 'open');
                trigger.setAttribute('data-state', 'open');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // Initialize open accordions
    document.querySelectorAll('.accordion-item[data-state="open"]').forEach(item => {
        const content = item.querySelector('.accordion-content');
        if (content) {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
    // Video Interaction Logic
    const video = document.getElementById('introVideo');
    const overlay = document.getElementById('videoOverlay');
    const overlayButton = overlay?.querySelector('button');

    if (video && overlay) {
        // Handle click on overlay to unmute
        overlay.addEventListener('click', () => {
            video.muted = false;
            video.volume = 1.0;
            video.currentTime = 0; // Restart video from beginning when unmuted? Or just let it continue? Usually continue is better, but sometimes restart is impactful. Let's just unmute. 
            // Actually, let's restart if it's already playing to ensure they see the start with sound if it's an intro? 
            // The user didn't specify restart, just "tap to unmute".
            // However, usually these loops are short. Let's just unmute.

            // Fade out overlay
            overlay.classList.add('opacity-0', 'pointer-events-none');

            // Show native controls after interaction so user can pause/seek
            video.controls = true;

            // Scroll video to center of screen
            video.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // Testimonial Carousel Logic
    const track = document.getElementById('testimonial-track');
    const slides = track ? Array.from(track.children) : [];
    const nextButton = document.getElementById('next-testimonial');
    const prevButton = document.getElementById('prev-testimonial');
    const carouselContainer = document.getElementById('testimonial-carousel');
    // Select dots correctly based on the container
    const dotsNav = carouselContainer ? carouselContainer.querySelector('.flex.justify-center') : null;
    const dots = dotsNav ? Array.from(dotsNav.children) : [];

    if (track && slides.length > 0) {
        let currentIndex = 0;

        const getItemsPerScreen = () => window.innerWidth >= 768 ? 3 : 1;

        const updateCarousel = (index) => {
            const items = getItemsPerScreen();
            const percent = 100 / items;
            track.style.transform = `translateX(-${index * percent}%)`;

            // Update dots
            dots.forEach(dot => {
                dot.classList.remove('bg-primary');
                dot.classList.add('bg-border');
            });
            if (dots[index]) {
                dots[index].classList.remove('bg-border');
                dots[index].classList.add('bg-primary');
            }
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel(currentIndex);
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel(currentIndex);
        };

        window.addEventListener('resize', () => updateCarousel(currentIndex));

        if (nextButton) nextButton.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });

        if (prevButton) prevButton.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel(currentIndex);
                resetAutoPlay();
            });
        });

        // Auto Play
        let autoPlayInterval = setInterval(nextSlide, 5000); // 5 seconds

        const resetAutoPlay = () => {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextSlide, 5000);
        };

        // Pause on hover
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
            carouselContainer.addEventListener('mouseleave', () => resetAutoPlay());
        }
    }
});
