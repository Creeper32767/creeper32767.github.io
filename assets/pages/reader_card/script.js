document.addEventListener('DOMContentLoaded', function () {
    // DOM Element Lookups
    const elements = {
        quoteTextarea: document.getElementById('quote-textarea'),
        nameInput: document.getElementById('name-input'),
        dateInput: document.getElementById('date-input'),
        cardTitleInput: document.getElementById('card-title-input'),
        bookTitleInput: document.getElementById('book-title-input'),
        authorInput: document.getElementById('author-input'),
        imageUploadInput: document.getElementById('image-upload-input'),
        imagePreview: document.getElementById('image-preview'),
        imageContainer: document.getElementById('image-container'),

        displayQuote: document.getElementById('quote-content'),
        displayName: document.getElementById('display-name'),
        displayDate: document.getElementById('display-date'),
        cardTitleDisplay: document.getElementById('card-title-display'),
        displayBookTitle: document.getElementById('display-book-title'),
        displayAuthor: document.getElementById('display-author'),

        titleFont: document.getElementById('title-font'),
        titleColor: document.getElementById('title-color'),
        titlePreview: document.getElementById('title-preview'),
        textFont: document.getElementById('text-font'),
        textColor: document.getElementById('text-color'),
        textPreview: document.getElementById('text-preview'),
        bgColor: document.getElementById('bg-color'),
        bgPreview: document.getElementById('bg-preview'),
        accentColor: document.getElementById('accent-color'),
        accentPreview: document.getElementById('accent-preview'),

        outputContainer: document.getElementById('output-container'),
        outputImage: document.getElementById('output-image'),
        downloadLink: document.getElementById('download-link'),

        generateBtn: document.getElementById('generate-btn'),
        exportBtn: document.getElementById('export-btn'),
        randomExampleBtn: document.getElementById('random-example-btn'),
        uploadBtn: document.getElementById('upload-btn'),
        quoteOptions: document.querySelectorAll('.quote-option'),
    };

    function setCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        elements.dateInput.value = `${year}-${month}-${day}`;
        updateCardDate();
    }

    function updateCardDate() {
        if (!elements.dateInput.value) return;
        const date = new Date(elements.dateInput.value);
        elements.displayDate.textContent = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }

    function updateCard() {
        elements.displayQuote.textContent = elements.quoteTextarea.value || "此处显示摘抄内容...";
        elements.displayName.textContent = elements.nameInput.value || "摘录者";
        elements.cardTitleDisplay.textContent = elements.cardTitleInput.value || "卡片标题";
        elements.displayBookTitle.textContent = elements.bookTitleInput.value || "书籍标题";
        elements.displayAuthor.textContent = elements.authorInput.value || "作者姓名";

        updateCardDate();

        elements.cardTitleDisplay.style.fontFamily = elements.titleFont.value;
        elements.cardTitleDisplay.style.color = elements.titleColor.value;
        elements.displayQuote.style.fontFamily = elements.textFont.value;
        elements.displayQuote.style.color = elements.textColor.value;

        const cardElement = document.querySelector('.card');
        cardElement.style.backgroundColor = elements.bgColor.value;
        document.querySelector('.card-footer').style.borderTop = `1px solid ${elements.textColor.value}33`;

        cardElement.style.transform = 'scale(0.98)';
        setTimeout(() => { cardElement.style.transform = 'scale(1)'; }, 200);
    }

    function initColorPreview() {
        elements.titlePreview.style.backgroundColor = elements.titleColor.value;
        elements.textPreview.style.backgroundColor = elements.textColor.value;
        elements.bgPreview.style.backgroundColor = elements.bgColor.value;
        elements.accentPreview.style.backgroundColor = elements.accentColor.value;
    }

    function exportToPNG() {
        const card = document.getElementById('card');
        elements.exportBtn.textContent = '正在生成图片...';
        elements.exportBtn.disabled = true;

        html2canvas(card, { scale: 4, backgroundColor: null, useCORS: true })
            .then(canvas => {
                elements.outputImage.src = canvas.toDataURL('image/png');
                elements.outputContainer.style.display = 'block';
                elements.downloadLink.href = elements.outputImage.src;
                elements.downloadLink.download = `读者卡片_${Date.now()}.png`;
            })
            .finally(() => {
                elements.exportBtn.textContent = '导出为高清图片';
                elements.exportBtn.disabled = false;
                elements.outputContainer.scrollIntoView({ behavior: 'smooth' });
            });
    }

    function loadRandomExample() {
        elements.cardTitleInput.value = "致所有不甘平凡的你";
        elements.nameInput.value = "一位读者";
        elements.bookTitleInput.value = "我生来就是高山";
        elements.authorInput.value = "佚名";
        elements.quoteTextarea.value = "我生来就是高山而非溪流，我欲于群峰之巅俯视平庸的沟壑；我生来就是人杰而非草芥，我站在伟人之肩俯视卑微的懦夫。";
        elements.titleFont.value = "'Ma Shan Zheng', cursive";
        elements.textFont.value = "'Noto Serif SC', serif";
        elements.titleColor.value = "#3a1c71";
        elements.textColor.value = "#3a1c71";
        elements.bgColor.value = "#ffffff";
        elements.accentColor.value = "#8a5dff";

        initColorPreview();
        updateCard();
    }

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            const imgHtml = `<img src="${e.target.result}" alt="预览">`;
            elements.imagePreview.innerHTML = imgHtml;
            elements.imageContainer.innerHTML = imgHtml;
        };
        reader.readAsDataURL(file);
    }

    // Event Listeners
    elements.generateBtn.addEventListener('click', updateCard);
    elements.exportBtn.addEventListener('click', exportToPNG);
    elements.randomExampleBtn.addEventListener('click', loadRandomExample);
    elements.dateInput.addEventListener('change', updateCardDate);

    [elements.titleColor, elements.textColor, elements.bgColor, elements.accentColor].forEach(picker => {
        picker.addEventListener('input', initColorPreview);
    });

    elements.quoteOptions.forEach(option => {
        option.addEventListener('click', function () {
            elements.quoteTextarea.value = this.getAttribute('data-quote');
            this.style.backgroundColor = 'rgba(138, 93, 255, 0.2)';
            setTimeout(() => { this.style.backgroundColor = ''; }, 500);
        });
    });

    elements.uploadBtn.addEventListener('click', () => elements.imageUploadInput.click());
    elements.imageUploadInput.addEventListener('change', handleImageUpload);

    // Initializer calls
    setCurrentDate();
    initColorPreview();
    updateCard();
});