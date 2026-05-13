// script.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Font Size Control (Persisted)
    const fontBtns = document.querySelectorAll('.font-btn');
    const html = document.documentElement;
    const savedSize = localStorage.getItem('taidao-font-size') || 'medium';

    function setFontSize(size) {
        html.classList.remove('font-sm', 'font-lg');
        if(fontBtns.length > 0) {
            fontBtns.forEach(b => b.classList.remove('active'));
            const activeBtn = Array.from(fontBtns).find(b => b.getAttribute('data-size') === size);
            if(activeBtn) activeBtn.classList.add('active');
        }

        if (size === 'small') html.classList.add('font-sm');
        else if (size === 'large') html.classList.add('font-lg');
        
        localStorage.setItem('taidao-font-size', size);
    }

    setFontSize(savedSize);

    if(fontBtns.length > 0) {
        fontBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                setFontSize(btn.getAttribute('data-size'));
            });
        });
    }

    // 2. News Tabs Control
    const tabBtns = document.querySelectorAll('.tab-btn');
    const newsItems = document.querySelectorAll('.news-item');
    
    if(tabBtns.length > 0 && newsItems.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const target = btn.getAttribute('data-target');
                
                newsItems.forEach(item => {
                    const tagEl = item.querySelector('.tag');
                    if(!tagEl) return;
                    const tag = tagEl.textContent.trim();
                    let shouldShow = false;
                    
                    if (target === 'tab-all') shouldShow = true;
                    else if (target === 'tab-news' && (tag === '新聞稿' || tag === '最新消息')) shouldShow = true;
                    else if (target === 'tab-board' && tag === '電子公布欄') shouldShow = true;
                    else if (target === 'tab-notice' && tag === '公示送達') shouldShow = true;

                    item.style.display = shouldShow ? 'flex' : 'none';
                });
            });
        });
    }

    // 3. Search Box interaction
    const searchBoxes = document.querySelectorAll('.search-box');
    searchBoxes.forEach(box => {
        const input = box.querySelector('input');
        const btn = box.querySelector('button');
        if (input && btn) {
            const doSearch = () => {
                const query = input.value.trim();
                if (query !== '') {
                    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                }
            };
            btn.addEventListener('click', doSearch);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') doSearch();
            });
        }
    });
});
