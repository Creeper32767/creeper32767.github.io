/* --- Initialization --- */
const editor = CodeMirror(document.getElementById('code-editor'), {
    lineNumbers: true,
    mode: "text/plain",
    theme: "default",
    lineWrapping: true,
    indentUnit: 4,
    tabSize: 4,
    value: "",
    extraKeys: {
        "Ctrl-S": saveFile,
        "Cmd-S": saveFile,
        "Ctrl-E": showClearConfirm,
        "Cmd-E": showClearConfirm,
        "Ctrl-T": toggleTheme,
        "Cmd-T": toggleTheme
    }
});

// DOM Elements
const elements = {
    uploadBtn: document.getElementById('upload-button'),
    downloadBtn: document.getElementById('download-button'),
    clearBtn: document.getElementById('clear-button'),
    themeToggle: document.getElementById('theme-toggle'),
    filenameInput: document.getElementById('filename-input'),
    langSelector: document.getElementById('language-selector'),
    statusMsg: document.getElementById('status-message'),
    posDisplay: document.getElementById('position-display'),
    // Modals
    helpLink: document.getElementById('help-link'),
    helpModal: document.getElementById('help-modal'),
    closeModal: document.getElementById('close-modal'),
    confirmModal: document.getElementById('confirm-modal'),
    confirmClearBtn: document.getElementById('confirm-clear-button'),
    cancelClearBtn: document.getElementById('cancel-clear-button')
};

// Hidden File Input
const fileUploader = document.createElement('input');
fileUploader.type = 'file';
fileUploader.style.display = 'none';
document.body.appendChild(fileUploader);

/* --- Core Logic --- */
function saveFile() {
    const content = editor.getValue();
    if (!content.trim()) {
        updateStatus('提示：编辑器内容为空');
        return;
    }

    let filename = elements.filenameInput.value.trim() || 'file';
    elements.filenameInput.value = filename;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    updateStatus(`文件已下载: ${filename}`);
}

function performClear() {
    editor.setValue("");
    elements.filenameInput.value = "myfile";
    elements.langSelector.value = "text/plain";
    editor.setOption("mode", "text/plain");
    updateStatus('编辑器内容已清空');
    updateCursorPosition();
}

function toggleTheme() {
    const isDark = document.body.classList.toggle("dark-theme");
    editor.setOption("theme", isDark ? "dracula" : "default");
    updateStatus(isDark ? '已切换至暗色主题' : '已切换至亮色主题');
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
        updateStatus('错误：文件过大（最大支持10MB）');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        editor.setValue(e.target.result);
        elements.filenameInput.value = file.name;

        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        const languageMap = {
            '.js': 'javascript', '.py': 'python', '.html': 'html', '.css': 'css',
            '.c': 'text/x-csrc', '.cpp': 'text/x-c++src', '.java': 'text/x-java',
            '.md': 'markdown', '.txt': 'text/plain'
        };

        const lang = languageMap[fileExt] || 'text/plain';
        elements.langSelector.value = lang;
        editor.setOption("mode", lang);

        updateStatus(`已加载文件: ${file.name}`);
        updateCursorPosition();
    };

    reader.onerror = (e) => {
        updateStatus("错误: 无法读取文件");
        console.error("Error reading file:", e);
    };

    reader.readAsText(file);
    event.target.value = '';
}

/* --- UI Helpers --- */
function updateCursorPosition() {
    const cursor = editor.getCursor();
    elements.posDisplay.textContent = `行数: ${cursor.line + 1} | 列数: ${cursor.ch + 1}`;
}

function updateStatus(msg) {
    elements.statusMsg.textContent = msg;
}

function showClearConfirm() {
    if (editor.getValue().trim() === '') {
        updateStatus('提示：编辑器内容已为空');
        return;
    }
    elements.confirmModal.style.display = 'flex';
}

/* --- Event Listeners --- */
// Toolbar Actions
elements.uploadBtn.addEventListener('click', () => fileUploader.click());
fileUploader.addEventListener('change', handleFileUpload);
elements.downloadBtn.addEventListener('click', saveFile);
elements.clearBtn.addEventListener('click', showClearConfirm);
elements.themeToggle.addEventListener('click', toggleTheme);

// Settings
elements.langSelector.addEventListener('change', () => {
    const lang = elements.langSelector.value;
    editor.setOption("mode", lang);
    updateStatus(`已切换到: ${elements.langSelector.selectedOptions[0].textContent}`);
});

// Editor Events
editor.on("cursorActivity", updateCursorPosition);

// Modal Actions
elements.helpLink.addEventListener('click', () => elements.helpModal.style.display = 'flex');
elements.closeModal.addEventListener('click', () => elements.helpModal.style.display = 'none');
elements.confirmClearBtn.addEventListener('click', () => {
    performClear();
    elements.confirmModal.style.display = 'none';
});
elements.cancelClearBtn.addEventListener('click', () => elements.confirmModal.style.display = 'none');

window.addEventListener('click', (event) => {
    if (event.target === elements.helpModal || event.target === elements.confirmModal) {
        event.target.style.display = 'none';
    }
});

/* --- Startup --- */
updateCursorPosition();
editor.focus();