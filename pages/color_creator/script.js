document.addEventListener('DOMContentLoaded', () => {
    initColorCreator();
});

let state = {
    r: 0,
    g: 120,
    b: 212,
    a: 1,
    h: 206,
    s: 100,
    l: 42
};

let isUpdating = false;

const elements = {};

function initColorCreator() {
    cacheElements();
    bindEvents();
    updateAllFromState();
}

function cacheElements() {
    // Sliders
    elements.rSlider = document.getElementById('r-slider');
    elements.gSlider = document.getElementById('g-slider');
    elements.bSlider = document.getElementById('b-slider');
    elements.hSlider = document.getElementById('h-slider');
    elements.sSlider = document.getElementById('s-slider');
    elements.lSlider = document.getElementById('l-slider');
    elements.aSlider = document.getElementById('a-slider');

    // Values
    elements.rVal = document.getElementById('r-val');
    elements.gVal = document.getElementById('g-val');
    elements.bVal = document.getElementById('b-val');
    elements.hVal = document.getElementById('h-val');
    elements.sVal = document.getElementById('s-val');
    elements.lVal = document.getElementById('l-val');
    elements.aVal = document.getElementById('a-val');

    // Picker
    elements.picker = document.getElementById('native-color-picker');

    // Outputs
    elements.hexInput = document.getElementById('hex-input');
    elements.rgbInput = document.getElementById('rgb-input');
    elements.rgbaInput = document.getElementById('rgba-input');
    elements.hslInput = document.getElementById('hsl-input');
    elements.hslaInput = document.getElementById('hsla-input');

    // Preview
    elements.previewBox = document.getElementById('color-preview');
    elements.contrastWhite = document.getElementById('contrast-white');
    elements.contrastBlack = document.getElementById('contrast-black');

    // Copy Buttons
    elements.copyBtns = document.querySelectorAll('.copy-btn');

    // Gradient
    elements.gradStart = document.getElementById('grad-start');
    elements.gradEnd = document.getElementById('grad-end');
    elements.gradAngle = document.getElementById('grad-angle');
    elements.gradAngleVal = document.getElementById('grad-angle-val');
    elements.gradPreview = document.getElementById('gradient-preview');
    elements.gradCss = document.getElementById('gradient-css');

    // Paste Area
    elements.pasteInput = document.getElementById('color-paste-input');
    elements.pasteApplyBtn = document.getElementById('apply-pasted-color');
    elements.pasteClearBtn = document.getElementById('clear-pasted-color');
    elements.pasteFeedback = document.getElementById('paste-feedback');

    // Variations
    elements.variationsContainer = document.getElementById('variations-container');
}



