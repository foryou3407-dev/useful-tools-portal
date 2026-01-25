const textInput = document.getElementById('text-input');
const countWithSpace = document.getElementById('count-with-space');
const countWithoutSpace = document.getElementById('count-without-space');
const countByte = document.getElementById('count-byte');
const countWord = document.getElementById('count-word');
const copyBtn = document.getElementById('copy-btn');
const resetBtn = document.getElementById('reset-btn');

// 실시간 계산 이벤트
textInput.addEventListener('input', calculate);

function calculate() {
    const text = textInput.value;

    // 1. 공백 포함
    countWithSpace.innerText = text.length.toLocaleString();

    // 2. 공백 제외
    const withoutSpace = text.replace(/\s/g, '');
    countWithoutSpace.innerText = withoutSpace.length.toLocaleString();

    // 3. 바이트 계산 (한글/특수문자 2byte, 영문/숫자/공백 1byte)
    let byteSize = 0;
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        if (charCode <= 127) {
            byteSize += 1;
        } else {
            byteSize += 2;
        }
    }
    countByte.innerText = byteSize.toLocaleString();

    // 4. 단어 수
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    countWord.innerText = words.length.toLocaleString();
}

// 전체 복사
copyBtn.addEventListener('click', () => {
    if (!textInput.value) {
        alert('복사할 내용이 없습니다.');
        return;
    }

    textInput.select();
    document.execCommand('copy');

    // 버튼 텍스트 일시 변경 피드백
    const originalText = copyBtn.innerText;
    copyBtn.innerText = '복사 완료!';
    copyBtn.style.background = '#10b981'; // 초록색 피드백

    setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.style.background = '';
    }, 2000);
});

// 초기화
resetBtn.addEventListener('click', () => {
    if (confirm('모든 내용을 삭제하시겠습니까?')) {
        textInput.value = '';
        calculate();
        textInput.focus();
    }
});
