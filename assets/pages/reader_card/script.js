document.addEventListener('DOMContentLoaded', () => {
    initReaderCard();
});

/* --- Initialization --- */
function initReaderCard() {
    const elements = getElements();
    
    // Setup Initial State
    setCurrentDate(elements);
    initColorPreview(elements);
    updateCard(elements);

    // Bind Events
    bindEvents(elements);
}

/* --- Core Logic --- */
function updateCard(elements) {
    // Update Content
    elements.display.quote.textContent = elements.input.quote.value || "此处显示摘抄内容...";
    elements.display.name.textContent = elements.input.name.value || "摘录者";
    elements.display.cardTitle.textContent = elements.input.cardTitle.value || "卡片标题";
    elements.display.bookTitle.textContent = elements.input.bookTitle.value || "书籍标题";
    elements.display.author.textContent = elements.input.author.value || "作者姓名";

    // Update Date
    updateCardDate(elements);

    // Apply Styles
    elements.display.cardTitle.style.fontFamily = elements.input.titleFont.value;
    elements.display.cardTitle.style.color = elements.style.titleColor.value;
    
    elements.display.quote.style.fontFamily = elements.input.textFont.value;
    elements.display.quote.style.color = elements.style.textColor.value;

    const card = document.querySelector('.card');
    card.style.backgroundColor = elements.style.bgColor.value;
    document.querySelector('.card-footer').style.borderTop = `1px solid ${elements.style.textColor.value}33`;

    // Animation
    card.style.transform = 'scale(0.98)';
    setTimeout(() => card.style.transform = 'scale(1)', 200);
}

function exportToPNG(elements) {
    const card = document.getElementById('card');
    const btn = elements.actions.exportBtn;

    btn.textContent = '正在生成图片...';
    btn.disabled = true;

    html2canvas(card, {
        scale: 4,
        backgroundColor: null,
        useCORS: true
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        elements.output.image.src = imgData;
        elements.output.container.style.display = 'block';

        elements.output.downloadLink.href = imgData;
        elements.output.downloadLink.download = `读者卡片_${Date.now()}.png`;

        btn.textContent = '导出为高清图片';
        btn.disabled = false;
        elements.output.container.scrollIntoView({ behavior: 'smooth' });
    });
}

function loadRandomExample(elements) {
    elements.input.cardTitle.value = "致所有不甘平凡的你";
    elements.input.name.value = "一位读者";
    elements.input.bookTitle.value = "我生来就是高山";
    elements.input.author.value = "佚名";
    elements.input.quote.value = "我生来就是高山而非溪流，我欲于群峰之巅俯视平庸的沟壑；我生来就是人杰而非草芥，我站在伟人之肩俯视卑微的懦夫。";
    
    elements.input.titleFont.value = "'Ma Shan Zheng', cursive";
    elements.input.textFont.value = "'Noto Serif SC', serif";
    
    elements.style.titleColor.value = "#3a1c71";
    elements.style.textColor.value = "#3a1c71";
    elements.style.bgColor.value = "#ffffff";
    elements.style.accentColor.value = "#8a5dff";

    initColorPreview(elements);
    updateCard(elements);
}

/* --- Helpers --- */
function getElements() {
    return {
        input: {
            quote: document.getElementById('quote-textarea'),
            name: document.getElementById('name-input'),
            date: document.getElementById('date-input'),
            cardTitle: document.getElementById('card-title-input'),
            bookTitle: document.getElementById('book-title-input'),
            author: document.getElementById('author-input'),
            titleFont: document.getElementById('title-font'),
            textFont: document.getElementById('text-font'),
            imageUpload: document.getElementById('image-upload-input')
        },
        display: {
            quote: document.getElementById('quote-content'),
            name: document.getElementById('display-name'),
            date: document.getElementById('display-date'),
            cardTitle: document.getElementById('card-title-display'),
            bookTitle: document.getElementById('display-book-title'),
            author: document.getElementById('display-author'),
            imagePreview: document.getElementById('image-preview'),
            imageContainer: document.getElementById('image-container')
        },
        style: {
            titleColor: document.getElementById('title-color'),
            titlePreview: document.getElementById('title-preview'),
            textColor: document.getElementById('text-color'),
            textPreview: document.getElementById('text-preview'),
            bgColor: document.getElementById('bg-color'),
            bgPreview: document.getElementById('bg-preview'),
            accentColor: document.getElementById('accent-color'),
            accentPreview: document.getElementById('accent-preview')
        },
        actions: {
            generateBtn: document.getElementById('generate-btn'),
            exportBtn: document.getElementById('export-btn'),
            randomBtn: document.getElementById('random-example-btn'),
            uploadBtn: document.getElementById('upload-btn'),
            quoteOptions: document.querySelectorAll('.quote-option')
        },
        output: {
            container: document.getElementById('output-container'),
            image: document.getElementById('output-image'),
            downloadLink: document.getElementById('download-link')
        }
    };
}

function setCurrentDate(elements) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    elements.input.date.value = dateStr;
    updateCardDate(elements);
}

function updateCardDate(elements) {
    if (!elements.input.date.value) return;
    const date = new Date(elements.input.date.value);
    elements.display.date.textContent = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

function initColorPreview(elements) {
    const update = (input, preview) => preview.style.backgroundColor = input.value;
    update(elements.style.titleColor, elements.style.titlePreview);
    update(elements.style.textColor, elements.style.textPreview);
    update(elements.style.bgColor, elements.style.bgPreview);
    update(elements.style.accentColor, elements.style.accentPreview);
}

function handleImageUpload(event, elements) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgTag = `<img src="${e.target.result}" alt="Preview">`;
            elements.display.imagePreview.innerHTML = imgTag;
            elements.display.imageContainer.innerHTML = imgTag;
        };
        reader.readAsDataURL(file);
    }
}

/* --- Event Binding --- */
function bindEvents(elements) {
    // Main Actions
    elements.actions.generateBtn.addEventListener('click', () => updateCard(elements));
    elements.actions.exportBtn.addEventListener('click', () => exportToPNG(elements));
    elements.actions.randomBtn.addEventListener('click', () => loadRandomExample(elements));

    // Inputs
    elements.input.date.addEventListener('change', () => updateCardDate(elements));

    // Color Pickers
    const bindColor = (input, preview) => {
        input.addEventListener('input', function() {
            preview.style.backgroundColor = this.value;
        });
    };
    bindColor(elements.style.titleColor, elements.style.titlePreview);
    bindColor(elements.style.textColor, elements.style.textPreview);
    bindColor(elements.style.bgColor, elements.style.bgPreview);
    bindColor(elements.style.accentColor, elements.style.accentPreview);

    // Image Upload
    elements.actions.uploadBtn.addEventListener('click', () => elements.input.imageUpload.click());
    elements.input.imageUpload.addEventListener('change', (e) => handleImageUpload(e, elements));

    // Preset Quotes
    elements.actions.quoteOptions.forEach(option => {
        option.addEventListener('click', function() {
            elements.input.quote.value = this.getAttribute('data-quote');
            this.style.backgroundColor = 'rgba(138, 93, 255, 0.2)';
            setTimeout(() => this.style.backgroundColor = '', 500);
        });
    });
}