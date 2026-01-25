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
    const taxableMonthly = monthlyBeforeTax - nonTax;

    // --- 1. 4대 보험 계산 ---
    // 국민연금 (4.5%, 월 상한 277,650원)
    let pension = Math.floor(taxableMonthly * 0.045);
    if (pension > 277650) pension = 277650;

    // 건강보험 (3.545%)
    let health = Math.floor(taxableMonthly * 0.03545);

    // 요양보험 (건보료의 12.95%)
    let care = Math.floor(health * 0.1295);

    // 고용보험 (0.9%)
    let employment = Math.floor(taxableMonthly * 0.009);

    // --- 2. 소득세 정밀 계산 (국세청 가이드) ---

    // Step 1: 근로소득공제 계산 (연간 기준)
    let wageDeduction = 0;
    if (annualSalary <= 5000000) {
        wageDeduction = annualSalary * 0.7;
    } else if (annualSalary <= 15000000) {
        wageDeduction = 3500000 + (annualSalary - 5000000) * 0.4;
    } else if (annualSalary <= 45000000) {
        wageDeduction = 7500000 + (annualSalary - 15000000) * 0.15;
    } else if (annualSalary <= 100000000) {
        wageDeduction = 12000000 + (annualSalary - 45000000) * 0.05;
    } else {
        wageDeduction = 14750000 + (annualSalary - 100000000) * 0.02;
    }

    const wageIncomeAmount = annualSalary - wageDeduction;

    // Step 2: 과세표준 구하기 (연간 기준)
    // 인적공제 (본인 1인 150만 원) + 4대보험료 연간 합계
    const annualInsurances = (pension + health + care + employment) * 12;
    const humanDeduction = 1500000;
    let taxBase = wageIncomeAmount - humanDeduction - annualInsurances;
    if (taxBase < 0) taxBase = 0;

    // Step 3: 산출세액 (2024년 개정 누진세율)
    let calculatedTaxYearly = 0;
    if (taxBase <= 14000000) {
        calculatedTaxYearly = taxBase * 0.06;
    } else if (taxBase <= 50000000) {
        calculatedTaxYearly = taxBase * 0.15 - 1260000;
    } else if (taxBase <= 88000000) {
        calculatedTaxYearly = taxBase * 0.24 - 5760000;
    } else if (taxBase <= 150000000) {
        calculatedTaxYearly = taxBase * 0.35 - 15440000;
    } else if (taxBase <= 300000000) {
        calculatedTaxYearly = taxBase * 0.38 - 19940000;
    } else {
        calculatedTaxYearly = taxBase * 0.40 - 25940000; // 3억 초과 약식
    }

    // Step 4: 근로소득세액공제
    let taxCredit = 0;
    if (calculatedTaxYearly <= 1300000) {
        taxCredit = calculatedTaxYearly * 0.55;
    } else {
        taxCredit = 715000 + (calculatedTaxYearly - 1300000) * 0.3;
    }

    // 공제 한도 적용
    let creditLimit = 0;
    if (annualSalary <= 33000000) {
        creditLimit = 740000;
    } else if (annualSalary <= 70000000) {
        creditLimit = 660000;
    } else {
        creditLimit = 500000;
    }
    if (taxCredit > creditLimit) taxCredit = creditLimit;

    // 최종 연간 소득세 및 월 소득세
    let incomeTaxYearly = calculatedTaxYearly - taxCredit;
    if (incomeTaxYearly < 0) incomeTaxYearly = 0;

    const incomeTax = Math.floor(incomeTaxYearly / 12 / 10) * 10; // 원단위 절사
    const localTax = Math.floor(incomeTax * 0.1 / 10) * 10; // 지방소득세 10%

    // --- 3. 결과 합산 및 UI 업데이트 ---
    const totalDeduction = pension + health + care + employment + incomeTax + localTax;
    const monthlyNet = monthlyBeforeTax - totalDeduction;

    document.getElementById('final-monthly').innerText = formatNumber(monthlyNet);
    document.getElementById('monthly-before-tax').innerText = formatNumber(monthlyBeforeTax) + '원';
    document.getElementById('pension').innerText = formatNumber(pension) + '원';
    document.getElementById('health').innerText = formatNumber(health) + '원';
    document.getElementById('care').innerText = formatNumber(care) + '원';
    document.getElementById('employment').innerText = formatNumber(employment) + '원';
    document.getElementById('income-tax').innerText = formatNumber(incomeTax) + '원';
    document.getElementById('local-tax').innerText = formatNumber(localTax) + '원';
    document.getElementById('total-deduction').innerText = formatNumber(totalDeduction) + '원';

    resultReceipt.classList.remove('hidden');
    resultReceipt.scrollIntoView({ behavior: 'smooth' });
}
