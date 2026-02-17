/* =========================================
   [통합 자바스크립트 관리]
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    console.log("I2PxO2CUBE Website Core Loaded");

    // 1. 헤더 스크롤 효과 (모든 페이지 공통)
    const header = document.getElementById('main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            // 뉴스, 게임소개, 동아리소개 등 'scrolled'가 기본인 페이지는 유지
            // 메인(index.html)에서만 투명하게 돌아가도록 체크
            const isMainPage = !header.querySelectorAll('.active').length && !header.classList.contains('always-scrolled');
            if(document.title.includes("Project Archive")) {
                 header.classList.remove('scrolled');
            }
        }
    };

    window.addEventListener('scroll', handleScroll);

    // 2. 뉴스 탭 필터링 기능 (news.html 전용)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const newsItems = document.querySelectorAll('.news-item');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                newsItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === itemCategory) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // 3. 지원 폼 제출 (apply.html 전용)
    const applyForm = document.getElementById('applyForm');

    if (applyForm) {
        applyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(applyForm);
            const data = Object.fromEntries(formData.entries());
            
            // 실제 데이터 확인용 로그
            console.log("지원 신청 데이터:", data);
            
            alert(`${data.name}님의 소중한 지원서가 접수되었습니다. 곧 연락드릴게요!`);
            applyForm.reset();
        });
    }
});