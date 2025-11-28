document.addEventListener('DOMContentLoaded', () => {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (!navPlaceholder) return;

    const customSrc = navPlaceholder.getAttribute('data-nav-src') || '/assets/static/nav.html';
    initNavigation(customSrc).finally(() => initSidebar());
});

let hashListenerBound = false;
const NAV_GROUPS = {
    outline: '.nav-submenu-headings .nav-item'
};
let activeOutlineContainer = null;
let outlineTargetMap = new Map();
let outlineSequence = [];
let outlineScrollBound = false;
let outlineScrollQueued = false;
let lastOutlineTargetId = null;

/* --- Highlight Helpers --- */
function setNavItemActive(link, options = {}) {
    if (!link) return;
    const { groupSelector, expandAncestors = false } = options;

    if (groupSelector) {
        clearNavGroup(groupSelector, link);
    }

    link.classList.add('active');

    if (groupSelector === NAV_GROUPS.outline) {
        const targetId = extractTargetId(link);
        if (targetId) {
            lastOutlineTargetId = targetId;
        }
    }

    if (expandAncestors) {
        expandNavAncestors(link);
    }
}

function clearNavGroup(selector, exceptNode) {
    if (!selector) return;
    document.querySelectorAll(selector).forEach((node) => {
        if (node !== exceptNode) {
            node.classList.remove('active');
        }
    });
}

function expandNavAncestors(link) {
    let current = link;
    const visited = new Set();

    while (current && !visited.has(current)) {
        visited.add(current);

        if (current.classList.contains('nav-item-parent')) {
            current.setAttribute('aria-expanded', 'true');
            syncToggleState(current, true);
        }

        const parentLink = findParentNavLink(current);
        if (!parentLink) break;

        parentLink.classList.add('active');
        current = parentLink;
    }
}

function findParentNavLink(childLink) {
    const submenu = childLink.closest('ul.nav-submenu');
    if (!submenu) return null;

    let sibling = submenu.previousElementSibling;
    while (sibling) {
        if (sibling.classList?.contains('nav-toggle-btn')) {
            sibling = sibling.previousElementSibling;
            continue;
        }

        if (sibling.classList?.contains('nav-item-parent')) {
            return sibling;
        }

        sibling = sibling.previousElementSibling;
    }

    return null;
}

function syncToggleState(parentLink, isExpanded) {
    const toggleBtn = parentLink.nextElementSibling;
    if (toggleBtn && toggleBtn.classList.contains('nav-toggle-btn')) {
        toggleBtn.classList.toggle('expanded', isExpanded);
    }
}

function extractTargetId(link) {
    if (!link) return null;
    try {
        const url = new URL(link.href, window.location.origin);
        if (!url.hash) return null;
        return decodeURIComponent(url.hash.slice(1));
    } catch (error) {
        return null;
    }
}

/* --- Navigation System --- */
async function initNavigation(navSrc = '/assets/static/nav.html') {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (!navPlaceholder) return Promise.resolve();

    try {
        const response = await fetch(navSrc);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.text();
        navPlaceholder.innerHTML = data;
        highlightActiveLink();
        initSubmenus();
        initHeadingOutline(navSrc);
    } catch (error) {
        console.error('Error loading navigation:', error);
    }
}

