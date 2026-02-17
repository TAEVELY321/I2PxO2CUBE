document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // [공통 함수] 카테고리 영문 -> 한글 변환
    // =========================================
    function getCategoryName(cat) {
        const names = { 
            'notice': '공지사항', 
            'dev': '개발일지', 
            'event': '이벤트' 
        };
        return names[cat] || cat;
    }

    // =========================================
    // [페이지 1] 뉴스 리스트 페이지 로직 (news.html)
    // =========================================
    const newsContainer = document.getElementById('news-list-container');

    if (newsContainer) {
        // news.json 데이터를 가져옵니다.
        fetch('news.json')
            .then(response => response.json())
            .then(data => {
                renderNews(data); // 목록 그리기
                initTabs();       // 탭 필터 기능 연결
            })
            .catch(error => console.error('뉴스 로딩 실패:', error));
    }

    // 뉴스 카드 렌더링 함수
    function renderNews(newsData) {
        newsContainer.innerHTML = newsData.map(news => `
            <article class="news-item" data-category="${news.category}" 
                     onclick="location.href='news_detail.html?id=${news.id}'">
                <div class="img-placeholder news-thumb-small">
                    ${news.img.includes('/') ? `<img src="${news.img}" alt="thumbnail">` : news.img}
                </div>
                <div class="news-content">
                    <span class="news-tag">${getCategoryName(news.category)}</span>
                    <h3 class="news-subject">${news.title}</h3>
                    <p class="news-desc">${news.desc}</p>
                    <span class="news-date">${news.date}</span>
                </div>
            </article>
        `).join('');
    }

    // 탭 필터링 기능
    function initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 버튼 스타일 활성화
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // 필터링 적용
                const filter = btn.getAttribute('data-filter');
                const items = document.querySelectorAll('.news-item');

                items.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // =========================================
    // [페이지 2] 뉴스 상세 페이지 로직 (news_detail.html)
    // =========================================
    const articleTitle = document.getElementById('article-title');

    // article-title 요소가 있으면 상세 페이지라고 판단
    if (articleTitle) {
        // URL에서 ?id=... 값을 가져옴
        const params = new URLSearchParams(window.location.search);
        const currentId = params.get('id');

        if (!currentId) {
            alert('잘못된 접근입니다.');
            location.href = 'news.html';
            return;
        }

        fetch('news.json')
            .then(response => response.json())
            .then(data => {
                // ID가 일치하는 뉴스 찾기
                const newsItem = data.find(item => item.id === currentId);

                if (newsItem) {
                    // 화면에 데이터 채워 넣기
                    document.getElementById('article-category-text').textContent = getCategoryName(newsItem.category);
                    document.getElementById('article-title').textContent = newsItem.title;
                    document.getElementById('article-date').textContent = newsItem.date;
                    
                    // 본문은 HTML 태그가 포함될 수 있으므로 innerHTML 사용
                    // content가 없으면 desc라도 보여주도록 예외 처리
                    const bodyContent = newsItem.content || `<p>${newsItem.desc}</p><br><p>(상세 본문 내용이 준비 중입니다.)</p>`;
                    document.getElementById('article-body').innerHTML = bodyContent;
                } else {
                    document.getElementById('article-body').innerHTML = '<p>삭제되거나 존재하지 않는 뉴스입니다.</p>';
                }
            })
            .catch(error => console.error('뉴스 상세 로딩 실패:', error));
    }
});