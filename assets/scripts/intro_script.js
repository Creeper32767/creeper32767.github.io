/* --- Configuration --- */
const TYPEWRITER_CONFIG = {
    lines: [
        "欢迎来到我的观测报告，这里记录着一只黄狸猫的阅读、游戏与生活碎片。",
        "我是 Haley Herzog，也被称为 Kitten Haley。",
        "在这里，你会发现我对书籍的热爱、对游戏的独特见解，以及我作为一个开发者的点滴。",
        "希望这些内容能让你更了解我，感谢你的到来！"
    ],
    speed: 120,
    pause: 900
};

/* --- Initialization --- */
document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initScrollAnimations();
});

/* --- Typewriter Effect --- */
function initTypewriter() {
    const target = document.getElementById('typewriter-text');
    if (!target) return;

    const { lines, speed, pause } = TYPEWRITER_CONFIG;
    let lineIndex = 0;
    let charIndex = 0;

    function type() {
        const currentLine = lines[lineIndex];

        if (charIndex <= currentLine.length) {
            target.textContent = currentLine.slice(0, charIndex);
            charIndex++;
            setTimeout(type, speed);
        } else {
            setTimeout(() => {
                charIndex = 0;
                lineIndex = (lineIndex + 1) % lines.length;
                type();
            }, pause);
        }
    }

    type();
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));
}