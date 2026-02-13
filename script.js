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
});
