document.addEventListener('DOMContentLoaded', () => {
    initDynamicSections().finally(initCollapsibleArticles);
});

const SECTION_STATUS_TEXT = {
    loading: '正在加载内容……',
    error: '内容加载失败，请稍后重试。'
};

/* --- Dynamic Content Loader --- */
async function initDynamicSections() {
    const sections = document.querySelectorAll('[data-json]');
    if (!sections.length) return;

    await Promise.allSettled(Array.from(sections, loadSection));
}

async function loadSection(section) {
    const src = section.dataset.json;
    const entryType = section.dataset.entryType || 'generic';

    if (!src) return;

    setSectionStatus(section, 'loading');

    try {
        const response = await fetch(src);
        if (!response.ok) throw new Error('Failed to fetch section data');

        const entries = await response.json();
        if (!Array.isArray(entries)) throw new Error('Invalid section payload');

        initFilters(section, entries, entryType);
    } catch (error) {
        console.error('Error loading section:', error);
        setSectionStatus(section, 'error');
    }
}

function renderSection(section, entries, entryType) {
    section.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const baseContext = {
        pageName: resolveCurrentPageName(),
        sectionId: section.id || section.dataset.sectionId || entryType
    };

    entries.forEach((entry, index) => {
        const card = buildCard(entry, entryType, { ...baseContext, entryIndex: index });
        if (!card) return;

        fragment.appendChild(card);
        if (index !== entries.length - 1) fragment.appendChild(document.createElement('br'));
    });

    section.appendChild(fragment);
    notifyNavigationRefresh();
}

function buildCard(entry, entryType, context) {
    if (entryType === 'verses') {
        return buildVerseCard(entry, context);
    }
    return buildRichCard(entry, context);
}

function buildVerseCard(entry, context) {
    const card = document.createElement('fluent-card');
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';

    const heading = document.createElement('h3');
    heading.textContent = entry.title || entry.meta || entry.date || '';
    assignHeadingId(heading, entry, context);
    cardContent.appendChild(heading);

    appendTextBlocks(cardContent, entry.content || []);

    const category = document.createElement('div');
    category.className = 'category';
    (entry.tags || []).forEach((tag) => category.appendChild(createTagBadge(tag)));

    card.appendChild(cardContent);
    card.appendChild(category);
    return card;
}

function buildRichCard(entry, context) {
    if (!entry.title) return null;

    const card = document.createElement('fluent-card');
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';

    const titleBlock = document.createElement('div');
    titleBlock.className = 'title-block';

    const mainTitleBlock = document.createElement('div');
    mainTitleBlock.className = 'main-title-block';

    const heading = document.createElement('h3');
    heading.textContent = entry.title;
    assignHeadingId(heading, entry, context);
    mainTitleBlock.appendChild(heading);

    if (entry.meta) {
        const metaSpan = document.createElement('span');
        metaSpan.className = 'entry-meta';
        metaSpan.textContent = entry.meta;
        mainTitleBlock.appendChild(metaSpan);
    }

    titleBlock.appendChild(mainTitleBlock);
    cardContent.appendChild(titleBlock);

    if (entry.subtitle) {
        const subtitle = document.createElement('p');
        subtitle.innerHTML = `<i>${entry.subtitle}</i>`;
        cardContent.appendChild(subtitle);
    }

    appendMixedBlocks(cardContent, entry.content || []);

    const category = document.createElement('div');
    category.className = 'category';
    (entry.tags || []).forEach((tag) => category.appendChild(createTagBadge(tag)));

    card.appendChild(cardContent);
    card.appendChild(category);
    return card;
}

function createTagBadge(tag) {
    const badge = document.createElement('strong');
    if (tag && tag.class) {
        badge.className = tag.class;
    }
    badge.textContent = tag?.label || '';
    return badge;
}

function appendTextBlocks(container, lines) {
    lines.forEach((line) => {
        const paragraph = document.createElement('p');
        paragraph.innerHTML = line || '&nbsp;';
        container.appendChild(paragraph);
    });
}

function appendMixedBlocks(container, blocks) {
    blocks.forEach((block) => {
        if (typeof block === 'string') {
            appendTextBlocks(container, [block]);
            return;
        }

        if (block && block.type === 'list') {
            const list = document.createElement('ul');
            (block.items || []).forEach((item) => {
                const li = document.createElement('li');
                li.innerHTML = item;
                list.appendChild(li);
            });
            container.appendChild(list);
        }
    });
}

function setSectionStatus(container, state) {
    container.innerHTML = `<p class="content-${state}">${SECTION_STATUS_TEXT[state] || ''}</p>`;
}

/* --- Collapsible Articles System --- */
function initCollapsibleArticles(scope = document) {
    const cards = scope.querySelectorAll('.card-content');

    cards.forEach(card => {
        const header = card.querySelector('.title-block');
        if (!header) return;

        // Prevent double initialization
        if (header.querySelector('.article-toggle')) return;

        // 1. Wrap Content
        const body = wrapContent(header);
        if (!body) return; // No content to collapse

        card.appendChild(body);

        // 2. Create Toggle Button
        const toggleBtn = createToggleButton();
        header.appendChild(toggleBtn);

        // 3. Bind Events
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            toggleBtn.setAttribute('aria-expanded', !isExpanded);
            body.classList.toggle('open', !isExpanded);
        });
    });
}

