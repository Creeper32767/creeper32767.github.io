document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Cache ---
    const elements = {
        urlInput: document.getElementById('url-input'),
        pasteBtn: document.getElementById('paste-btn'),
        loadBtn: document.getElementById('load-btn'),
        captureBtn: document.getElementById('capture-btn'),
        iframe: document.getElementById('preview-iframe'),
        statusMessage: document.getElementById('status-message'),
        progressContainer: document.getElementById('progress-container'),
        captureProgress: document.getElementById('capture-progress'),
        progressText: document.getElementById('progress-text'),
        downloadLink: document.getElementById('download-link'),
        headersSection: document.getElementById('headers-section'),
        headersDisplay: document.getElementById('headers-display'),
    };

    let currentUrl = '';
    let captureTimeout;

    // --- Function to display browser info ---
    function displayBrowserHeaders() {
        const { userAgent, platform, language, vendor } = navigator;
        elements.headersDisplay.textContent = 
`User-Agent: ${userAgent}
Platform: ${platform}
Language: ${language}
Vendor: ${vendor}`;
        elements.headersSection.style.display = 'block';
    }
    
    // --- UI Update Functions ---
    function showStatus(message) {
        elements.statusMessage.textContent = message;
        elements.progressContainer.style.display = 'none';
        elements.downloadLink.style.display = 'none';
    }

    function showLoading(message) {
        showStatus(message);
        elements.captureBtn.style.display = 'none';
    }

    function showCaptureProgress(message) {
        showStatus(message);
        elements.progressContainer.style.display = 'flex';
        elements.captureProgress.value = 0;
        elements.progressText.textContent = '0%';
        elements.captureBtn.style.display = 'none';
    }

    // --- Core Logic ---
    elements.pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            elements.urlInput.value = text;
            showStatus('链接已成功粘贴！');
        } catch (err) {
            showStatus('无法读取剪贴板。请确保您已授予权限。');
            console.error('Clipboard read failed:', err);
        }
    });

    elements.loadBtn.addEventListener('click', () => {
        const url = elements.urlInput.value.trim();
        if (!url.startsWith('http')) {
            showStatus('错误：请输入一个有效的、以 http:// 或 https:// 开头的网址。');
            return;
        }
        currentUrl = url;

        showLoading('正在加载目标网页...');
        elements.iframe.src = 'about:blank';
        elements.iframe.src = url;

        let loadTimeout = setTimeout(() => {
            showStatus(`错误：加载超时。目标网站 (${url}) 可能禁止了嵌入。`);
        }, 20000);

        elements.iframe.onload = () => {
            clearTimeout(loadTimeout);
            showStatus('网页加载成功！您现在可以与下方页面交互，并在合适的时机点击按钮生成快照。');
            elements.captureBtn.style.display = 'inline-block';
        };
        
        elements.iframe.onerror = () => {
             clearTimeout(loadTimeout);
             showStatus(`错误：加载失败。目标网站 (${url}) 明确拒绝了连接。`);
        }
    });

    elements.captureBtn.addEventListener('click', () => {
        showCaptureProgress('正在准备生成快照...');
        
        // Watchdog timer to prevent hangs
        captureTimeout = setTimeout(() => {
            showStatus('错误：生成超时，页面可能过于复杂或存在兼容性问题。');
            elements.captureBtn.style.display = 'inline-block';
        }, 30000); // 30 second timeout

        const iframeDoc = elements.iframe.contentWindow.document;
        
        html2canvas(iframeDoc.body, {
            width: iframeDoc.documentElement.scrollWidth,
            height: iframeDoc.documentElement.scrollHeight,
            useCORS: true,
            allowTaint: true,
            onprogress: (progress) => {
                const percent = Math.round(progress * 100);
                elements.captureProgress.value = percent;
                elements.progressText.textContent = `${percent}%`;
                // Reset the watchdog timer as long as we're making progress
                clearTimeout(captureTimeout);
                captureTimeout = setTimeout(() => {
                    showStatus('错误：生成超时，页面可能过于复杂或存在兼容性问题。');
                    elements.captureBtn.style.display = 'inline-block';
                }, 30000);
            }
        }).then(canvas => {
            clearTimeout(captureTimeout); // Capture successful, clear the watchdog
            const imgData = canvas.toDataURL('image/png');
            elements.downloadLink.href = imgData;
            
            try {
                const domain = new URL(currentUrl).hostname;
                elements.downloadLink.download = `snapshot-${domain}-${Date.now()}.png`;
            } catch (e) {
                elements.downloadLink.download = `snapshot-${Date.now()}.png`;
            }

            showStatus('快照生成成功！您可以下载图片了。');
            elements.downloadLink.style.display = 'block';

        }).catch(error => {
            clearTimeout(captureTimeout);
            console.error('html2canvas error:', error);
            showStatus('错误：生成图片失败。可能是由于网站内容的安全限制。');
        }).finally(() => {
            elements.captureBtn.style.display = 'inline-block';
            elements.progressContainer.style.display = 'none';
        });
    });

    // --- Initializer ---
    displayBrowserHeaders();
});