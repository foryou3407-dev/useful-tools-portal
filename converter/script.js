document.addEventListener('DOMContentLoaded', () => {
    // 단위 데이터 정의
    const unitData = {
        area: {
            units: {
                sqm: { name: '제곱미터 (㎡)', factor: 1 },
                pyeong: { name: '평 (坪)', factor: 3.305785 },
                acre: { name: '에이커 (ac)', factor: 4046.856 },
                sqft: { name: '제곱피트 (ft²)', factor: 0.092903 }
            },
            default: ['sqm', 'pyeong'],
            tip: '<p><b>부동산 꿀팁:</b> 1평은 약 3.3㎡입니다. 아파트 분양 면적(㎡)에 0.3025를 곱하면 대략적인 평수가 나옵니다.</p>'
        },
        length: {
            units: {
                cm: { name: '센티미터 (cm)', factor: 0.01 },
                m: { name: '미터 (m)', factor: 1 },
                inch: { name: '인치 (inch)', factor: 0.0254 },
                ft: { name: '피트 (ft)', factor: 0.3048 }
            },
            default: ['cm', 'inch'],
            tip: '<p><b>직구 꿀팁:</b> 1인치는 2.54cm입니다. 모니터나 스마트폰 화면 크기, 바지 사이즈 등을 계산할 때 유용합니다.</p>'
        },
        weight: {
            units: {
                kg: { name: '킬로그램 (kg)', factor: 1 },
                g: { name: '그램 (g)', factor: 0.001 },
                lb: { name: '파운드 (lb)', factor: 0.453592 },
                oz: { name: '온스 (oz)', factor: 0.028349 }
            },
            default: ['kg', 'lb'],
            tip: '<p><b>요리 꿀팁:</b> 고기나 단백질 보충제 등을 직구할 때 1파운드(lb)는 약 453그램임을 기억하세요.</p>'
        },
        temp: {
            units: {
                c: { name: '섭씨 (°C)' },
                f: { name: '화씨 (°F)' }
            },
            default: ['c', 'f'],
            tip: '<p><b>여행 꿀팁:</b> 미국에서는 화씨(°F)를 사용합니다. 섭씨 0도는 화씨 32도이며, 섭씨 20도는 화씨 68도 정도입니다.</p>'
        }
    };

    let currentCategory = 'area';

    // DOM 요소
    const tabBtns = document.querySelectorAll('.tab-btn');
    const inputVal = document.getElementById('input-value');
    const outputVal = document.getElementById('output-value');
    const inputUnitSelect = document.getElementById('input-unit');
    const outputUnitSelect = document.getElementById('output-unit');
    const swapBtn = document.getElementById('swap-btn');
    const formulaText = document.getElementById('formula-text');
    const tipContent = document.getElementById('tip-content');

    // 초기화
    initCategory(currentCategory);

    // 이벤트 리스너: 탭 전환
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            initCategory(currentCategory);
        });
    });

    // 이벤트 리스너: 입력 값 변경
    inputVal.addEventListener('input', convert);
    inputUnitSelect.addEventListener('change', convert);
    outputUnitSelect.addEventListener('change', convert);

    // 이벤트 리스너: 단위 교체
    swapBtn.addEventListener('click', () => {
        const temp = inputUnitSelect.value;
        inputUnitSelect.value = outputUnitSelect.value;
        outputUnitSelect.value = temp;

        // 버튼 애니메이션 효과를 위해 잠깐 클래스 추가 (선택사항)
        convert();
    });

    function initCategory(category) {
        const data = unitData[category];

        // 셀렉트 박스 채우기
        inputUnitSelect.innerHTML = '';
        outputUnitSelect.innerHTML = '';

        Object.entries(data.units).forEach(([key, unit]) => {
            const opt1 = new Option(unit.name, key);
            const opt2 = new Option(unit.name, key);
            inputUnitSelect.add(opt1);
            outputUnitSelect.add(opt2);
        });

        // 기본 단위 설정
        inputUnitSelect.value = data.default[0];
        outputUnitSelect.value = data.default[1];

        // 팁 업데이트
        tipContent.innerHTML = data.tip;

        convert();
    }

    function convert() {
        const val = parseFloat(inputVal.value);
        if (isNaN(val)) {
            outputVal.value = '';
            formulaText.textContent = '올바른 숫자를 입력하세요.';
            return;
        }

        const fromUnit = inputUnitSelect.value;
        const toUnit = outputUnitSelect.value;
        const catData = unitData[currentCategory];

        let result;

        // 온도 변환 (특수 로직)
        if (currentCategory === 'temp') {
            if (fromUnit === toUnit) {
                result = val;
            } else if (fromUnit === 'c' && toUnit === 'f') {
                result = (val * 9 / 5) + 32;
            } else {
                result = (val - 32) * 5 / 9;
            }
        } else {
            // 일반 단위 변환 (Base Unit으로 보낸 후 타겟 단위로 변환)
            const baseValue = val * catData.units[fromUnit].factor;
            result = baseValue / catData.units[toUnit].factor;
        }

        // 결과 출력 (소수점 최대 4자리)
        const displayResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));
        outputVal.value = displayResult;

        // 공식 텍스트 업데이트
        updateFormula(fromUnit, toUnit);
    }

    function updateFormula(from, to) {
        if (from === to) {
            formulaText.textContent = '동일한 단위입니다.';
            return;
        }

        if (currentCategory === 'temp') {
            if (from === 'c') formulaText.textContent = '공식: (°C × 9/5) + 32 = °F';
            else formulaText.textContent = '공식: (°F − 32) × 5/9 = °C';
        } else {
            const f1 = unitData[currentCategory].units[from].factor;
            const f2 = unitData[currentCategory].units[to].factor;
            const ratio = (f1 / f2).toFixed(4);
            formulaText.textContent = `1 ${unitData[currentCategory].units[from].name} ≈ ${parseFloat(ratio)} ${unitData[currentCategory].units[to].name}`;
        }
    }
});
