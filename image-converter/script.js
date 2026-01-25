document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const controls = document.getElementById('controls');
    const previewArea = document.getElementById('preview-area');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('quality-value');

    const originalPreview = document.getElementById('original-preview');
    const compressedPreview = document.getElementById('compressed-preview');
    const originalSize = document.getElementById('original-size');
    const compressedSize = document.getElementById('compressed-size');

    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');

    let originalFile = null;

    // Trigger file input
    dropZone.addEventListener('click', () => fileInput.click());

    // Drag and drop events
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    async function handleFile(file) {
        const isHEIC = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif';

        if (!file.type.startsWith('image/') && !isHEIC) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }

        let processingFile = file;

        if (isHEIC) {
            try {
                // Show loading message
                originalSize.textContent = "HEIC 변환 중...";
                const blob = await heic2any({
                    blob: file,
                    toType: "image/jpeg",
                    quality: 0.8
                });
                processingFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: "image/jpeg" });
            } catch (error) {
                console.error("HEIC conversion failed:", error);
                alert("HEIC 변환 중 오류가 발생했습니다.");
                return;
            }
        }

        originalFile = processingFile;
        originalSize.textContent = formatBytes(processingFile.size);

        const reader = new FileReader();
        reader.onload = (e) => {
            originalPreview.src = e.target.result;
            compressImage(e.target.result, qualitySlider.value / 100);
        };
        reader.readAsDataURL(processingFile);

        dropZone.classList.add('hidden');
        controls.classList.remove('hidden');
        previewArea.classList.remove('hidden');
    }

    qualitySlider.addEventListener('input', (e) => {
        const quality = e.target.value;
        qualityValue.textContent = quality;
        if (originalPreview.src) {
            compressImage(originalPreview.src, quality / 100);
        }
    });

    function compressImage(base64, quality) {
        const img = new Image();
        img.src = base64;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Compress to JPEG for quality control
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            compressedPreview.src = compressedDataUrl;

            // Calculate compressed size
            const head = 'data:image/jpeg;base64,';
            const size = Math.round((compressedDataUrl.length - head.length) * 3 / 4);
            compressedSize.textContent = formatBytes(size);

            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = compressedDataUrl;
                const fileName = `compressed_${originalFile.name.split('.')[0]}.jpg`;
                link.download = fileName;

                link.title = "압축된 이미지 다운로드";

                document.body.appendChild(link);
                link.click();

                setTimeout(() => {
                    document.body.removeChild(link);
                    alert('다운로드가 시작되지 않았다면, 옆의 결과 이미지를 마우스 오른쪽 버튼으로 클릭하여 "이미지를 다른 이름으로 저장"을 선택해 주세요.');
                }, 100);
            };
        };
    }

    resetBtn.addEventListener('click', () => {
        originalFile = null;
        fileInput.value = '';
        dropZone.classList.remove('hidden');
        controls.classList.add('hidden');
        previewArea.classList.add('hidden');
        originalPreview.src = '';
        compressedPreview.src = '';
        qualitySlider.value = 80;
        qualityValue.textContent = 80;
    });

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
});
