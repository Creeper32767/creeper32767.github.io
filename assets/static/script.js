document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initFooter();
});

/* --- Sidebar System --- */
function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const overlay = document.querySelector('.sidebar-overlay');

    if (!sidebar || !toggleBtn || !overlay) return;

    // 1. Toggle Actions
    const setSidebarState = (isOpen) => {
        sidebar.classList.toggle('open', isOpen);
        overlay.classList.toggle('visible', isOpen);
    };

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setSidebarState(!sidebar.classList.contains('open'));
    });

    overlay.addEventListener('click', () => setSidebarState(false));

    // 2. Icon Sync (Observer Pattern)
    const iconImg = toggleBtn.querySelector('img');
    if (iconImg) {
        const openSrc = '/assets/static/icons/pane_open.svg';
        const closeSrc = '/assets/static/icons/pane_close.svg';

        const updateIcon = () => {
            const isOpen = sidebar.classList.contains('open');
            iconImg.src = isOpen ? closeSrc : openSrc;
        };

        const observer = new MutationObserver(updateIcon);
        observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });

        // Initial check
        updateIcon();
    }
}

/* --- Footer System --- */
function initFooter() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}