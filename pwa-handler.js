/**
 * PWA Handler - 설치 로직 및 기기별 안내
 */

let deferredPrompt;

// 1. 서비스 워커 등록
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const base = window.PWA_BASE || './';
        navigator.serviceWorker.register(`${base}service-worker.js`)
            .then(reg => console.log('SW Registered'))
            .catch(err => console.log('SW Register Error:', err));
    });
}

// 2. iOS 여부 확인
const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

// 3. 설치 버튼 및 안내 로직
const initPWA = () => {
    const installBtn = document.getElementById('install-btn');
    const iosNotice = document.getElementById('ios-install-notice');
    const isDebug = new URLSearchParams(window.location.search).get('debug') === 'pwa';

    if (!installBtn) {
        setTimeout(initPWA, 100);
        return;
    }

    // 디버그 모드이거나 iOS인 경우 버튼 즉시 노출
    if (isDebug || isIOS()) {
        installBtn.classList.remove('hidden');
        if (isIOS()) {
            installBtn.innerHTML = '<span>📲 앱 설치 안내</span>';
        }
        installBtn.addEventListener('click', () => {
            if (isIOS()) {
                if (iosNotice) iosNotice.classList.toggle('active');
                else alert("아이폰 사용자는 브라우저 하단의 [공유] 버튼을 누른 후 '홈 화면에 추가'를 선택해 주세요! 📲");
            } else {
                alert("이것은 디버그 모드용 미리보기입니다. 실제 설치는 브라우저의 조건이 충족되어야 작동합니다.");
            }
        });
        if (isIOS()) return;
    }

    // 안드로이드/PC 설치 이벤트 감지
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('beforeinstallprompt event fired');
        e.preventDefault();
        deferredPrompt = e;
        installBtn.classList.remove('hidden');
    });

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install: ${outcome}`);
        deferredPrompt = null;
        installBtn.classList.add('hidden');
    });
};

// DOM 상태에 따라 즉시 실행 또는 이벤트 대기
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initPWA);
} else {
    initPWA();
}

// 설치 완료 시 버튼 숨기기
window.addEventListener('appinstalled', () => {
    const installBtn = document.getElementById('install-btn');
    if (installBtn) installBtn.classList.add('hidden');
    console.log('PWA Installed');
});
