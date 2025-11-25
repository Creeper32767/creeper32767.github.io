document.addEventListener('DOMContentLoaded', () => {
    initCollapsibleArticles();
});

/* --- Collapsible Articles System --- */
function initCollapsibleArticles() {
    const cards = document.querySelectorAll('.card-content');

    cards.forEach(card => {
        const header = card.querySelector('h3');
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