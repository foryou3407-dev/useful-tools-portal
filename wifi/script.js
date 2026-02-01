document.addEventListener('DOMContentLoaded', () => {
    const ssidInput = document.getElementById('ssid');
    const passwordInput = document.getElementById('password');
    const encryptionInput = document.getElementById('encryption');
    const generateBtn = document.getElementById('generate-btn');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const downloadBtn = document.getElementById('download-btn');
    const printBtn = document.getElementById('print-btn');
    
    const qrContainer = document.getElementById('qrcode');
    const placeholderText = document.getElementById('placeholder-text');
    const ssidDisplay = document.getElementById('ssid-display');
    
    let qrcode = null;

    // 비밀번호 토글
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🔒';
    });

    // QR 생성 함수
    function generateWiFiQR() {
        const ssid = ssidInput.value.trim();
        const password = passwordInput.value;
        const encryption = encryptionInput.value;

        if (!ssid) {
            alert('와이파이 이름(SSID)을 입력해주세요.');
            ssidInput.focus();
            return;
        }

        // WIFI:T:WPA;S:mynetwork;P:mypassword;;
        const qrData = `WIFI:T:${encryption};S:${ssid};P:${password};;`;

        // 기존 QR 제거
        qrContainer.innerHTML = '';
        placeholderText.style.display = 'none';

        // QR 생성
        qrcode = new QRCode(qrContainer, {
            text: qrData,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // 미리보기 텍스트 업데이트
        ssidDisplay.textContent = `SSID: ${ssid}`;
        
        // 버튼 활성화
        downloadBtn.disabled = false;
        printBtn.disabled = false;
        
        // 부드러운 스크롤 (모바일)
        if (window.innerWidth < 900) {
            document.querySelector('.preview-section').scrollIntoView({ behavior: 'smooth' });
        }
    }

    generateBtn.addEventListener('click', generateWiFiQR);

    // 인쇄 기능
    printBtn.addEventListener('click', () => {
        window.print();
    });

    // 다운로드 기능 (html2canvas 없이 qrcode.js의 img를 활용하거나 card 자체를 캡처해야 함)
    // 여기서는 간단하게 QR 코드 이미지만 다운로드하거나, 카드 디자인을 위해 브라우저 인쇄/캡처 안내
    downloadBtn.addEventListener('click', () => {
        const img = qrContainer.querySelector('img');
        if (img) {
            const link = document.createElement('a');
            link.download = `wifi-qr-${ssidInput.value}.png`;
            link.href = img.src;
            link.click();
        } else {
            // qrcode.js가 canvas를 사용하는 경우 대응
            const canvas = qrContainer.querySelector('canvas');
            if (canvas) {
                const link = document.createElement('a');
                link.download = `wifi-qr-${ssidInput.value}.png`;
                link.href = canvas.toDataURL();
                link.click();
            }
        }
    });
});