function highlightActiveLink() {
    const pageName = getCurrentPageName();
    const activeLinks = document.querySelectorAll(`.nav-item[data-page="${pageName}"]`);

    activeLinks.forEach(link => {
        setNavItemActive(link, { expandAncestors: true });
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

}

function getCurrentPageName() {
    let name = window.location.pathname.split('/').pop().replace('.html', '');
    return name === '' ? 'index' : name;
}

/* --- Page Heading Outline --- */
function initHeadingOutline(navSrc) {
    const currentPage = getCurrentPageName();

    if (isNotesNavigation(navSrc)) {
        const parents = document.querySelectorAll('.nav-item-parent[data-page]');

        parents.forEach((parentLink) => {
            const submenu = getHeadingSubmenu(parentLink);
            if (!submenu) return;

            const outlineSrc = parentLink.dataset.outlineSrc;
            if (outlineSrc) {
                loadOutlineFromSource(parentLink, submenu, outlineSrc);
            } else if (parentLink.dataset.page === currentPage) {
                loadOutlineFromDOM(parentLink, submenu, currentPage);
            }
        });

        activateCurrentHash();
        ensureHashListener();
        return;
    }

    if (registerStaticOutline(currentPage)) {
        activateCurrentHash();
        ensureHashListener();
    }
}

function isNotesNavigation(navSrc = '') {
    return typeof navSrc === 'string' && navSrc.includes('nav-notes');
}

function getHeadingSubmenu(parentLink) {
    return findFollowingSubmenu(parentLink, { requireHeadingClass: true });
}

function findFollowingSubmenu(parentLink, options = {}) {
    const { requireHeadingClass = false } = options;
    let sibling = parentLink?.nextElementSibling;

    while (sibling) {
        const classList = sibling.classList;
        if (classList) {
            const isHeadingMenu = classList.contains('nav-submenu-headings');
            const isGenericMenu = classList.contains('nav-submenu');

            if (isHeadingMenu || isGenericMenu) {
                if (!requireHeadingClass || isHeadingMenu) {
                    return sibling;
                }
            }
        }

        sibling = sibling.nextElementSibling;
    }

    return null;
}

function loadOutlineFromSource(parentLink, submenu, src) {
    setHeadingLoading(submenu);

    fetch(src)
        .then((response) => {
            if (!response.ok) throw new Error('Failed to fetch outline data');
            return response.json();
        })
        .then((entries) => {
            if (!Array.isArray(entries)) throw new Error('Invalid outline payload');
            const pageName = parentLink.dataset.page || 'section';
            const outlineEntries = entries
                .map((entry, index) => createOutlineEntry(entry, index, pageName))
                .filter(Boolean);
            buildHeadingList(submenu, outlineEntries, parentLink);
        })
        .catch((error) => {
            console.error('Unable to build outline:', error);
            setHeadingError(submenu);
        });
}

function loadOutlineFromDOM(parentLink, submenu, pageName) {
    const contentHost = document.querySelector('main') || document.querySelector('.main-content');
    if (!contentHost) return;

    const renderHeadings = () => {
        const headings = Array.from(contentHost.querySelectorAll('h3'));
        if (!headings.length) {
            setHeadingLoading(submenu, '暂无条目');
            return;
        }

        const outlineEntries = headings.map((heading, index) => ({
            id: ensureHeadingId(heading, pageName, index),
            label: extractHeadingLabel(heading, index)
        }));

        buildHeadingList(submenu, outlineEntries, parentLink);
    };

    const debouncedRender = debounce(renderHeadings, 50);
    renderHeadings();

    const observer = new MutationObserver(debouncedRender);
    observer.observe(contentHost, { childList: true, subtree: true });

    parentLink.setAttribute('aria-expanded', 'true');
    syncToggleState(parentLink, true);
}

function createOutlineEntry(entry, index, pageName) {
    const label = (entry.title || entry.meta || entry.subtitle || '').trim();
    if (!label) return null;
    const id = buildAnchorId(label, index, pageName);
    return { id, label };
}

function buildHeadingList(container, entries, parentLink) {
    container.innerHTML = '';

    if (!entries.length) {
        setHeadingLoading(container, '暂无条目');
        return;
    }

    const fragment = document.createDocumentFragment();
    const baseHref = (parentLink?.getAttribute('href') || '#').split('#')[0];

    entries.forEach(({ id, label }) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `${baseHref}#${id}`;
        link.className = 'nav-item';
        link.textContent = label;
        item.appendChild(link);
        fragment.appendChild(item);
    });

    container.appendChild(fragment);
    bindOutlineNavInteractions(container);
    registerOutlineContainer(container, parentLink);
    activateCurrentHash();
}

function ensureHeadingId(heading, pageName, index) {
    if (heading.id) return heading.id;
    const label = (heading.textContent || '').trim() || `section ${index + 1}`;
    const id = buildAnchorId(label, index, pageName);
    heading.id = id;
    return id;
}

function extractHeadingLabel(heading, index) {
    const firstNode = Array.from(heading.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    const label = (firstNode?.textContent || heading.textContent || '').trim();
    return label || `条目 ${index + 1}`;
}

function setHeadingLoading(container, text = '正在加载内容…') {
    container.innerHTML = '';
    const placeholder = document.createElement('li');
    placeholder.className = 'nav-submenu-empty';
    placeholder.textContent = text;
    container.appendChild(placeholder);
}

function setHeadingError(container) {
    setHeadingLoading(container, '加载失败');
}

function buildAnchorId(text, index, pageName = 'section') {
    const base = slugifyHeading(text) || 'section';
    const prefix = pageName ? `${pageName}-` : '';
    return `${prefix}${base}-${index + 1}`;
}

function slugifyHeading(text = '') {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 48);
}

function registerStaticOutline(pageName) {
    const parentLink = document.querySelector(`.nav-item-parent[data-page="${pageName}"]`);
    if (!parentLink) return false;

    const submenu = findFollowingSubmenu(parentLink);
    if (!submenu) return false;

    submenu.classList.add('nav-submenu-headings');
    bindOutlineNavInteractions(submenu);
    registerOutlineContainer(submenu, parentLink);
    return true;
}

function registerOutlineContainer(container, parentLink) {
    if (!parentLink || parentLink.dataset.page !== getCurrentPageName()) return;

    activeOutlineContainer = container;
    outlineTargetMap = new Map();
    outlineSequence = [];

    container.querySelectorAll('.nav-item').forEach((link) => {
        const targetId = extractTargetId(link);
        if (!targetId) return;
        outlineTargetMap.set(targetId, link);
        outlineSequence.push(targetId);
    });

    ensureOutlineScrollTracking();
    updateOutlineByScroll(true);
}

function ensureOutlineScrollTracking() {
    if (outlineScrollBound) return;
    outlineScrollBound = true;

    const queueUpdate = () => {
        if (outlineScrollQueued) return;
        outlineScrollQueued = true;
        requestAnimationFrame(() => {
            outlineScrollQueued = false;
            updateOutlineByScroll();
        });
    };

    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate);
}

