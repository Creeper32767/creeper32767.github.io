document.addEventListener('DOMContentLoaded', function() {
    
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
        fetch('nav.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                navPlaceholder.innerHTML = data;
                highlightActiveLink();
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
});