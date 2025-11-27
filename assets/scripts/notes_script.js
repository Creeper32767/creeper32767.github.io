document.addEventListener('DOMContentLoaded', () => {
    initDynamicSections().finally(() => initCollapsibleArticles());
});

/* --- Dynamic Content Loader --- */
function initDynamicSections() {
    const sections = document.querySelectorAll('[data-json]');
    if (!sections.length) return Promise.resolve();

    const loaders = Array.from(sections).map((section) => loadSection(section));
    return Promise.allSettled(loaders);
}

function loadSection(section) {
    const src = section.dataset.json;
    const entryType = section.dataset.entryType || 'generic';

    if (!src) return Promise.resolve();

    setSectionStatus(section, 'loading');

    return fetch(src)
        .then((response) => {
            if (!response.ok) throw new Error('Failed to fetch section data');
            return response.json();
        })
        .then((entries) => {
            if (!Array.isArray(entries)) throw new Error('Invalid section payload');
            renderSection(section, entries, entryType);
        })
        .catch((error) => {
            console.error('Error loading section:', error);
            setSectionStatus(section, 'error');
        });
}

function renderSection(section, entries, entryType) {
    section.innerHTML = '';
    const fragment = document.createDocumentFragment();

    entries.forEach((entry, index) => {
        const card = buildCard(entry, entryType);
        if (!card) return;
        fragment.appendChild(card);
        if (index !== entries.length - 1) {
            fragment.appendChild(document.createElement('br'));
        }
    });

    section.appendChild(fragment);
}

function buildCard(entry, entryType) {
    if (entryType === 'verses') {
        return buildVerseCard(entry);
    }
    return buildRichCard(entry);
}

function buildVerseCard(entry) {
    const card = document.createElement('fluent-card');
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';

    const heading = document.createElement('h3');
    heading.textContent = entry.date || '';
    cardContent.appendChild(heading);

    (entry.content || []).forEach((line) => {
        const paragraph = document.createElement('p');
        paragraph.innerHTML = line ? line : '&nbsp;';
        cardContent.appendChild(paragraph);
    });

    const category = document.createElement('div');
    category.className = 'category';
    (entry.tags || []).forEach((tag) => category.appendChild(createTagBadge(tag)));

    card.appendChild(cardContent);
    card.appendChild(category);
    return card;
}

function buildRichCard(entry) {
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

    (entry.content || []).forEach((block) => {
        if (typeof block === 'string') {
            const paragraph = document.createElement('p');
            paragraph.innerHTML = block || '&nbsp;';
            cardContent.appendChild(paragraph);
        } else if (block && block.type === 'list') {
            const list = document.createElement('ul');
            (block.items || []).forEach((item) => {
                const li = document.createElement('li');
                li.innerHTML = item;
                list.appendChild(li);
            });
            cardContent.appendChild(list);
        }
    });

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

function setSectionStatus(container, state) {
    const statusMap = {
        loading: '正在加载内容……',
        error: '内容加载失败，请稍后重试。'
    };

    container.innerHTML = `<p class="poem-${state}">${statusMap[state] || ''}</p>`;
}

/* --- Collapsible Articles System --- */
function initCollapsibleArticles() {
    const cards = document.querySelectorAll('.card-content');

    cards.forEach(card => {
        const header = card.querySelector('.title-block');
        if (!header) return;

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