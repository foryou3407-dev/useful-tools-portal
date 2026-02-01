document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url-input');
    const shortenBtn = document.getElementById('shorten-btn');
    const resultCard = document.getElementById('result-card');
    const shortUrlAnchor = document.getElementById('short-url');
    const copyBtn = document.getElementById('copy-btn');
    const qrContainer = document.getElementById('qrcode');

    let currentShortUrl = '';

    // 단축 로직
    async function handleShorten() {
        let originalUrl = urlInput.value.trim();

        if (!originalUrl) {
            alert('URL을 입력해 주세요!');
            return;
        }

        // 프로토콜 체크 및 자동 보정
        if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
            originalUrl = 'https://' + originalUrl;
            urlInput.value = originalUrl;
        }

        shortenBtn.disabled = true;
        shortenBtn.textContent = '처리 중...';

        try {
            // TinyURL API 호출
            const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(originalUrl)}`);

            if (!response.ok) throw new Error('API 호출 실패');

            const shortUrl = await response.text();
            currentShortUrl = shortUrl;

            // UI 업데이트
            displayResult(shortUrl);
        } catch (error) {
            console.error('URL 단축 중 오류:', error);
            alert('URL을 단축하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        } finally {
            shortenBtn.disabled = false;
            shortenBtn.textContent = '단축하기 ✂️';
        }
    }

    function displayResult(url) {
        resultCard.classList.remove('hidden');
        shortUrlAnchor.textContent = url;
        shortUrlAnchor.href = url;

        // QR 코드 생성
        qrContainer.innerHTML = '';
        new QRCode(qrContainer, {
            text: url,
            width: 160,
            height: 160,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // 결과 영역으로 부드럽게 스크롤
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // 복사 로직
    async function handleCopy() {
        if (!currentShortUrl) return;

        try {
            await navigator.clipboard.writeText(currentShortUrl);

            // 시각적 피드백
            copyBtn.textContent = '✅ 복사완료!';
            copyBtn.classList.add('success');

            setTimeout(() => {
                copyBtn.textContent = '복사하기';
                copyBtn.classList.remove('success');
            }, 2000);
        } catch (err) {
            console.error('복사 실패:', err);
            alert('복사에 실패했습니다. 주소를 직접 선택해서 복사해 주세요.');
        }
    }

    // 이벤트 리스너
    shortenBtn.addEventListener('click', handleShorten);

    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleShorten();
        }
    });

    copyBtn.addEventListener('click', handleCopy);
});
