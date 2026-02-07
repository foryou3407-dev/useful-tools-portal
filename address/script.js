document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const resultSection = document.getElementById('result-section');
    const postcodeInp = document.getElementById('postcode');
    const roadAddressInp = document.getElementById('roadAddress');
    const englishAddressInp = document.getElementById('englishAddress');
    const toast = document.getElementById('toast');

    // 1. 주소 검색 버튼 이벤트
    searchBtn.addEventListener('click', () => {
        if (typeof daum === 'undefined') {
            alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        new daum.Postcode({
            oncomplete: function (data) {
                console.log('주소 선택 완료:', data);

                try {
                    console.log('매칭 데이터 확인 시작...');

                    // 도로명 주소와 우편번호 대입
                    postcodeInp.value = data.zonecode || '';
                    roadAddressInp.value = data.roadAddress || data.address || '';
                    englishAddressInp.value = data.addressEnglish || '';

                    // 값 대입 후 결과 섹션 강제 노출
                    resultSection.style.display = 'block';
                    resultSection.classList.remove('hidden');

                    console.log('데이터 대입 완료, 섹션 노출 중...');

                    // 스크롤 처리 (약간의 지연시간을 줘서 렌더링 완료 후 실행)
                    setTimeout(() => {
                        window.scrollTo({
                            top: resultSection.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }, 200);

                } catch (err) {
                    console.error('데이터 처리 중 치명적 에러:', err);
                    alert('주소 정보를 필드에 채우는 중 오류가 발생했습니다: ' + err.message);
                }
            },
            // 팝업 설정 최적화
            popupTitle: '주소 변환기 우편번호 검색'
        }).open();
    });

    // 2. 복사 기능 로직
    const copyBtns = document.querySelectorAll('.btn-copy');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetInp = document.getElementById(targetId);

            if (targetInp && targetInp.value) {
                navigator.clipboard.writeText(targetInp.value).then(() => {
                    showToast('복사되었습니다! 🎉');
                }).catch(err => {
                    console.error('복사 실패:', err);
                });
            }
        });
    });

    // 3. 토스트 알림 로직
    let toastTimeout;
    function showToast(message) {
        clearTimeout(toastTimeout);
        toast.innerText = message;
        toast.classList.remove('hidden');
        toast.style.opacity = '1';

        toastTimeout = setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 500);
        }, 2000);
    }
});
