document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const toolCards = document.querySelectorAll('.tool-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. 활성 탭 표시 변경
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            // 2. 카드 필터링
            toolCards.forEach(card => {
                // 부드러운 애니메이션 효과를 위해 클래스 조절
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
});
