/**
 * Tools Portal - 전역 공통 컴포넌트 (Mega Menu 리뉴얼 버전)
 */

class GlobalHeader extends HTMLElement {
    connectedCallback() {
        const path = window.location.pathname;
        const isSubPage = path.includes('/image-converter/') ||
            path.includes('/youtube-kit/') ||
            path.includes('/counter/') ||
            path.includes('/salary/');

        const base = isSubPage ? '../' : './';

        this.innerHTML = `
            <header class="global-nav">
                <nav class="nav-container">
                    <a href="${base}index.html" class="nav-logo">Tools Portal</a>
                    
                    <div class="nav-menu">
                        <!-- 메인 홈 링크 -->
                        <a href="${base}index.html" class="${(!isSubPage && !path.includes('index.html')) || path.endsWith('/') || path.includes('index.html') ? 'active' : ''}">홈</a>
                        
                        <!-- 메가 메뉴 트리거 -->
                        <div class="mega-menu-wrapper">
                            <button class="mega-menu-trigger">도구 전체보기 <span class="arrow">▾</span></button>
                            
                            <!-- 실제 펼쳐지는 메뉴판 -->
                            <div class="mega-menu-overlay">
                                <div class="mega-menu-content">
                                    <div class="menu-grid">
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        `;
    }
}

customElements.define('global-header', GlobalHeader);
