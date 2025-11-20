// 初始化CodeMirror编辑器
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

// 获取DOM元素
const uploadButton = document.getElementById('upload-button');
const fileUploader = document.createElement('input');
fileUploader.type = 'file';
fileUploader.style.display = 'none';
document.body.appendChild(fileUploader);

const downloadButton = document.getElementById('download-button');
const clearButton = document.getElementById('clear-button');
const themeToggle = document.getElementById('theme-toggle');
const filenameInput = document.getElementById('filename-input');
const languageSelector = document.getElementById('language-selector');
const statusMessage = document.getElementById('status-message');
const positionDisplay = document.getElementById('position-display');

// 模态框元素
const helpLink = document.getElementById('help-link');
const helpModal = document.getElementById('help-modal');
const closeModal = document.getElementById('close-modal');
const confirmModal = document.getElementById('confirm-modal');
const confirmClearButton = document.getElementById('confirm-clear-button');
const cancelClearButton = document.getElementById('cancel-clear-button');

// 更新光标位置
function updateCursorPosition() {
    const cursor = editor.getCursor();
    positionDisplay.textContent = `行数: ${cursor.line + 1} | 列数: ${cursor.ch + 1}`;
}

// 保存文件
function saveFile() {
    const content = editor.getValue();
    if (!content.trim()) {
        statusMessage.textContent = '提示：编辑器内容为空';
        return;
    }
    
    let filename = filenameInput.value.trim() || 'file';
    filenameInput.value = filename;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    statusMessage.textContent = `文件已下载: ${filename}`;
}

// 显示清空确认模态框
function showClearConfirm() {
    if (editor.getValue().trim() === '') {
        statusMessage.textContent = '提示：编辑器内容已为空';
        return;
    }
    confirmModal.style.display = 'flex';
}

// 实际执行清空操作
function performClear() {
    editor.setValue("");
    filenameInput.value = "myfile";
    languageSelector.value = "text/plain";
    editor.setOption("mode", "text/plain");
    statusMessage.textContent = '编辑器内容已清空';
    updateCursorPosition();
}

// 切换主题
function toggleTheme() {
    const isDark = document.body.classList.toggle("dark-theme");
    editor.setOption("theme", isDark ? "dracula" : "default");
    statusMessage.textContent = isDark ? '已切换至暗色主题' : '已切换至亮色主题';
}

// 上传文件处理
uploadButton.addEventListener('click', () => {
    fileUploader.click();
});

fileUploader.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
        statusMessage.textContent = '错误：文件过大（最大支持10MB）';
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
        editor.setValue(e.target.result);
        filenameInput.value = file.name;
        
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        const languageMap = {
            '.js': 'javascript', '.py': 'python', '.html': 'html', '.css': 'css',
            '.c': 'text/x-csrc', '.cpp': 'text/x-c++src', '.java': 'text/x-java',
            '.md': 'markdown', '.txt': 'text/plain'
        };
        
        const lang = languageMap[fileExt] || 'text/plain';
        languageSelector.value = lang;
        editor.setOption("mode", lang);
        
        statusMessage.textContent = `已加载文件: ${file.name}`;
        updateCursorPosition();
    };
    
    reader.onerror = (e) => {
        statusMessage.textContent = "错误: 无法读取文件";
        console.error("Error reading file:", e);
    };
    
    reader.readAsText(file);
    event.target.value = '';
});

// 事件监听
downloadButton.addEventListener('click', saveFile);
clearButton.addEventListener('click', showClearConfirm);
themeToggle.addEventListener('click', toggleTheme);

languageSelector.addEventListener('change', () => {
    const lang = languageSelector.value;
    editor.setOption("mode", lang);
    statusMessage.textContent = `已切换到: ${languageSelector.selectedOptions[0].textContent}`;
});

editor.on("cursorActivity", updateCursorPosition);

// 模态框事件
helpLink.addEventListener('click', () => { helpModal.style.display = 'flex'; });
closeModal.addEventListener('click', () => { helpModal.style.display = 'none'; });
confirmClearButton.addEventListener('click', () => { performClear(); confirmModal.style.display = 'none'; });
cancelClearButton.addEventListener('click', () => { confirmModal.style.display = 'none'; });
window.addEventListener('click', (event) => {
    if (event.target === helpModal || event.target === confirmModal) {
        event.target.style.display = 'none';
    }
});

// 设置初始状态
updateCursorPosition();
editor.focus();