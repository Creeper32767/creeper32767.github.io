// Initialize collapsible article sections: add a triangle toggle and hide body by default
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card-content');
    cards.forEach(card => {
        // find first h3 heading to act as summary
        const h3 = card.querySelector('h3');
        if (!h3) return;

        // collect following sibling elements into a body wrapper
        const body = document.createElement('div');
        body.className = 'article-body';

        let sibling = h3.nextElementSibling;
        while (sibling) {
            const next = sibling.nextElementSibling;
            body.appendChild(sibling);
            sibling = next;
        }

        // if no body content, nothing to collapse
        if (!body.children.length) return;

        card.appendChild(body);

        // create toggle button (triangle icon)
        const btn = document.createElement('button');
        btn.className = 'article-toggle';
        btn.type = 'button';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', '展开 / 收起 文章内容');
        btn.innerHTML = '<img src="/assets/static/icons/arrow.svg" alt="toggle">';

        // append button into the h3 so it appears on the right
        h3.appendChild(btn);

        // click toggles collapsed state
        btn.addEventListener('click', function (ev) {
            ev.preventDefault();
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
            body.classList.toggle('open', !expanded);
        });
    });
});