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
            video.currentTime = 0;

            // Fade out overlay
            overlay.classList.add('opacity-0', 'pointer-events-none');

            // Show native controls after interaction so user can pause/seek
            video.controls = true;

            // Scroll video to center of screen
            video.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // Testimonial Carousel Auto-Scroll Logic
    const track = document.getElementById('testimonial-track');

    if (track) {
        let scrollSpeed = 1; // Pixels per frame
        let isPaused = false;
        let animationId;

        const autoScroll = () => {
            if (!isPaused) {
                track.scrollLeft += scrollSpeed;
                // Seamless Loop Logic: Reset when scrolled past half content
                if (track.scrollLeft >= (track.scrollWidth / 2)) {
                    track.scrollLeft = 0;
                }
            }
            animationId = requestAnimationFrame(autoScroll);
        };

        // Start animation
        animationId = requestAnimationFrame(autoScroll);

        // Pause on hover (Desktop)
        track.addEventListener('mouseenter', () => isPaused = true);
        track.addEventListener('mouseleave', () => isPaused = false);

        // Pause on touch (Mobile Swipe)
        track.addEventListener('touchstart', () => isPaused = true);
        track.addEventListener('touchend', () => {
            // Delay restart slightly to avoid conflict if user just lifted finger
            setTimeout(() => isPaused = false, 1000);
        });
    }
});