function bindEvents() {
    // RGB Sliders
    const onRgbChange = () => {
        if (isUpdating) return;
        state.r = parseInt(elements.rSlider.value);
        state.g = parseInt(elements.gSlider.value);
        state.b = parseInt(elements.bSlider.value);
        updateHslFromRgb();
        updateAllFromState();
    };
    elements.rSlider.addEventListener('change', onRgbChange);
    elements.gSlider.addEventListener('change', onRgbChange);
    elements.bSlider.addEventListener('change', onRgbChange);
    elements.rSlider.addEventListener('input', onRgbChange); // Real-time
    elements.gSlider.addEventListener('input', onRgbChange);
    elements.bSlider.addEventListener('input', onRgbChange);

    // HSL Sliders
    const onHslChange = () => {
        if (isUpdating) return;
        state.h = parseInt(elements.hSlider.value);
        state.s = parseInt(elements.sSlider.value);
        state.l = parseInt(elements.lSlider.value);
        updateRgbFromHsl();
        updateAllFromState();
    };
    elements.hSlider.addEventListener('change', onHslChange);
    elements.sSlider.addEventListener('change', onHslChange);
    elements.lSlider.addEventListener('change', onHslChange);
    elements.hSlider.addEventListener('input', onHslChange);
    elements.sSlider.addEventListener('input', onHslChange);
    elements.lSlider.addEventListener('input', onHslChange);

    // Alpha Slider
    const onAlphaChange = () => {
        if (isUpdating) return;
        state.a = parseInt(elements.aSlider.value) / 100;
        updateAllFromState();
    };
    elements.aSlider.addEventListener('change', onAlphaChange);
    elements.aSlider.addEventListener('input', onAlphaChange);

    // Native Picker
    elements.picker.addEventListener('input', (e) => {
        if (isUpdating) return;
        const hex = e.target.value;
        const rgb = hexToRgb(hex);
        if (!rgb) return;
        state.r = rgb.r;
        state.g = rgb.g;
        state.b = rgb.b;
        updateHslFromRgb();
        updateAllFromState();
    });

    // Gradient Controls
    const updateGradient = () => {
        const start = elements.gradStart.value;
        const end = elements.gradEnd.value;
        const angle = elements.gradAngle.value;
        elements.gradAngleVal.textContent = angle + '°';

        const css = `linear-gradient(${angle}deg, ${start}, ${end})`;
        elements.gradPreview.style.background = css;
        elements.gradCss.value = css;
    };
    elements.gradStart.addEventListener('input', updateGradient);
    elements.gradEnd.addEventListener('input', updateGradient);
    elements.gradAngle.addEventListener('input', updateGradient);
    elements.gradAngle.addEventListener('change', updateGradient);
    // Initialize gradient
    updateGradient();

    // Text Inputs (Manual Entry)
    const attachManualInput = (element) => {
        if (!element) return;
        const applyValue = () => applyColorFromString(element.value);
        element.addEventListener('change', applyValue);
        element.addEventListener('keydown', (evt) => {
            if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
                evt.preventDefault();
                applyValue();
            }
        });
    };

    attachManualInput(elements.hexInput);
    attachManualInput(elements.rgbInput);
    attachManualInput(elements.rgbaInput);
    attachManualInput(elements.hslInput);
    attachManualInput(elements.hslaInput);

    // Paste Area Controls
    if (elements.pasteInput && elements.pasteApplyBtn) {
        const applyPastedColor = () => {
            const value = elements.pasteInput.value.trim();
            if (!value) {
                setPasteFeedback('请输入或粘贴颜色值', 'error');
                return;
            }
            const success = applyColorFromString(value);
            setPasteFeedback(success ? '已应用此颜色' : '无法解析该颜色', success ? 'success' : 'error');
        };

        elements.pasteApplyBtn.addEventListener('click', applyPastedColor);
        elements.pasteInput.addEventListener('keydown', (evt) => {
            if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
                evt.preventDefault();
                applyPastedColor();
            }
        });
        elements.pasteInput.addEventListener('input', () => setPasteFeedback('输入待应用…', 'idle'));
        elements.pasteInput.addEventListener('paste', () => setPasteFeedback('检测到粘贴，点击应用', 'idle'));

        if (elements.pasteClearBtn) {
            elements.pasteClearBtn.addEventListener('click', () => {
                elements.pasteInput.value = '';
                setPasteFeedback('输入已清空', 'idle');
                elements.pasteInput.focus();
            });
        }
    }

    // Copy Buttons
    elements.copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                navigator.clipboard.writeText(input.value).then(() => {
                    const originalText = btn.textContent;
                    btn.textContent = '已复制';
                    setTimeout(() => btn.textContent = originalText, 1500);
                });
            }
        });
    });
}

/* --- Logic --- */



function generateVariations() {
    if (!elements.variationsContainer) return;
    elements.variationsContainer.innerHTML = '';

    // Generate shades (darker) and tints (lighter)
    // We use HSL for this as it's easier to manipulate Lightness

    const steps = [
        { l: 95, label: '95%' },
        { l: 85, label: '85%' },
        { l: 75, label: '75%' },
        { l: 50, label: '50%' }, // Current HSL L might not be 50, but let's show fixed L steps
        { l: 25, label: '25%' },
        { l: 10, label: '10%' }
    ];

    // Better approach: Mix with White/Black like design tools
    // Tints: Mix with White (25%, 50%, 75%)
    // Shades: Mix with Black (25%, 50%, 75%)

    const createSwatch = (r, g, b, label) => {
        const div = document.createElement('div');
        div.className = 'variation-item';
        div.style.backgroundColor = `rgb(${r},${g},${b})`;
        div.title = `Click to apply: rgb(${r},${g},${b})`;

        const labelSpan = document.createElement('div');
        labelSpan.className = 'variation-label';
        labelSpan.textContent = label;
        div.appendChild(labelSpan);

        // Copy Button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'variation-copy-btn';
        copyBtn.innerHTML = '❐';
        copyBtn.title = 'Copy HEX';
        copyBtn.onclick = (e) => {
            e.stopPropagation();
            const hex = rgbToHex(r, g, b).toUpperCase();
            navigator.clipboard.writeText(hex).then(() => {
                const original = copyBtn.innerHTML;
                copyBtn.innerHTML = '✓';
                setTimeout(() => copyBtn.innerHTML = original, 1000);
            });
        };
        div.appendChild(copyBtn);

        div.addEventListener('click', () => {
            state.r = r;
            state.g = g;
            state.b = b;
            updateHslFromRgb();
            updateAllFromState();
        });

        return div;
    };

    // Tints (Lighter)
    [0.75, 0.5, 0.25].forEach(factor => {
        const r = Math.round(state.r + (255 - state.r) * factor);
        const g = Math.round(state.g + (255 - state.g) * factor);
        const b = Math.round(state.b + (255 - state.b) * factor);
        elements.variationsContainer.appendChild(createSwatch(r, g, b, `Tint ${Math.round(factor * 100)}%`));
    });

    // Current
    elements.variationsContainer.appendChild(createSwatch(state.r, state.g, state.b, 'Current'));

    // Shades (Darker)
    [0.25, 0.5, 0.75].forEach(factor => {
        const r = Math.round(state.r * (1 - factor));
        const g = Math.round(state.g * (1 - factor));
        const b = Math.round(state.b * (1 - factor));
        elements.variationsContainer.appendChild(createSwatch(r, g, b, `Shade ${Math.round(factor * 100)}%`));
    });
}



