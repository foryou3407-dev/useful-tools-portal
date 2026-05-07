/**
 * Tools Portal - 전역 공통 컴포넌트 (UI/UX 개선 버전)
 */

class GlobalHeader extends HTMLElement {
    connectedCallback() {
        const path = window.location.pathname;
        const isSubPage = path.includes('/image-converter/') ||
            path.includes('/youtube-kit/') ||
            path.includes('/counter/') ||
            path.includes('/salary/') ||
            path.includes('/age/') ||
            path.includes('/wifi/') ||
            path.includes('/converter/') ||
            path.includes('/recorder/') ||
            path.includes('/ocr/') ||
            path.includes('/link/') ||
            path.includes('/address/') ||
            path.includes('/pdf-to-image/') ||
            path.includes('/pdf-editor/') ||
            path.includes('/currency/');

        const base = isSubPage ? '../' : './';

        this.innerHTML = `
            <header class="global-nav">
                <nav class="nav-container">
                    <a href="${base}index.html" class="nav-logo">Tools Portal</a>
                    
                    <div class="nav-menu">
                        <!-- 메가 메뉴 wrapper -->
                        <div class="mega-menu-wrapper" id="megaMenuWrapper">
                            <button class="mega-menu-trigger" id="menuTrigger">
                                도구 선택하기 <span class="arrow">▾</span>
                            </button>
                            
                            <!-- 세로 리스트형 메뉴판 -->
                            <div class="mega-menu-overlay">
                                <div class="mega-menu-content">
                                    <div class="menu-list">
                                        <a href="${base}image-converter/index.html" class="menu-item ${path.includes('image-converter') ? 'active' : ''}">
                                            <span class="menu-icon">📸</span>
                                            <div class="menu-text">
                                                <span class="menu-title">이미지 변환기</span>
                                                <span class="menu-desc">HEIC/JPG 변환 및 압축</span>
                                            </div>
                                        </a>
                                        <a href="${base}youtube-kit/index.html" class="menu-item ${path.includes('youtube-kit') ? 'active' : ''}">
                                            <span class="menu-icon">📺</span>
                                            <div class="menu-text">
                                                <span class="menu-title">유튜브 키트</span>
                                                <span class="menu-desc">고화질 썸네일 & 제목 추출</span>
                                            </div>
                                        </a>
                                        <a href="${base}counter/index.html" class="menu-item ${path.includes('counter') ? 'active' : ''}">
                                            <span class="menu-icon">✍️</span>
                                            <div class="menu-text">
                                                <span class="menu-title">글자 수 세기</span>
                                                <span class="menu-desc">실시간 글자수/바이트 계산</span>
                                            </div>
                                        </a>
                                        <a href="${base}salary/index.html" class="menu-item ${path.includes('salary') ? 'active' : ''}">
                                            <span class="menu-icon">💰</span>
                                            <div class="menu-text">
                                                <span class="menu-title">연봉 계산기</span>
                                                <span class="menu-desc">2025 최신 실수령액 산출</span>
                                            </div>
                                        </a>
                                        <a href="${base}age/index.html" class="menu-item ${path.includes('age') ? 'active' : ''}">
                                            <span class="menu-icon">🎂</span>
                                            <div class="menu-text">
                                                <span class="menu-title">나이 계산기</span>
                                                <span class="menu-desc">만 나이 & 기념일 D-Day</span>
                                            </div>
                                        </a>
                                        <a href="${base}currency/index.html" class="menu-item ${path.includes('currency') ? 'active' : ''}">
                                            <span class="menu-icon">✈️</span>
                                            <div class="menu-text">
                                                <span class="menu-title">환율 계산기</span>
                                                <span class="menu-desc">주요 국가 실시간 환율 계산</span>
                                            </div>
                                        </a>
                                        <a href="${base}recorder/index.html" class="menu-item ${path.includes('recorder') ? 'active' : ''}">
                                            <span class="menu-icon">📹</span>
                                            <div class="menu-text">
                                                <span class="menu-title">화면 녹화기</span>
                                                <span class="menu-desc">무설치 브라우저 녹화 저장</span>
                                            </div>
                                        </a>
                                        <a href="${base}ocr/index.html" class="menu-item ${path.includes('ocr') ? 'active' : ''}">
                                            <span class="menu-icon">👁️</span>
                                            <div class="menu-text">
                                                <span class="menu-title">이미지 텍스트 변환</span>
                                                <span class="menu-desc">이미지 속 글자 자동 추출 (OCR)</span>
                                            </div>
                                        </a>
                                        <a href="${base}link/index.html" class="menu-item ${path.includes('link') ? 'active' : ''}">
                                            <span class="menu-icon">🔗</span>
                                            <div class="menu-text">
                                                <span class="menu-title">URL 단축기</span>
                                                <span class="menu-desc">긴 주소를 짧고 예쁘게 단축</span>
                                            </div>
                                        </a>
                                        <a href="${base}converter/index.html" class="menu-item ${path.includes('converter') ? 'active' : ''}">
                                            <span class="menu-icon">🔄</span>
                                            <div class="menu-text">
                                                <span class="menu-title">단위 변환기</span>
                                                <span class="menu-desc">평(坪), 인치, 화씨 등 변환</span>
                                            </div>
                                        </a>
                                        <a href="${base}address/index.html" class="menu-item ${path.includes('address') ? 'active' : ''}">
                                            <span class="menu-icon">📮</span>
                                            <div class="menu-text">
                                                <span class="menu-title">주소 변환기</span>
                                                <span class="menu-desc">우편번호 및 영문 주소 변환</span>
                                            </div>
                                        </a>
                                        <a href="${base}wifi/index.html" class="menu-item ${path.includes('wifi') ? 'active' : ''}">
                                            <span class="menu-icon">📶</span>
                                            <div class="menu-text">
                                                <span class="menu-title">와이파이 QR</span>
                                                <span class="menu-desc">자동 연결 QR 카드 생성</span>
                                            </div>
                                        </a>
                                        <a href="${base}pdf-to-image/index.html" class="menu-item ${path.includes('pdf-to-image') ? 'active' : ''}">
                                            <span class="menu-icon">🖼️</span>
                                            <div class="menu-text">
                                                <span class="menu-title">PDF 이미지 변환</span>
                                                <span class="menu-desc">PDF 페이지를 이미지로 변환</span>
                                            </div>
                                        </a>
                                        <a href="${base}pdf-editor/index.html" class="menu-item ${path.includes('pdf-editor') ? 'active' : ''}">
                                            <span class="menu-icon">📄</span>
                                            <div class="menu-text">
                                                <span class="menu-title">PDF 편집기</span>
                                                <span class="menu-desc">PDF 합치기 및 페이지 나누기</span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        `;

        this.initEventListeners();
    }

