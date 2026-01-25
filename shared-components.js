/**
 * Tools Portal - 전역 공통 컴포넌트
 * Web Components를 사용하여 헤더(Navigation)를 관리합니다.
 */

class GlobalHeader extends HTMLElement {
    connectedCallback() {
        // 1. 현재 페이지 경로 확인
        const path = window.location.pathname;
        const isSubPage = path.includes('/image-converter/') ||
            path.includes('/youtube-kit/') ||
            path.includes('/counter/') ||
            path.includes('/salary/');

        // 2. 경로에 따른 링크 베이스 설정 (로컬 환경 및 호스팅 환경 대응)
        const base = isSubPage ? '../' : './';

        // 3. HTML 구조 정의
        this.innerHTML = `
            <header class="global-nav">
                <nav class="nav-container">
                    <a href="${base}index.html" class="nav-logo">Tools Portal</a>
                    <div class="nav-menu">
                        <a href="${base}image-converter/index.html" class="${path.includes('image-converter') ? 'active' : ''}">이미지 변환</a>
                        <a href="${base}youtube-kit/index.html" class="${path.includes('youtube-kit') ? 'active' : ''}">유튜브 키트</a>
                        <a href="${base}counter/index.html" class="${path.includes('counter') ? 'active' : ''}">글자 수 세기</a>
                        <a href="${base}salary/index.html" class="${path.includes('salary') ? 'active' : ''}">연봉 계산기</a>
                    </div>
                </nav>
            </header>
        `;
    }
}

// 커스텀 엘리먼트 등록
customElements.define('global-header', GlobalHeader);
