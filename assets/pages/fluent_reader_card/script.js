document.addEventListener('DOMContentLoaded', function () {
    // 获取DOM元素
    const quoteTextarea = document.getElementById('quote-textarea');
    const insightTextarea = document.getElementById('insight-textarea');
    const nameInput = document.getElementById('name-input');
    const dateInput = document.getElementById('date-input');
    const generateBtn = document.getElementById('generate-btn');
    const exportBtn = document.getElementById('export-btn');
    const cardTitleInput = document.getElementById('card-title-input');
    const bookTitleInput = document.getElementById('book-title-input');
    const authorInput = document.getElementById('author-input');
    const uploadBtn = document.getElementById('upload-btn');
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const imageContainer = document.getElementById('image-container');
    const titleFontSelect = document.getElementById('title-font');
    const textFontSelect = document.getElementById('text-font');

    const displayQuote = document.getElementById('quote-content');
    const displayInsight = document.getElementById('insight-content');
    const displayName = document.getElementById('display-name');
    const displayDate = document.getElementById('display-date');
    const cardTitleDisplay = document.getElementById('card-title-display');
    const displayBookTitle = document.getElementById('display-book-title');
    const displayAuthor = document.getElementById('display-author');

    // 样式控制元素
    const titleColor = document.getElementById('title-color');
    const titlePreview = document.getElementById('title-preview');
    const textColor = document.getElementById('text-color');
    const textPreview = document.getElementById('text-preview');
    const bgColor = document.getElementById('bg-color');
    const bgPreview = document.getElementById('bg-preview');
    const accentColor = document.getElementById('accent-color');
    const accentPreview = document.getElementById('accent-preview');

    // 输出区域
    const outputContainer = document.getElementById('output-container');
    const outputImage = document.getElementById('output-image');
    const downloadLink = document.getElementById('download-link');

    // 预设段落
    const quoteOptions = document.querySelectorAll('.quote-option');

    // 设置当前日期为默认值
    function setCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;

        // 更新卡片上的日期显示
        displayDate.textContent = `${year}/${month}/${day}`;
    }

    // 更新卡片
    function updateCard() {
        // 更新内容
        displayQuote.textContent = quoteTextarea.value;
        displayInsight.textContent = insightTextarea.value;
        displayName.textContent = nameInput.value || "佚名";
        cardTitleDisplay.textContent = cardTitleInput.value || "卡片标题";
        displayBookTitle.textContent = bookTitleInput.value || "书籍名称";
        displayAuthor.textContent = authorInput.value || "作者姓名";

        // 更新日期显示
        if (dateInput.value) {
            const date = new Date(dateInput.value);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            displayDate.textContent = `${year}/${month}/${day}`;
        }

        // 应用样式
        cardTitleDisplay.style.fontFamily = titleFontSelect.value;
        cardTitleDisplay.style.color = titleColor.value;

        displayQuote.style.fontFamily = textFontSelect.value;
        displayQuote.style.color = textColor.value;

        displayInsight.style.fontFamily = textFontSelect.value;

        document.querySelector('.card').style.backgroundColor = bgColor.value;
        document.querySelector('.card::before').style.background = accentColor.value;

        // 添加动画效果
        const card = document.querySelector('.card');
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 300);
    }

    // 初始化颜色预览
    function initColorPreview() {
        titlePreview.style.backgroundColor = titleColor.value;
        textPreview.style.backgroundColor = textColor.value;
        bgPreview.style.backgroundColor = bgColor.value;
        accentPreview.style.backgroundColor = accentColor.value;
    }

    // 导出为PNG
    function exportToPNG() {
        const card = document.getElementById('card');

        // 显示加载提示
        exportBtn.textContent = '正在生成图片...';
        exportBtn.disabled = true;

        html2canvas(card, {
            scale: 4,
            backgroundColor: null,
            useCORS: true
        }).then(canvas => {
            // 将画布转换为图片
            const imgData = canvas.toDataURL('image/png');
            outputImage.src = imgData;
            outputContainer.style.display = 'block';

            // 设置下载链接
            downloadLink.href = imgData;
            downloadLink.download = '读者卡片_' + new Date().getTime() + '.png';

            // 恢复按钮状态
            exportBtn.textContent = '导出为高清图片';
            exportBtn.disabled = false;

            // 滚动到输出区域
            outputContainer.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // 处理图片上传
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // 更新预览图
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="预览">`;

                // 更新卡片上的图片
                imageContainer.innerHTML = `<img src="${e.target.result}" alt="个人照片">`;
            };
            reader.readAsDataURL(file);
        }
    }

    // 事件监听器
    generateBtn.addEventListener('click', updateCard);
    exportBtn.addEventListener('click', exportToPNG);

    // 日期更改事件
    dateInput.addEventListener('change', function () {
        if (dateInput.value) {
            const date = new Date(dateInput.value);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            displayDate.textContent = `${year}/${month}/${day}`;
        }
    });

    // 颜色选择器事件
    titleColor.addEventListener('input', function () {
        titlePreview.style.backgroundColor = this.value;
    });

    textColor.addEventListener('input', function () {
        textPreview.style.backgroundColor = this.value;
    });

    bgColor.addEventListener('input', function () {
        bgPreview.style.backgroundColor = this.value;
    });

    accentColor.addEventListener('input', function () {
        accentPreview.style.backgroundColor = this.value;
    });

    // 预设段落点击事件
    quoteOptions.forEach(option => {
        option.addEventListener('click', function () {
            quoteTextarea.value = this.getAttribute('data-quote');
            // 添加动画反馈
            this.style.backgroundColor = 'rgba(0, 120, 215, 0.2)';
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 500);
        });
    });

    // 图片上传事件
    uploadBtn.addEventListener('click', function () {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', handleImageUpload);

    // 初始化
    setCurrentDate();
    initColorPreview();
    updateCard(); // 初始渲染卡片
});