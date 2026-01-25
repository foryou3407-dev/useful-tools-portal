const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const fromAmount = document.getElementById('from-amount');
const toAmount = document.getElementById('to-amount');
const swapBtn = document.getElementById('swap-btn');
const rateText = document.getElementById('rate-text');
const baseDate = document.getElementById('base-date');

// 초기 포맷팅
fromAmount.value = '1,000';

// 실시간 이벤트 리스너
fromAmount.addEventListener('input', (e) => {
    let rawValue = e.target.value.replace(/[^0-9.]/g, '');
    let parts = rawValue.split('.');

    // 천단위 콤마 포맷팅
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    e.target.value = parts.join('.');

    convert();
});

fromCurrency.addEventListener('change', convert);
toCurrency.addEventListener('change', convert);

swapBtn.addEventListener('click', () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    convert();
});

// 환율 변환 메인 함수
async function convert() {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const amountStr = fromAmount.value.replace(/,/g, '');
    const amount = parseFloat(amountStr) || 0;

    if (from === to) {
        toAmount.value = fromAmount.value;
        rateText.innerText = `1 ${from} = 1.00 ${to}`;
        return;
    }

    try {
        const response = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
        const data = await response.json();

        const rate = data.rates[to];
        const result = amount * rate;

        // 결과 드롭
        toAmount.value = result.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        // 정보 업데이트
        rateText.innerText = `1 ${from} = ${rate.toFixed(4)} ${to}`;
        baseDate.innerText = `기준일: ${data.date}`;

    } catch (error) {
        console.error('환율 정보를 불러오는 데 실패했습니다:', error);
        rateText.innerText = '환율 정보를 불러오지 못했습니다.';
    }
}

// 초기 로드 시 환율 호출
convert();