/* --- Logic --- */

function updateAllFromState() {
    if (isUpdating) return;
    isUpdating = true;

    try {
        // Update Sliders UI
        elements.rSlider.value = state.r;
        elements.gSlider.value = state.g;
        elements.bSlider.value = state.b;
        elements.hSlider.value = state.h;
        elements.sSlider.value = state.s;
        elements.lSlider.value = state.l;
        elements.aSlider.value = Math.round(state.a * 100);

        // Update Value Displays
        elements.rVal.textContent = state.r;
        elements.gVal.textContent = state.g;
        elements.bVal.textContent = state.b;
        elements.hVal.textContent = state.h + '°';
        elements.sVal.textContent = state.s + '%';
        elements.lVal.textContent = state.l + '%';
        elements.aVal.textContent = state.a.toFixed(2);

        // Update Picker
        const hex = rgbToHex(state.r, state.g, state.b);
        elements.picker.value = hex;

        // Update Outputs
        elements.hexInput.value = hex.toUpperCase();
        elements.rgbInput.value = `rgb(${state.r}, ${state.g}, ${state.b})`;
        elements.rgbaInput.value = `rgba(${state.r}, ${state.g}, ${state.b}, ${state.a})`;
        elements.hslInput.value = `hsl(${state.h}, ${state.s}%, ${state.l}%)`;
        elements.hslaInput.value = `hsla(${state.h}, ${state.s}%, ${state.l}%, ${state.a})`;

        // Update Preview
        const colorString = `rgba(${state.r}, ${state.g}, ${state.b}, ${state.a})`;
        elements.previewBox.style.backgroundColor = colorString;

        // Update Contrast Text Background for visibility check
        // We set the background of the contrast check area to the solid color (ignoring alpha for text readability check usually, but let's use the color)
        // Actually, let's just set the background of the preview box.
        // The text inside needs to be readable.
        elements.contrastWhite.parentElement.style.backgroundColor = colorString;

        generateVariations();
    } finally {
        isUpdating = false;
    }
}

function updateHslFromRgb() {
    const r = state.r / 255;
    const g = state.g / 255;
    const b = state.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    state.h = Math.round(h * 360);
    state.s = Math.round(s * 100);
    state.l = Math.round(l * 100);
}

function updateRgbFromHsl() {
    const rgb = hslToRgbValues(state.h, state.s, state.l);
    if (!rgb) return;
    state.r = rgb.r;
    state.g = rgb.g;
    state.b = rgb.b;
}

function rgbToHex(r, g, b) {
    const toHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

function hexToRgb(hex) {
    if (!hex) return null;
    let normalized = hex.trim();
    if (!normalized) return null;
    if (normalized.startsWith('#')) normalized = normalized.slice(1);
    if (normalized.length === 3 || normalized.length === 4) {
        normalized = normalized.split('').map((ch) => ch + ch).join('');
    }
    if (normalized.length !== 6 && normalized.length !== 8) return null;

    const hasAlpha = normalized.length === 8;
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    const result = { r, g, b };
    if (hasAlpha) {
        const a = parseInt(normalized.slice(6, 8), 16) / 255;
        result.a = parseFloat(a.toFixed(3));
    }
    return Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) ? null : result;
}

function applyColorFromString(value) {
    const parsed = parseColorString(value);
    if (!parsed) return false;

    state.r = clampChannel(parsed.r);
    state.g = clampChannel(parsed.g);
    state.b = clampChannel(parsed.b);
    if (typeof parsed.a === 'number') {
        const alpha = clampAlpha(parsed.a);
        if (typeof alpha === 'number') {
            state.a = alpha;
        }
    }
    updateHslFromRgb();
    updateAllFromState();
    return true;
}

