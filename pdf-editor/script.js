/**
 * PDF Editor (Merge & Split)
 * 100% Client-side using pdf-lib and FileSaver.js
 */

const { PDFDocument } = PDFLib;

// --- DOM Elements ---
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Merge Elements
const mergeDropZone = document.getElementById('merge-drop-zone');
const mergeFileInput = document.getElementById('merge-file-input');
const mergeListContainer = document.getElementById('merge-list-container');
const mergeFileList = document.getElementById('merge-file-list');
const mergeBtn = document.getElementById('merge-btn');
const mergeResetBtn = document.getElementById('merge-reset-btn');

// Split Elements
const splitDropZone = document.getElementById('split-drop-zone');
const splitFileInput = document.getElementById('split-file-input');
const splitInfoContainer = document.getElementById('split-info-container');
const splitFileName = document.getElementById('split-file-name');
const splitPageCount = document.getElementById('split-page-count');
const pageRangeInput = document.getElementById('page-range');
const splitBtn = document.getElementById('split-btn');
const splitResetBtn = document.getElementById('split-reset-btn');

// State
let mergeFiles = []; // Array of { file, name, size }
let currentSplitFile = null;
let currentSplitDoc = null;

// --- Tab Logic ---
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tab}-content`) {
                content.classList.add('active');
            }
        });
    });
});

// --- Merge Logic ---

mergeDropZone.addEventListener('click', () => mergeFileInput.click());

mergeDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    mergeDropZone.classList.add('dragover');
});

mergeDropZone.addEventListener('dragleave', () => mergeDropZone.classList.remove('dragover'));

mergeDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    mergeDropZone.classList.remove('dragover');
    handleMergeFiles(e.dataTransfer.files);
});

mergeFileInput.addEventListener('change', (e) => handleMergeFiles(e.target.files));

function handleMergeFiles(files) {
    const pdfFiles = Array.from(files).filter(f => f.type === 'application/pdf');
    if (pdfFiles.length === 0) return;

    pdfFiles.forEach(file => {
        mergeFiles.push({
            id: Date.now() + Math.random(),
            file: file,
            name: file.name,
            size: formatBytes(file.size)
        });
    });

    renderMergeList();
}

function renderMergeList() {
    if (mergeFiles.length > 0) {
        mergeDropZone.classList.add('hidden');
        mergeListContainer.classList.remove('hidden');
    } else {
        mergeDropZone.classList.remove('hidden');
        mergeListContainer.classList.add('hidden');
    }

    mergeFileList.innerHTML = '';
    mergeFiles.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'file-item';
        li.innerHTML = `
            <span class="file-name">${item.name}</span>
            <span class="file-size">${item.size}</span>
            <div class="item-controls">
                <button class="control-btn" onclick="moveItem(${index}, -1)" ${index === 0 ? 'disabled' : ''}>↑</button>
                <button class="control-btn" onclick="moveItem(${index}, 1)" ${index === mergeFiles.length - 1 ? 'disabled' : ''}>↓</button>
                <button class="control-btn" onclick="removeItem(${index})">✕</button>
            </div>
        `;
        mergeFileList.appendChild(li);
    });
}

window.moveItem = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= mergeFiles.length) return;
    
    const temp = mergeFiles[index];
    mergeFiles[index] = mergeFiles[targetIndex];
    mergeFiles[targetIndex] = temp;
    renderMergeList();
};

window.removeItem = (index) => {
    mergeFiles.splice(index, 1);
    renderMergeList();
};

mergeResetBtn.addEventListener('click', () => {
    mergeFiles = [];
    renderMergeList();
});

mergeBtn.addEventListener('click', async () => {
    if (mergeFiles.length < 2) {
        alert('병합을 위해 최소 2개 이상의 PDF 파일이 필요합니다.');
        return;
    }

    mergeBtn.disabled = true;
    mergeBtn.textContent = '병합 중...';

    try {
        const mergedPdf = await PDFLib.PDFDocument.create();
        
        for (const item of mergeFiles) {
            const arrayBuffer = await item.file.arrayBuffer();
            const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }

        const pdfBytes = await mergedPdf.save();
        if (!pdfBytes || pdfBytes.length === 0) throw new Error('생성된 PDF 데이터가 없습니다.');
        
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        saveAs(blob, 'merged_document.pdf');
        
    } catch (err) {
        console.error(err);
        alert('병합 중 오류가 발생했습니다: ' + err.message);
    } finally {
        mergeBtn.disabled = false;
        mergeBtn.textContent = '하나의 PDF로 병합하기';
    }
});

// --- Split Logic ---

splitDropZone.addEventListener('click', () => splitFileInput.click());

splitDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    splitDropZone.classList.add('dragover');
});

splitDropZone.addEventListener('dragleave', () => splitDropZone.classList.remove('dragover'));

splitDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    splitDropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleSplitFile(e.dataTransfer.files[0]);
});

splitFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleSplitFile(e.target.files[0]);
});

async function handleSplitFile(file) {
    if (file.type !== 'application/pdf') {
        alert('PDF 파일만 업로드 가능합니다.');
        return;
    }

    currentSplitFile = file;
    splitFileName.textContent = file.name;
    
    try {
        const arrayBuffer = await file.arrayBuffer();
        currentSplitDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        splitPageCount.textContent = `총 ${currentSplitDoc.getPageCount()}페이지`;
        
        splitDropZone.classList.add('hidden');
        splitInfoContainer.classList.remove('hidden');
    } catch (err) {
        console.error(err);
        alert('PDF를 불러오는 중 오류가 발생했습니다: ' + err.message);
    }
}

splitResetBtn.addEventListener('click', () => {
    currentSplitFile = null;
    currentSplitDoc = null;
    pageRangeInput.value = '';
    splitDropZone.classList.remove('hidden');
    splitInfoContainer.classList.add('hidden');
});

splitBtn.addEventListener('click', async () => {
    const rangeText = pageRangeInput.value.trim();
    if (!rangeText) {
        alert('추출할 페이지 범위를 입력해주세요.');
        return;
    }

    const pagesToExtract = parsePageRange(rangeText, currentSplitDoc.getPageCount());
    if (pagesToExtract.length === 0) {
        alert('유효한 페이지 범위를 입력해주세요.');
        return;
    }

    splitBtn.disabled = true;
    splitBtn.textContent = '추출 중...';

    try {
        const newPdf = await PDFLib.PDFDocument.create();
        const indices = pagesToExtract.map(p => p - 1);
        const copiedPages = await newPdf.copyPages(currentSplitDoc, indices);
        copiedPages.forEach(page => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        if (!pdfBytes || pdfBytes.length === 0) throw new Error('생성된 PDF 데이터가 없습니다.');

        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        saveAs(blob, `split_${currentSplitFile.name}`);
        
    } catch (err) {
        console.error(err);
        alert('추출 중 오류가 발생했습니다: ' + err.message);
    } finally {
        splitBtn.disabled = false;
        splitBtn.textContent = '선택한 페이지만 추출하기';
    }
});

// --- Utilities ---

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function parsePageRange(text, maxPages) {
    const result = new Set();
    const parts = text.split(',');
    
    parts.forEach(part => {
        part = part.trim();
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(n => parseInt(n.trim()));
            if (!isNaN(start) && !isNaN(end)) {
                for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
                    if (i >= 1 && i <= maxPages) result.add(i);
                }
            }
        } else {
            const num = parseInt(part);
            if (!isNaN(num) && num >= 1 && num <= maxPages) {
                result.add(num);
            }
        }
    });
    
    return Array.from(result).sort((a, b) => a - b);
}
