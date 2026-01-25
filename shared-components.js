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
                                                <span class="menu-desc">실시간 전 세계 환율 변환</span>
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

        // 3. 스크롤 시 닫기 (모바일 대응)
        window.addEventListener('scroll', () => {
            if (wrapper.classList.contains('active')) {
                wrapper.classList.remove('active');
            }
        }, { passive: true });
    }
}

customElements.define('global-header', GlobalHeader);
