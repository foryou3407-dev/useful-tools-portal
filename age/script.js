const birthDateInput = document.getElementById('birth-date');
const calcBtn = document.getElementById('calc-btn');
const resultDashboard = document.getElementById('result-dashboard');

// 오늘 날짜 설정 (시간 제외)
const today = new Date();
today.setHours(0, 0, 0, 0);

// 초기값 오늘로 설정 (선택 사항)
birthDateInput.valueAsDate = new Date(today.getFullYear() - 20, 0, 1);

calcBtn.addEventListener('click', () => {
    const birthStr = birthDateInput.value;
    if (!birthStr) {
        alert('생년월일을 선택해 주세요.');
        return;
    }

    const birth = new Date(birthStr);
    birth.setHours(0, 0, 0, 0);

    if (birth > today) {
        alert('미래의 날짜는 선택할 수 없습니다.');
        return;
    }

    calculateAges(birth);
    calculateDdays(birth);
    showZodiacAndStar(birth);

    // 폭죽 효과!
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4a90e2', '#6366f1', '#f97316', '#10b981']
    });

    resultDashboard.classList.remove('hidden');
    resultDashboard.scrollIntoView({ behavior: 'smooth' });
});

function calculateAges(birth) {
    const bYear = birth.getFullYear();
    const bMonth = birth.getMonth();
    const bDay = birth.getDate();

    const tYear = today.getFullYear();
    const tMonth = today.getMonth();
    const tDay = today.getDate();

    // 1. 만 나이 (International Age)
    let fullAge = tYear - bYear;
    const isBirthdayPassed = (tMonth > bMonth) || (tMonth === bMonth && tDay >= bDay);
    if (!isBirthdayPassed) {
        fullAge -= 1;
    }
    document.getElementById('full-age').innerText = fullAge;
    document.getElementById('birthday-status').innerText = isBirthdayPassed ? '✨ 올해 생일이 지났어요!' : '🎂 곧 생일이 다가와요!';

    // 2. 연 나이 (Year Age)
    const yearAge = tYear - bYear;
    document.getElementById('year-age').innerText = `${yearAge}세`;

    // 3. 세는 나이 (Korean Counting Age)
    const koreanAge = yearAge + 1;
    document.getElementById('korean-age').innerText = `${koreanAge}세`;
}

function calculateDdays(birth) {
    const diffTime = today.getTime() - birth.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // 태어난 날을 1일로 침

    document.getElementById('days-alive').innerText = `${diffDays.toLocaleString()}일`;

    // 다음 생일
    const nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < today) {
        nextBday.setFullYear(today.getFullYear() + 1);
    }
    const diffNextBday = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    document.getElementById('next-birthday').innerText = diffNextBday === 0 ? 'D-Day (오늘!)' : `D-${diffNextBday}`;
    document.getElementById('next-birthday-date').innerText = formatDate(nextBday);

    // 주요 마일스톤 (10,000일, 20,000일)
    document.getElementById('milestone-10k').innerText = getMilestoneDate(birth, 10000);
    document.getElementById('milestone-20k').innerText = getMilestoneDate(birth, 20000);
}

function getMilestoneDate(birth, days) {
    const milestone = new Date(birth.getTime());
    milestone.setDate(milestone.getDate() + days - 1);
    return formatDate(milestone);
}

function formatDate(date) {
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}

function showZodiacAndStar(birth) {
    // 띠 (Zodiac) - 단순화된 로직
    const zodiacs = ['원숭이띠 🐒', '닭띠 🐔', '개띠 🐶', '돼지띠 🐷', '쥐띠 🐭', '소띠 🐮', '호랑이띠 🐯', '토끼띠 🐰', '용띠 🐲', '뱀띠 🐍', '말띠 🐴', '양띠 🐑'];
    const zodiac = zodiacs[birth.getFullYear() % 12];

    // 별자리 (Star Sign)
    const month = birth.getMonth() + 1;
    const day = birth.getDate();
    let star = "";
    let desc = "";

    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) { star = "양자리 ♈"; desc = "자신감 넘치는 열정가"; }
    else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) { star = "황소자리 ♉"; desc = "신중하고 끈기 있는 실력파"; }
    else if ((month == 5 && day >= 21) || (month == 6 && day <= 21)) { star = "쌍둥이자리 ♊"; desc = "호기심 많은 재치꾼"; }
    else if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) { star = "게자리 ♋"; desc = "따뜻하고 섬세한 수호자"; }
    else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) { star = "사자자리 ♌"; desc = "당당한 리더십의 주인공"; }
    else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) { star = "처녀자리 ♍"; desc = "완벽을 추구하는 분석가"; }
    else if ((month == 9 && day >= 23) || (month == 10 && day <= 23)) { star = "천칭자리 ♎"; desc = "조화와 균형의 중재자"; }
    else if ((month == 10 && day >= 24) || (month == 11 && day <= 22)) { star = "전갈자리 ♏"; desc = "강한 통찰력과 카리스마"; }
    else if ((month == 11 && day >= 23) || (month == 12 && day <= 24)) { star = "사수자리 ♐"; desc = "자유로운 영혼의 탐험가"; }
    else if ((month == 12 && day >= 25) || (month == 1 && day <= 19)) { star = "염소자리 ♑"; desc = "성실한 노력파 완벽주의자"; }
    else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) { star = "물병자리 ♒"; desc = "독창적인 아이디어 뱅크"; }
    else { star = "물고기자리 ♓"; desc = "꿈꾸는 상상력의 예술가"; }

    document.getElementById('zodiac-star').innerText = `${zodiac} / ${star}`;
    document.getElementById('zodiac-desc').innerText = desc;
}
