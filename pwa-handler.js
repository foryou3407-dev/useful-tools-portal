/**
 * PWA Handler - 설치 로직 및 기기별 안내
 */

let deferredPrompt;

// 1. 서비스 워커 등록
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const swPath = window.location.pathname.includes('/') && window.location.pathname.split('/').length > 2 ? '../service-worker.js' : './service-worker.js';
        // 서브 폴더 깊이에 따라 경로 조정 필요할 수 있으나 root('/') 기준으로 등록하는 것이 일반적
        // 여기서는 root 기준인 '/service-worker.js'를 사용
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('SW Registered'))
            .catch(err => console.log('SW Register Error:', err));
    });
}

// 2. iOS 여부 확인
const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

// 3. 설치 버튼 및 안내 로직
window.addEventListener('DOMContentLoaded', () => {
    const installBtn = document.getElementById('install-btn');
    const iosNotice = document.getElementById('ios-install-notice');

    if (!installBtn) return;

    // iOS인 경우
    if (isIOS()) {
        installBtn.classList.remove('hidden'); // 버튼은 보여주되 안내 툴팁용으로 사용 가능
        installBtn.addEventListener('click', () => {
            if (iosNotice) {
                iosNotice.classList.toggle('active');
            } else {
                alert("아이폰 사용자는 브라우저 하단의 [공유] 버튼을 누른 후 '홈 화면에 추가'를 선택해 주세요! 📲");
            }
        });
    }

    // 안드로이드/PC 설치 이벤트 감지
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.classList.remove('hidden'); // 설치 가능할 때 버튼 노출
    });

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install: ${outcome}`);
        deferredPrompt = null;
        installBtn.classList.add('hidden');
    });
});

// 설치 완료 시 버튼 숨기기
window.addEventListener('appinstalled', () => {
    const installBtn = document.getElementById('install-btn');
    if (installBtn) installBtn.classList.add('hidden');
    console.log('PWA Installed');
});
