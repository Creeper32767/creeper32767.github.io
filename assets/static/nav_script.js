document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
})

/* --- Navigation System --- */
function initNavigation() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (!navPlaceholder) return;

    fetch('/assets/static/nav.html')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(data => {
            navPlaceholder.innerHTML = data;
            highlightActiveLink();
            initSubmenus();
        })
        .catch(error => console.error('Error loading navigation:', error));
}

function highlightActiveLink() {
    const pageName = getCurrentPageName();
    const navLinks = document.querySelectorAll('.nav-item');

    navLinks.forEach(link => {
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });
}

function initSubmenus() {
    const parents = document.querySelectorAll('.nav-item-parent');

    // 1. Setup Toggle Buttons
    parents.forEach(parentLink => {
        if (!parentLink.hasAttribute('aria-expanded')) {
            parentLink.setAttribute('aria-expanded', 'false');
        }

        // Check if button already exists (in case of re-run)
        if (parentLink.parentNode.querySelector('.nav-toggle-btn')) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'nav-toggle-btn';
        toggleBtn.setAttribute('aria-label', '切换子菜单');
        toggleBtn.innerHTML = `<img src="/assets/static/icons/arrow.svg" alt="Toggle Submenu Icon" />`;

        // Insert button AFTER the link, but BEFORE the submenu (which is next sibling)
        // Structure: <li> <a></a> <button></button> <ul></ul> </li>
        parentLink.parentNode.insertBefore(toggleBtn, parentLink.nextSibling);

        // Toggle Event
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isExpanded = parentLink.getAttribute('aria-expanded') === 'true';
            parentLink.setAttribute('aria-expanded', !isExpanded);
            
            // Rotate icon
            toggleBtn.classList.toggle('expanded', !isExpanded);
        });
    });

    // 2. Auto-expand Active Section
    const pageName = getCurrentPageName();
    const activeChild = document.querySelector(`.nav-submenu .nav-item[data-page="${pageName}"]`);

    if (activeChild) {
        activeChild.classList.add('active');
        const parentSubmenu = activeChild.closest('ul.nav-submenu');
        // Find the parent link in the same list item
        const parentLi = parentSubmenu?.closest('li');
        const parentLink = parentLi?.querySelector('.nav-item-parent');

        if (parentLink) {
            parentLink.setAttribute('aria-expanded', 'true');
            parentLink.classList.add('active'); // Also highlight parent
        }
    }
}

function getCurrentPageName() {
    let name = window.location.pathname.split('/').pop().replace('.html', '');
    return name === '' ? 'index' : name;
}
