document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。
            const rect = card.getBoundingClientRect();

            // 计算鼠标相对于卡片左上角的位置
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // 将计算出的 x 和 y 坐标设置为卡片的 CSS 自定义属性
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });
});