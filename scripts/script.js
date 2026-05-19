document.addEventListener('DOMContentLoaded', () => {
    initFooter();
});

/* --- Footer System --- */
function initFooter() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}