/* --- Helper Functions --- */
function wrapContent(headerElement) {
    const body = document.createElement('div');
    body.className = 'article-body';

    let sibling = headerElement.nextElementSibling;
    while (sibling) {
        const next = sibling.nextElementSibling;
        body.appendChild(sibling);
        sibling = next;
    }

    return body.children.length ? body : null;
}

function createToggleButton() {
    const btn = document.createElement('button');
    btn.className = 'article-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', '展开 / 收起 文章内容');
    btn.innerHTML = '<img src="/assets/static/icons/arrow.svg" alt="toggle">';
    return btn;
}

function assignHeadingId(element, entry, context = {}) {
    if (!element) return;
    const index = context.entryIndex ?? 0;
    const label = (entry.title || entry.meta || entry.subtitle || entry.date || `section ${index + 1}`).trim();
    const scope = context.pageName || 'section';
    element.id = buildAnchorId(label, index, scope);
    return element.id;
}

function buildAnchorId(text, index, scope = 'section') {
    const base = slugifyHeading(text) || 'section';
    const prefix = scope ? `${scope}-` : '';
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

function resolveCurrentPageName() {
    if (typeof window.getCurrentPageName === 'function') {
        return window.getCurrentPageName();
    }
    const segment = window.location.pathname.split('/').pop().replace('.html', '');
    return segment === '' ? 'index' : segment;
}

function notifyNavigationRefresh() {
    if (window.Highlight?.refreshOutline) {
        window.Highlight.refreshOutline();
    }
}
/* --- Filter System --- */
function initFilters(section, entries, entryType) {
    const filterContainerId = `filter-container-${section.id || Math.random().toString(36).substr(2, 9)}`;
    let filterBar = document.getElementById(filterContainerId);

    if (!filterBar) {
        filterBar = document.createElement('div');
        filterBar.id = filterContainerId;
        filterBar.className = 'filter-bar';
        // Insert before the section
        section.parentNode.insertBefore(filterBar, section);
    } else {
        filterBar.innerHTML = '';
    }

    // Extract Metadata
    const months = new Set();
    const types = new Set();

    entries.forEach(entry => {
        if (entry.meta) {
            const parts = entry.meta.split('/');
            if (parts.length >= 2) {
                months.add(`${parts[0]}-${parts[1]}`);
            }
        }
        if (entry.tags && Array.isArray(entry.tags)) {
            entry.tags.forEach(tag => {
                const label = tag.label || tag;
                if (label) types.add(label);
            });
        }
    });

    // Create UI Elements
    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.gap = '10px';
    controls.style.flexWrap = 'wrap';

    const monthSelect = document.createElement('select');
    monthSelect.className = 'fluent-select-sim';
    monthSelect.innerHTML = `<option value="">所有月份</option>` +
        Array.from(months).sort().reverse().map(m => `<option value="${m}">${m}</option>`).join('');

    const typeSelect = document.createElement('select');
    typeSelect.className = 'fluent-select-sim';
    typeSelect.innerHTML = `<option value="">所有类型</option>` +
        Array.from(types).sort().map(t => `<option value="${t}">${t}</option>`).join('');

    const reverseBtn = document.createElement('button');
    reverseBtn.textContent = '倒序显示';
    reverseBtn.className = 'fluent-btn-sim';

    controls.appendChild(monthSelect);
    controls.appendChild(typeSelect);
    controls.appendChild(reverseBtn);

    filterBar.appendChild(controls);

    let isReversed = false;

    const filterAndRender = () => {
        const selectedMonth = monthSelect.value;
        const selectedType = typeSelect.value;

        let filteredEntries = entries.filter(entry => {
            let monthMatch = true;
            if (selectedMonth) {
                if (!entry.meta) monthMatch = false;
                else {
                    const parts = entry.meta.split('/');
                    const entMonth = (parts.length >= 2) ? `${parts[0]}-${parts[1]}` : '';
                    if (entMonth !== selectedMonth) monthMatch = false;
                }
            }

            let typeMatch = true;
            if (selectedType) {
                if (!entry.tags || !Array.isArray(entry.tags)) typeMatch = false;
                else {
                    const hasTag = entry.tags.some(tag => (tag.label || tag) === selectedType);
                    if (!hasTag) typeMatch = false;
                }
            }

            return monthMatch && typeMatch;
        });

        if (isReversed) {
            filteredEntries.reverse();
        }

        renderSection(section, filteredEntries, entryType);
        initCollapsibleArticles(section);
    };

    monthSelect.addEventListener('change', filterAndRender);
    typeSelect.addEventListener('change', filterAndRender);
    reverseBtn.addEventListener('click', () => {
        isReversed = !isReversed;
        reverseBtn.textContent = isReversed ? '正序显示' : '倒序显示';
        filterAndRender();
    });

    filterAndRender();
}