function parseColorString(value) {
    if (!value) return null;
    const input = value.trim();
    if (!input) return null;

    // HEX (#RGB, #RRGGBB, #RRGGBBAA)
    const hexResult = hexToRgb(input);
    if (hexResult) return hexResult;

    // rgb()/rgba()
    const rgbResult = parseRgbFunction(input);
    if (rgbResult) return rgbResult;

    // hsl()/hsla()
    const hslResult = parseHslFunction(input);
    if (hslResult) return hslResult;

    // CSS named colors
    const namedResult = parseNamedColor(input);
    if (namedResult) return namedResult;

    return null;
}

function parseRgbFunction(value) {
    const rgbRegex = /^rgba?\(\s*([-\d.]+%?)\s*,\s*([-\d.]+%?)\s*,\s*([-\d.]+%?)(?:\s*,\s*([-\d.]+%?)\s*)?\)$/i;
    const match = value.match(rgbRegex);
    if (!match) return null;
    const channels = match.slice(1, 4).map((token) => {
        const isPercent = token.includes('%');
        const num = parseFloat(token);
        if (Number.isNaN(num)) return NaN;
        return isPercent ? (num / 100) * 255 : num;
    });
    if (channels.some((c) => Number.isNaN(c))) return null;
    let alpha = match[4];
    if (alpha !== undefined) {
        alpha = alpha.includes('%') ? parseFloat(alpha) / 100 : parseFloat(alpha);
    }
    const result = {
        r: channels[0],
        g: channels[1],
        b: channels[2]
    };
    if (alpha !== undefined && !Number.isNaN(alpha)) {
        result.a = alpha;
    }
    return result;
}

function parseHslFunction(value) {
    const hslRegex = /^hsla?\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([-\d.]+%?)\s*)?\)$/i;
    const match = value.match(hslRegex);
    if (!match) return null;
    const h = parseFloat(match[1]);
    const s = parseFloat(match[2]);
    const l = parseFloat(match[3]);
    let alpha = match[4];
    if (alpha !== undefined) {
        alpha = alpha.includes('%') ? parseFloat(alpha) / 100 : parseFloat(alpha);
    }
    const rgb = hslToRgbValues(h, s, l);
    if (!rgb) return null;
    if (alpha !== undefined && !Number.isNaN(alpha)) {
        rgb.a = alpha;
    }
    return rgb;
}

function hslToRgbValues(h, s, l) {
    if ([h, s, l].some((val) => Number.isNaN(val))) return null;
    const hue = ((h % 360) + 360) % 360 / 360;
    const sat = Math.min(100, Math.max(0, s)) / 100;
    const lig = Math.min(100, Math.max(0, l)) / 100;
    let r;
    let g;
    let b;

    if (sat === 0) {
        r = g = b = lig;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = lig < 0.5 ? lig * (1 + sat) : lig + sat - lig * sat;
        const p = 2 * lig - q;
        r = hue2rgb(p, q, hue + 1 / 3);
        g = hue2rgb(p, q, hue);
        b = hue2rgb(p, q, hue - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function parseNamedColor(value) {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (!parseNamedColor.ctx) {
        const canvas = document.createElement('canvas');
        parseNamedColor.ctx = canvas.getContext && canvas.getContext('2d');
    }
    const ctx = parseNamedColor.ctx;
    if (!ctx) return null;
    ctx.fillStyle = '#000000';
    ctx.fillStyle = trimmed;
    const computed = ctx.fillStyle;
    if (!computed) return null;
    if (computed === '#000000' && !/^#?0{3,6}$/i.test(trimmed) && trimmed.toLowerCase() !== 'black') {
        return null;
    }
    return hexToRgb(computed) || parseRgbFunction(computed);
}

function clampChannel(value) {
    const num = Math.round(Number(value));
    if (Number.isNaN(num)) return 0;
    return Math.min(255, Math.max(0, num));
}

function clampAlpha(value) {
    const num = Number(value);
    if (Number.isNaN(num)) return undefined;
    return Math.min(1, Math.max(0, parseFloat(num.toFixed(3))));
}

function setPasteFeedback(message, status = 'idle') {
    if (!elements.pasteFeedback) return;
    elements.pasteFeedback.textContent = message;
    elements.pasteFeedback.classList.remove('status-success', 'status-error', 'status-idle');
    const statusClass = `status-${status}`;
    elements.pasteFeedback.classList.add(statusClass);
}
