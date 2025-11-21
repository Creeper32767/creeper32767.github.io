document.addEventListener('DOMContentLoaded', function () {

    // --- Collapsible Sidebar Logic ---
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.getElementById('sidebar-toggle');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebar && toggleButton && overlay) {
        const openSidebar = () => {
            sidebar.classList.add('open');
            overlay.classList.add('visible');
        };

        const closeSidebar = () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('visible');
        };

        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
        });

        overlay.addEventListener('click', closeSidebar);
    }


    // --- Set current year in the footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }


    // --- Load navigation and highlight the active link ---
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        fetch('/assets/static/nav.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                navPlaceholder.innerHTML = data;
                highlightActiveLink();
                // Initialize nav-related icons after navigation HTML is inserted
                // (the toggle button may not exist at initial DOMContentLoaded)
                setNavIcons();
            })
            .catch(error => console.error('Error loading navigation:', error));
    }

    function highlightActiveLink() {
        let currentPageName = window.location.pathname.split('/').pop().replace('.html', '');
        if (currentPageName === '') {
            currentPageName = 'index';
        }

        const navLinks = document.querySelectorAll('.nav-item');

        navLinks.forEach(link => {
            if (link.dataset.page === currentPageName) {
                link.classList.add('active');
            }
        });
    }

    function setNavIcons() {
        const toggleBtn = document.getElementById('sidebar-toggle');
        if (!toggleBtn) return;
        const iconImg = toggleBtn.querySelector('img');
        if (!iconImg) return;

        const openSrc = '/assets/static/icons/pane_open.svg';
        const closeSrc = '/assets/static/icons/pane_close.svg';

        function setIconForOpen(isOpen) {
            iconImg.src = isOpen ? closeSrc : openSrc;
        }

        // Keep a data attribute to track state for immediate feedback
        function setDataOpen(val) {
            iconImg.setAttribute('data-open', val ? 'true' : 'false');
        }

        // Click handler provides immediate toggle feedback; the MutationObserver
        // will reconcile if another script changes the sidebar state later.
        toggleBtn.addEventListener('click', () => {
            const currentlyOpen = iconImg.getAttribute('data-open') === 'true';
            setIconForOpen(!currentlyOpen);
            setDataOpen(!currentlyOpen);
        });

        // Observe sidebar attribute/class changes so icon reflects actual state.
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            const observer = new MutationObserver(() => {
                const isOpen = sidebar.classList.contains('open') || sidebar.classList.contains('is-open') || sidebar.hasAttribute('open');
                setIconForOpen(isOpen);
                setDataOpen(isOpen);
            });
            observer.observe(sidebar, { attributes: true, attributeFilter: ['class', 'open'] });

            // Initialize icon based on current sidebar state
            const initOpen = sidebar.classList.contains('open') || sidebar.classList.contains('is-open') || sidebar.hasAttribute('open');
            setIconForOpen(initOpen);
            setDataOpen(initOpen);
        } else {
            // Default
            setIconForOpen(false);
            setDataOpen(false);
        }
    }

    setNavIcons();
});