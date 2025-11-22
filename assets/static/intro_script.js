const typewriterLines = [
    "欢迎来到我的观测报告，这里记录着一只黄狸猫的阅读、游戏与生活碎片。",
    "我是 Haley Herzog，也被称为 Kitten Haley。",
    "在这里，你会发现我对书籍的热爱、对游戏的独特见解，以及我作为一个开发者的点滴。",
    "希望这些内容能让你更了解我，感谢你的到来！"
];

function runTypewriter(target, lines, speed = 120, pause = 900) {
    if (!target || !lines?.length) return;
    let lineIndex = 0;
    let charIndex = 0;

    function typeNext() {
        const current = lines[lineIndex];
        if (charIndex <= current.length) {
            target.textContent = current.slice(0, charIndex);
            charIndex++;
            setTimeout(typeNext, speed);
        } else {
            setTimeout(() => {
                charIndex = 0;
                lineIndex = (lineIndex + 1) % lines.length;
                typeNext();
            }, pause);
        }
    }

    typeNext();
}

function initFadeIns() {
    const cards = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => entry.target.classList.add('visible'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => observer.observe(card));
}

document.addEventListener('DOMContentLoaded', () => {
    const textEl = document.getElementById('typewriter-text');
    runTypewriter(textEl, typewriterLines);
    initFadeIns();
});