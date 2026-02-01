document.addEventListener('DOMContentLoaded', () => {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    const previewArea = document.getElementById('preview-area');
    const dropzoneContent = document.getElementById('dropzone-content');
    const imagePreview = document.getElementById('image-preview');
    const removeBtn = document.getElementById('remove-btn');

    const progressSection = document.getElementById('progress-section');
    const statusText = document.getElementById('status-text');
    const progressPercent = document.getElementById('progress-percent');
    const progressBar = document.getElementById('progress-bar');

    const resultText = document.getElementById('result-text');
    const copyBtn = document.getElementById('copy-btn');
    const resetBtn = document.getElementById('reset-btn');

    // 1. 드롭존 클릭 & 파일 선택
    dropzone.addEventListener('click', (e) => {
        if (e.target !== removeBtn) {
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // 2. 드래그 앤 드롭
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // 3. 파일 처리 및 OCR 시작
    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            showPreview();
            startOCR(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    function showPreview() {
        dropzoneContent.classList.add('hidden');
        previewArea.classList.remove('hidden');
    }

    // 4. Tesseract OCR 실행
    async function startOCR(imageSrc) {
        const selectedLang = document.querySelector('input[name="lang"]:checked').value;

        progressSection.classList.remove('hidden');
        progressBar.style.width = '0%';
        progressPercent.textContent = '0%';
        resultText.value = '';

        try {
            statusText.textContent = 'OCR 엔진 준비 중...';

            // Tesseract.js v5의 최적화된 워커 생성 방식
            // 언어를 미리 전달하면 loadLanguage, initialize가 자동으로 수행됩니다.
            const worker = await Tesseract.createWorker(selectedLang, 1, {
                logger: m => updateStatus(m)
            });

            const { data: { text } } = await worker.recognize(imageSrc);

            resultText.value = text;
            statusText.textContent = '추출 완료!';
            progressPercent.textContent = '100%';
            progressBar.style.width = '100%';

            alert('텍스트 추출이 완료되었습니다!');

            await worker.terminate();
        } catch (error) {
            console.error('OCR Error:', error);
            statusText.textContent = '오류 발생: 다시 시도해 주세요.';
            progressSection.classList.add('hidden');
        }
    }

    function updateStatus(m) {
        if (m.status === 'recognizing text') {
            const prog = Math.round(m.progress * 100);
            statusText.textContent = '이미지 분석 중...';
            progressPercent.textContent = `${prog}%`;
            progressBar.style.width = `${prog}%`;
        } else if (m.status === 'loading tesseract core') {
            statusText.textContent = '코어 로딩 중...';
        } else if (m.status === 'loading language traineddata' || m.status === 'loading language') {
            statusText.textContent = '언어 데이터 불러오는 중...';
        } else if (m.status === 'initializing tesseract' || m.status === 'initialized tesseract') {
            statusText.textContent = '엔진 초기화 중...';
        }
    }

    // 5. 부가 기능 (복사, 초기화)
    copyBtn.addEventListener('click', () => {
        if (!resultText.value) return;
        resultText.select();
        document.execCommand('copy');

        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ 복사됨!';
        setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
    });

    resetBtn.addEventListener('click', () => {
        // 모든 필드 초기화
        fileInput.value = '';
        imagePreview.src = '';
        previewArea.classList.add('hidden');
        dropzoneContent.classList.remove('hidden');
        progressSection.classList.add('hidden');
        progressBar.style.width = '0%';
        resultText.value = '';
        statusText.textContent = '데이터 로딩 중...';
        progressPercent.textContent = '0%';
    });

    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetBtn.click();
    });
});
