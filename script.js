document.addEventListener('DOMContentLoaded', () => {
    // 1. 헤더 스크롤 효과 (기존 유지)
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else if(document.title.includes("Project Archive")) header.classList.remove('scrolled');
    });

    // 2. 뉴스 데이터 로드 및 렌더링 (추가된 핵심 기능!)
    const newsContainer = document.getElementById('news-list-container');

    if (newsContainer) {
        // news.json 파일을 읽어옵니다.
        fetch('news.json')
            .then(response => response.json())
            .then(data => {
                renderNews(data); // 데이터를 가져오면 화면에 그립니다.
                initTabs();       // 그 다음에 탭 기능을 연결합니다.
            })
            .catch(error => console.error('뉴스 로딩 실패:', error));
    }
    // 화면에 뉴스 카드를 그리는 함수
    function renderNews(newsData) {
        newsContainer.innerHTML = newsData.map(news => `
            <article class="news-item" data-category="${news.category}">
                <div class="img-placeholder news-thumb-small">${news.img}</div>
                <div class="news-content">
                    <span class="news-tag">${getCategoryName(news.category)}</span>
                    <h3 class="news-subject">${news.title}</h3>
                    <p class="news-desc">${news.desc}</p>
                    <span class="news-date">${news.date}</span>
                </div>
            </article>
        `).join('');
    }
    // 3. 게임소개 데이터 로드 및 렌더링
    const gamesContainer = document.getElementById('games-list-container');

    if (gamesContainer) {
        fetch('games.json')
            .then(response => response.json())
            .then(data => {
                renderGames(data);
                // 반드시 데이터를 다 그린 후에 필터 기능을 실행해야 합니다!
                initGameYearFilters(); 
            })
            .catch(error => console.error('게임 정보 로딩 실패:', error));
    }
    //화면에 게임소개를 그리는 핵심함수
    function renderGames(gamesData) {
        gamesContainer.innerHTML = gamesData.map((game, index) => {
            const isReverse = index % 2 !== 0 ? 'reverse' : '';
            const buttonsHtml = game.links.map(link => {
                if (link.text === "상세 보기") {
                    return `<a href="detail.html?id=${game.id}" class="btn-primary">상세 보기</a>`;
                }
                return `<a href="${link.url}" class="btn-secondary">${link.text}</a>`;
            }).join('');

            // 각 카드에 data-year 속성이 정상적으로 들어갑니다.
            return `
                <div class="game-big-card ${isReverse}" data-year="${game.year}" 
                     onclick="if(document.getElementById('games-list-container').classList.contains('grid-mode')) location.href='detail.html?id=${game.id}'">
                    
                    <div class="game-card-img">
                        <img src="${game.img}" alt="${game.title}" class="game-actual-img">
                    </div>
                    <div class="game-card-info">
                        <div class="game-card-tag">${game.tag}</div>
                        <h2 class="game-card-title">${game.title}</h2>
                        <p class="game-card-desc">${game.desc}</p>
                        <div class="game-card-btns">${buttonsHtml}</div>
                    </div>
                </div>
            `;
        }).join('');
        const btnDetail = document.getElementById('btn-detail');
        const btnGrid = document.getElementById('btn-grid');
        const gamesList = document.getElementById('games-list-container');

        if (btnDetail && btnGrid) {
            btnDetail.addEventListener('click', () => {
                btnDetail.classList.add('active');
                btnGrid.classList.remove('active');
                gamesList.classList.remove('grid-mode');
                gamesList.classList.add('detail-mode');
            });

            btnGrid.addEventListener('click', () => {
                btnGrid.classList.add('active');
                btnDetail.classList.remove('active');
                gamesList.classList.remove('detail-mode');
                gamesList.classList.add('grid-mode');
            });
        }
    }
    // 게임 연도 필터링 로직 (뉴스 페이지 로직과 동일한 방식)
    function initGameYearFilters() {
        // .year-tab-btn에서 .tab-btn으로 선택자를 변경합니다
        const yearBtns = document.querySelectorAll('.news-tabs .tab-btn'); 
        const gameItems = document.querySelectorAll('.game-big-card');

        yearBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 버튼 활성화 상태 변경 (디자인 적용)
                yearBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-year-filter');

                gameItems.forEach(item => {
                    // 필터링 로직
                    if (filter === 'all' || item.dataset.year === filter) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // 카테고리 영문을 한글로 바꿔주는 기능
    function getCategoryName(cat) {
        const names = { 'notice': '공지사항', 'dev': '개발일지', 'event': '이벤트' };
        return names[cat] || cat;
    }

    // 탭 필터링 기능 (기존 로직을 함수화)
    function initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');
                
                document.querySelectorAll('.news-item').forEach(item => {
                    item.style.display = (filter === 'all' || item.dataset.category === filter) ? 'flex' : 'none';
                });
            });
        });
    }

    // 3. 지원 폼 제출 (기존 유지)
    const applyForm = document.getElementById('applyForm');
    if (applyForm) {
        applyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert(`${document.getElementById('name').value}님의 지원서가 접수되었습니다!`);
            applyForm.reset();
        });
    }

    const mainNewsContainer = document.getElementById('main-news-container');
    const mainGamesContainer = document.getElementById('main-games-container');

    // 1. 메인 뉴스 로딩 (최신 3개만)
    if (mainNewsContainer) {
        fetch('news.json')
            .then(response => response.json())
            .then(data => {
                // 최신순 정렬이 필요하다면 여기서 sort 가능 (현재는 json 순서대로)
                const latestNews = data.slice(0, 3); // 앞에서 3개만 자름

                mainNewsContainer.innerHTML = latestNews.map(news => `
                    <article class="news-card" onclick="location.href='news_detail.html?id=${news.id}'">
                        <div class="news-thumb-wrapper">
                             ${news.img && news.img.includes('/') 
                                ? `<img src="${news.img}" alt="${news.title}" class="news-thumb-img">` 
                                : `<div class="img-placeholder news-thumb">[이미지 없음]</div>`
                             }
                        </div>
                        <div class="news-info">
                            <div class="news-cat">${getCategoryNameGlobal(news.category)}</div>
                            <h3 class="news-title">${news.title}</h3>
                            <p class="news-date">${news.date}</p>
                        </div>
                    </article>
                `).join('');
            })
            .catch(error => console.error('메인 뉴스 로딩 실패:', error));
    }

    // 2. 메인 게임 슬라이더 로딩 (전체 표시)
    if (mainGamesContainer) {
        fetch('games.json')
            .then(response => response.json())
            .then(data => {
                // 게임 데이터를 순회하며 HTML 생성
                mainGamesContainer.innerHTML = data.map(game => `
                    <div class="game-banner" onclick="location.href='detail.html?id=${game.id}'">
                        <img src="${game.img}" alt="${game.title}" class="game-banner-bg">
                        <div class="game-overlay">
                            <h3>${game.title}</h3>
                            <p>${game.platform} / ${game.release_date}</p>
                        </div>
                    </div>
                `).join('');
            })
            .catch(error => console.error('메인 게임 로딩 실패:', error));
    }

    // [헬퍼 함수] 카테고리 이름 변환 (메인 페이지용)
    function getCategoryNameGlobal(cat) {
        const names = { 'notice': '공지사항', 'dev': '개발일지', 'event': '이벤트' };
        return names[cat] || cat;
    }
});