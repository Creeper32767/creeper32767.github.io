document.addEventListener('DOMContentLoaded', () => {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (!navPlaceholder) return;

    const customSrc = navPlaceholder.getAttribute('data-nav-src') || '/assets/static/nav.html';
    initNavigation(customSrc).finally(() => initSidebar());
});

/* --- Navigation System --- */
function initNavigation(navSrc = '/assets/static/nav.html') {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (!navPlaceholder) return Promise.resolve();

    return fetch(navSrc)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(data => {
            navPlaceholder.innerHTML = data;
            highlightActiveLink();
            initSubmenus();
            initHeadingOutline();
        })
        .catch(error => {
            console.error('Error loading navigation:', error);
        });
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

/* --- Page Heading Outline --- */
function initHeadingOutline() {
    const pageName = getCurrentPageName();
    const currentParent = document.querySelector(`.nav-item-parent[data-page="${pageName}"]`);
    if (!currentParent) return;

    const submenu = getHeadingSubmenu(currentParent);
    const contentHost = document.querySelector('main') || document.querySelector('.main-content');

    if (!submenu || !contentHost) return;

    const renderHeadings = () => {
        const headings = Array.from(contentHost.querySelectorAll('h3'));
        buildHeadingMenu(submenu, headings, pageName);
    };

    const debouncedRender = debounce(renderHeadings, 50);
    renderHeadings();

    const observer = new MutationObserver(debouncedRender);
    observer.observe(contentHost, { childList: true, subtree: true });

    currentParent.setAttribute('aria-expanded', 'true');
    syncToggleState(currentParent, true);
}

function getHeadingSubmenu(parentLink) {
    let sibling = parentLink.nextElementSibling;
    while (sibling) {
        if (sibling.classList && sibling.classList.contains('nav-submenu-headings')) {
            return sibling;
        }
        sibling = sibling.nextElementSibling;
    }
    return null;
}

function buildHeadingMenu(container, headings, pageName) {
    container.innerHTML = '';

    if (!headings.length) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'nav-submenu-empty';
        emptyItem.textContent = '暂无条目';
        container.appendChild(emptyItem);
        return;
    }

    const fragment = document.createDocumentFragment();

    headings.forEach((heading, index) => {
        const targetId = ensureHeadingId(heading, pageName, index);
        const label = extractHeadingLabel(heading, index);

        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${targetId}`;
        link.className = 'nav-item nav-item-leaf';
        link.textContent = label;
        item.appendChild(link);
        fragment.appendChild(item);
    });

    container.appendChild(fragment);
}

function ensureHeadingId(heading, pageName, index) {
    if (heading.id) return heading.id;

    const base = slugifyHeading(heading.textContent) || `${pageName}-section`;
    let suffix = index + 1;
    let candidate = `${base}-${suffix}`;
    while (document.getElementById(candidate)) {
        suffix += 1;
        candidate = `${base}-${suffix}`;
    }

    heading.id = candidate;
    return candidate;
}

function extractHeadingLabel(heading, index) {
    const firstNode = Array.from(heading.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    const label = (firstNode?.textContent || heading.textContent || '').trim();
    return label || `条目 ${index + 1}`;
}

function slugifyHeading(text = '') {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 48);
}

function debounce(fn, delay = 100) {
    let timer;
    return function debounced(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function syncToggleState(parentLink, isExpanded) {
    const toggleBtn = parentLink.nextElementSibling;
    if (toggleBtn && toggleBtn.classList.contains('nav-toggle-btn')) {
        toggleBtn.classList.toggle('expanded', isExpanded);
    }
}

/* --- Sidebar System --- */
function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const overlay = document.querySelector('.sidebar-overlay');

    if (!sidebar || !toggleBtn || !overlay) return;

    const setSidebarState = (isOpen) => {
        sidebar.classList.toggle('open', isOpen);
        overlay.classList.toggle('visible', isOpen);
    };

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setSidebarState(!sidebar.classList.contains('open'));
    });

    overlay.addEventListener('click', () => setSidebarState(false));

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

        updateIcon();
    }
}