function updateOutlineByScroll(force = false) {
    if (!outlineSequence.length) return;

    const viewportThreshold = window.scrollY + window.innerHeight * 0.3;
    let activeId = outlineSequence[0];

    for (const targetId of outlineSequence) {
        const target = document.getElementById(targetId);
        if (!target) continue;
        const absoluteTop = target.getBoundingClientRect().top + window.scrollY;
        if (absoluteTop <= viewportThreshold) {
            activeId = targetId;
        } else {
            break;
        }
    }

    if (!activeId || (!force && activeId === lastOutlineTargetId)) return;
    const link = outlineTargetMap.get(activeId);
    if (link) {
        lastOutlineTargetId = activeId;
        setNavItemActive(link, { groupSelector: NAV_GROUPS.outline, expandAncestors: true });
    }
}

function debounce(fn, delay = 100) {
    let timer;
    return function debounced(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function bindOutlineNavInteractions(container) {
    if (container.dataset.leafHandlersBound === 'true') return;
    container.dataset.leafHandlersBound = 'true';

    container.addEventListener('click', (event) => {
        const link = event.target.closest('.nav-item');
        if (!link) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) return;
        event.preventDefault();
        setNavItemActive(link, { groupSelector: NAV_GROUPS.outline, expandAncestors: true });
        navigateToHash(link);
    });
}

function navigateToHash(link) {
    try {
        const url = new URL(link.href, window.location.origin);
        if (url.pathname !== window.location.pathname) {
            window.location.href = url.toString();
            return;
        }
        if (url.hash) {
            window.location.hash = url.hash;
        }
    } catch (error) {
        window.location.href = link.href;
    }
}

function activateCurrentHash() {
    const leafLinks = activeOutlineContainer
        ? activeOutlineContainer.querySelectorAll('.nav-item')
        : document.querySelectorAll(NAV_GROUPS.outline);
    if (!leafLinks.length) return;

    const hash = decodeURIComponent(window.location.hash || '');

    if (!hash) {
        const defaultLink = Array.from(leafLinks).find((link) => {
            try {
                const url = new URL(link.href, window.location.origin);
                return url.pathname === window.location.pathname;
            } catch (error) {
                return false;
            }
        });

        if (defaultLink) {
            setNavItemActive(defaultLink, { groupSelector: NAV_GROUPS.outline, expandAncestors: true });
        } else {
            clearNavGroup(NAV_GROUPS.outline);
        }
        return;
    }

    const match = Array.from(leafLinks).find((item) => {
        try {
            const url = new URL(item.href, window.location.origin);
            return decodeURIComponent(url.hash) === hash && url.pathname === window.location.pathname;
        } catch (error) {
            return false;
        }
    });

    if (match) {
        setNavItemActive(match, { groupSelector: NAV_GROUPS.outline, expandAncestors: true });
    } else {
        clearNavGroup(NAV_GROUPS.outline);
    }

    updateOutlineByScroll(true);
}

function ensureHashListener() {
    if (hashListenerBound) return;
    window.addEventListener('hashchange', activateCurrentHash);
    hashListenerBound = true;
}

window.Highlight = Object.assign(window.Highlight || {}, {
    refreshOutline: activateCurrentHash,
    setActive: (link, options) => setNavItemActive(link, options),
    groups: NAV_GROUPS
});

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
