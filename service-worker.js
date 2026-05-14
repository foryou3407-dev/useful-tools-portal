const CACHE_NAME = 'useful-tools-v2';
const ASSETS = [
    '/',
    '/index.html',
    '/globals.css',
    '/shared-components.js',
    '/style.css'
];

// 설치 시 캐싱
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// 활성화 시 이전 캐시 정리
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// 페치 이벤트 처리 (Network First 또는 Cache First 전략)
// 여기서는 실시간 업데이트가 중요하지 않은 도구들이므로 Cache First 후 Network 시도
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request).then((response) => {
                // 특정 도구 페이지나 새로운 리소스를 발견하면 캐시에 추가 (동적 캐싱)
                if (event.request.method === 'GET' && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            });
        }).catch(() => {
            // 오프라인 상태에서 요청 실패 시 기본 페이지 반환 가능
        })
    );
});
