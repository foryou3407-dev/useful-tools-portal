/**
 * PDF to Image Converter
 * 100% Client-side using pdf.js, JSZip, and FileSaver.js
 */

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileInfoSection = document.getElementById('file-info');
const previewArea = document.getElementById('preview-area');
const fileNameDisplay = document.getElementById('display-file-name');
const pageCountDisplay = document.getElementById('display-page-count');
const downloadBtn = document.getElementById('download-zip-btn');
const resetBtn = document.getElementById('reset-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const progressContainer = document.getElementById('progress-container');
const previewCanvas = document.getElementById('preview-canvas');

let currentPdf = null;
let currentFileName = '';

// --- Event Listeners ---

// Drag and Drop
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
        handleFile(files[0]);
    } else {
        alert('PDF 파일만 업로드 가능합니다.');
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// Download Action
downloadBtn.addEventListener('click', async () => {
    if (!currentPdf) return;
    await convertAndDownload();
});

// Reset Action
resetBtn.addEventListener('click', () => {
    location.reload();
});

// --- Core Functions ---

async function handleFile(file) {
    currentFileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
    fileNameDisplay.textContent = file.name;
    
    const reader = new FileReader();
    reader.onload = async function() {
        const typedarray = new Uint8Array(this.result);
        
        try {
            const loadingTask = pdfjsLib.getDocument(typedarray);
            currentPdf = await loadingTask.promise;
            
            pageCountDisplay.textContent = `총 ${currentPdf.numPages}페이지`;
            
            // Show info and preview areas
            dropZone.classList.add('hidden');
            fileInfoSection.classList.remove('hidden');
            previewArea.classList.remove('hidden');
            downloadBtn.disabled = false;
            
            // Render first page preview
            renderPreview(1);
            
        } catch (error) {
            console.error('Error loading PDF:', error);
            alert('PDF 파일을 불러오는 중 오류가 발생했습니다.');
        }
    };
    reader.readAsArrayBuffer(file);
}

async function renderPreview(pageNumber) {
    const page = await currentPdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.0 });
    const context = previewCanvas.getContext('2d');
    
    previewCanvas.height = viewport.height;
    previewCanvas.width = viewport.width;
    
    const renderContext = {
        canvasContext: context,
        viewport: viewport
    };
    await page.render(renderContext).promise;
}

async function convertAndDownload() {
    const zip = new JSZip();
    const numPages = currentPdf.numPages;
    
    // UI Update
    downloadBtn.disabled = true;
    downloadBtn.textContent = '변환 중...';
    progressContainer.classList.remove('hidden');
    
    const scale = 2.0; // High resolution
    
    for (let i = 1; i <= numPages; i++) {
        const page = await currentPdf.getPage(i);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;
        
        // Convert canvas to blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        
        // Add to ZIP
        const pageName = `page_${String(i).padStart(3, '0')}.png`;
        zip.file(pageName, blob);
        
        // Update Progress
        const percent = Math.round((i / numPages) * 100);
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `${percent}% 완료 (${i}/${numPages})`;
    }
    
    downloadBtn.textContent = 'ZIP 파일 생성 중...';
    
    // Generate and Save ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${currentFileName}_images.zip`);
    
    // Reset Button
    downloadBtn.textContent = '다운로드 완료!';
    setTimeout(() => {
        downloadBtn.disabled = false;
        downloadBtn.textContent = '모든 페이지 ZIP으로 다운로드';
    }, 3000);
}
