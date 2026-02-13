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
        let resumeTimeout;
        track.addEventListener('touchstart', () => {
            isPaused = true;
            if (resumeTimeout) clearTimeout(resumeTimeout);
        });

        track.addEventListener('touchend', () => {
            // Delay restart to allow user to view content after swipe
            resumeTimeout = setTimeout(() => {
                isPaused = false;
            }, 3000);
        });

        // ---------------------------------------------------------
        // Full-screen Image Modal Logic
        // ---------------------------------------------------------
        const modal = document.getElementById('imageModal');
        const modalImg = document.querySelector('#imageModal img');
        const closeModal = document.getElementById('closeModal');

        if (modal && modalImg && closeModal) {
            const images = track.querySelectorAll('img');

            const openModal = (src) => {
                isPaused = true;
                if (resumeTimeout) clearTimeout(resumeTimeout);

                modalImg.src = src;
                modal.classList.remove('hidden');
                // Force reflow
                void modal.offsetWidth;

                modal.classList.remove('opacity-0');
                modalImg.classList.remove('scale-95');
                modalImg.classList.add('scale-100');
            };

            const hideModal = () => {
                modal.classList.add('opacity-0');
                modalImg.classList.remove('scale-100');
                modalImg.classList.add('scale-95');

                setTimeout(() => {
                    modal.classList.add('hidden');
                    isPaused = false;
                    modalImg.src = '';
                }, 300);
            };

            images.forEach(img => {
                img.style.cursor = 'zoom-in';

                // Desktop Click
                img.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openModal(img.src);
                });

                // Mobile Tap Detection
                let touchStartX = 0;
                let touchStartY = 0;

                img.addEventListener('touchstart', (e) => {
                    touchStartX = e.changedTouches[0].screenX;
                    touchStartY = e.changedTouches[0].screenY;
                }, { passive: true });

                img.addEventListener('touchend', (e) => {
                    const touchEndX = e.changedTouches[0].screenX;
                    const touchEndY = e.changedTouches[0].screenY;

                    const diffX = Math.abs(touchEndX - touchStartX);
                    const diffY = Math.abs(touchEndY - touchStartY);

                    // If movement is small (< 10px), treat as tap
                    if (diffX < 10 && diffY < 10) {
                        e.preventDefault();
                        e.stopPropagation();
                        openModal(img.src);
                    }
                });
            });

            closeModal.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                hideModal();
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) hideModal();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                    hideModal();
                }
            });
        }
    }
});
