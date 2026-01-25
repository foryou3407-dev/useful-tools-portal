const salaryInput = document.getElementById('salary-input');
const nonTaxInput = document.getElementById('non-tax-input');
const calcBtn = document.getElementById('calc-btn');
const resultReceipt = document.getElementById('result-receipt');

// 포맷팅 함수
function formatNumber(num) {
    return num.toLocaleString();
}

function parseNumber(str) {
    return parseInt(str.replace(/,/g, '')) || 0;
}

// 실시간 콤마 포맷팅 (비과세액 입력 시)
nonTaxInput.addEventListener('input', (e) => {
    let value = parseNumber(e.target.value);
    e.target.value = formatNumber(value);
});

salaryInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = value;
});

// 계산 로직
calcBtn.addEventListener('click', calculateSalary);

function calculateSalary() {
    const annualSalaryMan = parseNumber(salaryInput.value); // 만원 단위
    if (annualSalaryMan <= 0) {
        alert('연봉을 입력해 주세요.');
        return;
    }

    const annualSalary = annualSalaryMan * 10000;
    const monthlyBeforeTax = Math.floor(annualSalary / 12);
    const nonTax = parseNumber(nonTaxInput.value);
    const taxableIncome = monthlyBeforeTax - nonTax;

    /**
     * 2025년 요율 기준 (예상)
     */
    // 1. 국민연금 (4.5%, 월 상한 277,650원)
    let pension = Math.floor(taxableIncome * 0.045);
    if (pension > 277650) pension = 277650;

    // 2. 건강보험 (3.545%)
    let health = Math.floor(taxableIncome * 0.03545);

    // 3. 요양보험 (건보료의 12.95%)
    let care = Math.floor(health * 0.1295);

    // 4. 고용보험 (0.9%)
    let employment = Math.floor(taxableIncome * 0.009);

    // 5. 근로소득세 (약식 누진세율 적용)
    // 과세 표준 기준 근사치 계산 로직
    let annualTaxable = (taxableIncome * 12);
    let incomeTaxYearly = 0;

    if (annualTaxable <= 14000000) {
        incomeTaxYearly = annualTaxable * 0.06;
    } else if (annualTaxable <= 50000000) {
        incomeTaxYearly = 840000 + (annualTaxable - 14000000) * 0.15;
    } else if (annualTaxable <= 88000000) {
        incomeTaxYearly = 6240000 + (annualTaxable - 50000000) * 0.24;
    } else {
        incomeTaxYearly = 15360000 + (annualTaxable - 88000000) * 0.35;
    }

    // 근로소득공제 등을 고려한 보정계수 (약 0.6 적용)
    let incomeTax = Math.floor((incomeTaxYearly / 12) * 0.6);
    if (incomeTax < 0) incomeTax = 0;

    // 6. 지방소득세 (소득세 10%)
    let localTax = Math.floor(incomeTax * 0.1);

    // 합계
    const totalDeduction = pension + health + care + employment + incomeTax + localTax;
    const monthlyNet = monthlyBeforeTax - totalDeduction;

    // UI 업데이트
    document.getElementById('final-monthly').innerText = formatNumber(monthlyNet);
    document.getElementById('monthly-before-tax').innerText = formatNumber(monthlyBeforeTax) + '원';
    document.getElementById('pension').innerText = formatNumber(pension) + '원';
    document.getElementById('health').innerText = formatNumber(health) + '원';
    document.getElementById('care').innerText = formatNumber(care) + '원';
    document.getElementById('employment').innerText = formatNumber(employment) + '원';
    document.getElementById('income-tax').innerText = formatNumber(incomeTax) + '원';
    document.getElementById('local-tax').innerText = formatNumber(localTax) + '원';
    document.getElementById('total-deduction').innerText = formatNumber(totalDeduction) + '원';

    // 결과창 표시
    resultReceipt.classList.remove('hidden');
    resultReceipt.scrollIntoView({ behavior: 'smooth' });
}
