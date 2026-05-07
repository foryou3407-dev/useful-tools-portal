/**
 * Image Color Picker & Theme Palette
 * Using Canvas API and Color Thief library
 */

const colorThief = new ColorThief();

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const editorContainer = document.getElementById('editor-container');
const canvas = document.getElementById('color-canvas');
const ctx = canvas.getContext('2d');
const colorPreview = document.getElementById('color-preview');
const hexValue = document.getElementById('hex-value');
const rgbValue = document.getElementById('rgb-value');
const paletteContainer = document.getElementById('palette-container');
const resetBtn = document.getElementById('reset-btn');
const toast = document.getElementById('toast');

let img = new Image();

// --- Event Listeners ---

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleFile(e.target.files[0]);
});

resetBtn.addEventListener('click', () => {
    editorContainer.classList.add('hidden');
    dropZone.classList.remove('hidden');
    fileInput.value = '';
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    
    // Calculate scale factor
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
    const rgb = `${pixel[0]}, ${pixel[1]}, ${pixel[2]}`;
    
    updateCurrentColor(hex, rgb);
});

// Copy Listeners
document.getElementById('copy-hex').addEventListener('click', () => copyToClipboard(hexValue.textContent));
document.getElementById('copy-rgb').addEventListener('click', () => copyToClipboard(`rgb(${rgbValue.textContent})`));

// --- Core Functions ---

function handleFile(file) {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        img.onload = () => {
            setupCanvas();
            extractPalette();
            dropZone.classList.add('hidden');
            editorContainer.classList.remove('hidden');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function setupCanvas() {
    // Limit max size for performance
    const maxDimension = 1200;
    let width = img.width;
    let height = img.height;

    if (width > maxDimension || height > maxDimension) {
        if (width > height) {
            height *= maxDimension / width;
            width = maxDimension;
        } else {
            width *= maxDimension / height;
            height = maxDimension;
        }
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
}

function extractPalette() {
    paletteContainer.innerHTML = '<div class="palette-loading">이미지 분석 중...</div>';
    
    // Short delay to ensure image is ready for Color Thief
    setTimeout(() => {
        try {
            const palette = colorThief.getPalette(img, 5);
            paletteContainer.innerHTML = '';
            
            palette.forEach(color => {
                const hex = rgbToHex(color[0], color[1], color[2]);
                const swatch = document.createElement('div');
                swatch.className = 'swatch';
                swatch.style.backgroundColor = hex;
                swatch.title = hex;
                swatch.addEventListener('click', () => copyToClipboard(hex));
                paletteContainer.appendChild(swatch);
            });
        } catch (err) {
            console.error('Palette extraction failed:', err);
            paletteContainer.innerHTML = '<div class="palette-loading">팔레트 추출 실패</div>';
        }
    }, 100);
}

function updateCurrentColor(hex, rgb) {
    colorPreview.style.backgroundColor = hex;
    hexValue.textContent = hex;
    rgbValue.textContent = rgb;
}

function rgbToHex(r, g, b) {
    const toHex = (c) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast();
    });
}

function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}