    initEventListeners() {
        const wrapper = this.querySelector('#megaMenuWrapper');
        const trigger = this.querySelector('#menuTrigger');

        // 1. 클릭 토글
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            wrapper.classList.toggle('active');
        });

        // 2. 외부 클릭 시 닫기
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                wrapper.classList.remove('active');
            }
        });


    }
}

class GlobalFooter extends HTMLElement {
    connectedCallback() {
        const path = window.location.pathname;
        const isSubPage = path.includes('/image-converter/') ||
            path.includes('/youtube-kit/') ||
            path.includes('/counter/') ||
            path.includes('/salary/') ||
            path.includes('/age/') ||
            path.includes('/wifi/') ||
            path.includes('/converter/') ||
            path.includes('/recorder/') ||
            path.includes('/ocr/') ||
            path.includes('/link/') ||
            path.includes('/address/') ||
            path.includes('/pdf-to-image/') ||
            path.includes('/pdf-editor/') ||
            path.includes('/currency/');

        const base = isSubPage ? '../' : './';

        this.innerHTML = `
            <footer class="global-footer">
                <div class="footer-container">
                    <p>&copy; 2026 Tools Portal. All rights reserved.</p>
                    <div class="footer-links">
                        <a href="${base}privacy.html">개인정보처리방침</a>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('global-header', GlobalHeader);
customElements.define('global-footer', GlobalFooter);
