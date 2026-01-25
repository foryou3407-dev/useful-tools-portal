document.getElementById('analyze-btn').addEventListener('click', analyzeVideo);
document.getElementById('youtube-url').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') analyzeVideo();
});

function extractVideoId(url) {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : false;
}

async function analyzeVideo() {
    const urlInput = document.getElementById('youtube-url').value.trim();
    const videoId = extractVideoId(urlInput);

    if (!videoId) {
        alert('올바른 유튜브 URL을 입력해 주세요.');
        return;
    }

    // 결과 섹션 표시
    document.getElementById('result-section').classList.remove('hidden');
    document.getElementById('video-title').innerText = '영상 제목을 가져오는 중...';

    // 1. 영상 제목 가져오기 (Noembed API)
    fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`)
        .then(res => res.json())
        .then(data => {
            if (data.title) {
                document.getElementById('video-title').innerText = data.title;
            } else {
                document.getElementById('video-title').innerText = '영상을 찾을 수 없습니다.';
            }
        })
        .catch(() => {
            document.getElementById('video-title').innerText = '제목을 가져오는 데 실패했습니다.';
        });

    // 2. 썸네일 및 카드 초기화
    const configs = [
        { id: 'max', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
        { id: 'hq', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
        { id: 'mq', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` }
    ];

    configs.forEach(config => {
        const img = document.getElementById(`thumb-${config.id}`);
        const card = document.getElementById(`card-${config.id}`);
        const btn = card.querySelector('.download-btn');

        // 초기화
        card.style.display = 'flex';
        img.style.display = 'block';
        if (btn) btn.style.display = 'block';

        // 이전 안내 문구 제거
        const existingMsg = card.querySelector('.no-thumb-msg');
        if (existingMsg) existingMsg.remove();

        // 이미지 로딩 및 유효성 검사 (유튜브는 이미지가 없으면 120px 짜리 기본 이미지를 보냄)
        img.onload = function () {
            if (this.naturalWidth <= 120) {
                showPlaceholder(card, img, btn);
            }
        };

        img.onerror = function () {
            showPlaceholder(card, img, btn);
        };

        img.src = config.url;
    });

    // 분석 후 섹션으로 스크롤
    document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
}

function showPlaceholder(card, img, btn) {
    img.style.display = 'none';
    if (btn) btn.style.display = 'none';

    if (!card.querySelector('.no-thumb-msg')) {
        const msg = document.createElement('div');
        msg.className = 'no-thumb-msg';
        msg.innerText = '이 화질은 제공되지 않습니다.';
        card.appendChild(msg);
    }
}

function downloadImage(type) {
    const imgElement = document.getElementById(`thumb-${type}`);
    if (imgElement && imgElement.src) {
        window.open(imgElement.src, '_blank');
    }
}
