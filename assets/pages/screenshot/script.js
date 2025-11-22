document.addEventListener('DOMContentLoaded', () => {
    initScreenshotTool();
});

/* --- Initialization --- */
function initScreenshotTool() {
    const elements = getElements();
    
    // Initial Setup
    displayBrowserHeaders(elements);
    
    // Bind Events
    bindEvents(elements);
}

/* --- Core Logic --- */
async function handlePaste(elements) {
    try {
        const text = await navigator.clipboard.readText();
        elements.input.url.value = text;
        elements.actions.captureBtn.style.display = 'none';
        elements.actions.loadBtn.click();
        updateStatus(elements, '链接已成功粘贴！');
    } catch (err) {
        updateStatus(elements, '无法读取剪贴板。请确保您已授予权限。');
        console.error('Clipboard read failed:', err);
    }
}

function handleLoad(elements) {
    const url = elements.input.url.value.trim();
    if (!url.startsWith('http')) {
        updateStatus(elements, '错误：请输入一个有效的、以 http:// 或 https:// 开头的网址。');
        return;
    }
    
    // Reset UI
    updateStatus(elements, '正在加载目标网页...', true);
    elements.actions.captureBtn.style.display = 'none';
    
    // Load Iframe
    elements.display.iframe.src = 'about:blank';
    elements.display.iframe.src = url;

    // Set Timeout
    const loadTimeout = setTimeout(() => {
        updateStatus(elements, `错误：加载超时。目标网站 (${url}) 可能禁止了嵌入。`);
    }, 20000);

    // Bind Iframe Events
    elements.display.iframe.onload = () => {
        clearTimeout(loadTimeout);
        updateStatus(elements, '网页加载成功！您现在可以与下方页面交互，并在合适的时机点击按钮生成快照。');
        elements.actions.captureBtn.style.display = 'flex';
    };

    elements.display.iframe.onerror = () => {
        clearTimeout(loadTimeout);
        updateStatus(elements, `错误：加载失败。目标网站 (${url}) 明确拒绝了连接。`);
    };
}

function handleCapture(elements) {
    updateStatus(elements, '正在准备生成快照...', false, true);
    
    let captureTimeout = setTimeout(() => {
        updateStatus(elements, '错误：生成超时，页面可能过于复杂或存在兼容性问题。');
        elements.actions.captureBtn.style.display = 'flex';
    }, 30000);

    const iframeDoc = elements.display.iframe.contentWindow.document;

    html2canvas(iframeDoc.body, {
        width: iframeDoc.documentElement.scrollWidth,
        height: iframeDoc.documentElement.scrollHeight,
        useCORS: true,
        allowTaint: true,
        onprogress: (progress) => {
            const percent = Math.round(progress * 100);
            elements.status.progress.value = percent;
            elements.status.progressText.textContent = `${percent}%`;
            
            clearTimeout(captureTimeout);
            captureTimeout = setTimeout(() => {
                updateStatus(elements, '错误：生成超时，页面可能过于复杂或存在兼容性问题。');
                elements.actions.captureBtn.style.display = 'flex';
            }, 30000);
        }
    }).then(canvas => {
        clearTimeout(captureTimeout);
        processCaptureResult(canvas, elements);
    }).catch(error => {
        clearTimeout(captureTimeout);
        console.error('html2canvas error:', error);
        updateStatus(elements, '错误：生成图片失败。可能是由于网站内容的安全限制。');
    }).finally(() => {
        elements.actions.captureBtn.style.display = 'none';
        elements.status.progressContainer.style.display = 'none';
    });
}

function processCaptureResult(canvas, elements) {
    const imgData = canvas.toDataURL('image/png');
    elements.output.downloadLink.href = imgData;

    try {
        const currentUrl = elements.input.url.value;
        const domain = new URL(currentUrl).hostname;
        elements.output.downloadLink.download = `snapshot-${domain}-${Date.now()}.png`;
    } catch (e) {
        elements.output.downloadLink.download = `snapshot-${Date.now()}.png`;
    }

    updateStatus(elements, '快照生成成功！您可以下载图片了。');
    elements.output.downloadLink.style.display = 'block';
}

/* --- Helpers --- */
function getElements() {
    return {
        input: {
            url: document.getElementById('url-input')
        },
        actions: {
            pasteBtn: document.getElementById('paste-btn'),
            loadBtn: document.getElementById('load-btn'),
            captureBtn: document.getElementById('capture-btn')
        },
        display: {
            iframe: document.getElementById('preview-iframe'),
            headersSection: document.getElementById('headers-section'),
            headersDisplay: document.getElementById('headers-display')
        },
        status: {
            message: document.getElementById('status-message'),
            progressContainer: document.getElementById('progress-container'),
            progress: document.getElementById('capture-progress'),
            progressText: document.getElementById('progress-text')
        },
        output: {
            downloadLink: document.getElementById('download-link')
        }
    };
}

function displayBrowserHeaders(elements) {
    const { userAgent, platform, language, vendor } = navigator;
    elements.display.headersDisplay.textContent =
        `User-Agent: ${userAgent}\nPlatform: ${platform}\nLanguage: ${language}\nVendor: ${vendor}`;
    elements.display.headersSection.style.display = 'block';
}

function updateStatus(elements, message, isLoading = false, isProgress = false) {
    elements.status.message.textContent = message;
    
    if (isProgress) {
        elements.status.progressContainer.style.display = 'flex';
        elements.status.progress.value = 0;
        elements.status.progressText.textContent = '0%';
        elements.actions.captureBtn.style.display = 'none';
    } else {
        elements.status.progressContainer.style.display = 'none';
    }

    if (isLoading) {
        elements.actions.captureBtn.style.display = 'none';
    }
    
    if (!isProgress && !isLoading && message.includes('成功')) {
        // Keep download link visible if success
    } else {
        elements.output.downloadLink.style.display = 'none';
    }
}

/* --- Event Binding --- */
function bindEvents(elements) {
    elements.actions.pasteBtn.addEventListener('click', () => handlePaste(elements));
    elements.actions.loadBtn.addEventListener('click', () => handleLoad(elements));
    elements.actions.captureBtn.addEventListener('click', () => handleCapture(elements));
}