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
});
