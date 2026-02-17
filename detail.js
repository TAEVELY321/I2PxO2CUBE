document.addEventListener('DOMContentLoaded', () => {
    // 1. URL에서 ?id=값 가져오기
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('id');

    if (!gameId) {
        alert('잘못된 접근입니다.');
        window.location.href = 'games.html';
        return;
    }

    // 2. JSON 데이터 로드
    fetch('games.json')
        .then(res => res.json())
        .then(data => {
            const game = data.find(g => g.id === gameId);
            if (game) {
                renderDetail(game);
            } else {
                alert('게임 정보를 찾을 수 없습니다.');
                window.location.href = 'games.html';
            }
        })
        .catch(err => console.error('데이터 로드 오류:', err));

    // 3. 화면 렌더링 함수
    // detail.js

// ... (상단 데이터 로드 로직은 동일) ...

    function renderDetail(game) {
        // 기본 텍스트 정보 매칭
        document.title = `${game.title} - I2PxO2CUBE`;
        document.getElementById('game-title').innerText = game.title;
        document.getElementById('game-category').innerText = game.tag;
        document.getElementById('game-short-desc').innerText = game.desc;
        document.getElementById('game-icon').src = game.icon || 'images/default-icon.png';
        document.getElementById('main-img').src = game.img;
        document.getElementById('full-desc').innerText = game.detail_desc || game.desc;

        // 사이드바 정보 (중복 코드 정리)
        document.getElementById('release-date').innerText = game.release_date || '출시일 정보 없음';
        document.getElementById('team').innerText = game.team || 'I2PxO2CUBE';
        document.getElementById('platform').innerText = game.platform || 'PC';
            

        // 스크린샷 렌더링
        const screenshotContainer = document.getElementById('screenshot-grid');
        if (game.screenshots && game.screenshots.length > 0) {
            screenshotContainer.innerHTML = game.screenshots.map(src => 
                `<img src="${src}" class="screenshot-item" alt="스크린샷" onclick="window.open('${src}')">`
            ).join('');
        }

        const btnContainer = document.getElementById('action-btns');
    let buttonsHtml = "";

    // 1. [핵심] JSON의 download_url을 사용하는 전용 다운로드 버튼
    if (game.download_url) {
        buttonsHtml += `
            <a href="${game.download_url}" class="btn-primary" target="_blank" style="text-align:center; display: block; width: 100%;">
                다운로드
            </a>
        `;
    }

    // 2. 나머지 기타 링크들 처리 (이미 상세 페이지이므로 "상세 보기"는 제외하고 렌더링)
    if (game.links && game.links.length > 0) {
        buttonsHtml += game.links
            .filter(link => link.text !== "상세 보기") // 리스트용 버튼은 여기선 숨김
            .map(link => `
                <a href="${link.url}" class="btn-secondary" target="_blank" style="text-align:center; display: block; width: 100%; margin-top: 10px;">
                    ${link.text}
                </a>
            `).join('');
    }

    btnContainer.innerHTML = buttonsHtml;
    }
// ...
});