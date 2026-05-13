// 在你的 court_status.html 替換掉原本的 <script> 內容
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwBBt7AWvhIJq3ZE66ehM4ZZlR6ciUtKeo3ARdut2MZw4WlSK3wIC7QRgErwxQpf1-A/exec";

document.getElementById('queryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 組合出你要查詢的編號，例如 "113-偵-1234"
    const year = document.getElementById('year').value;
    const word = document.getElementById('word').value;
    const number = document.getElementById('number').value;
    const queryId = `${year}-${word}-${number}`; 
    
    const resultArea = document.getElementById('resultArea');
    const submitBtn = e.target.querySelector('button');

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 正在連線司法資料庫...';

    // 呼叫 API 查詢資料
    fetch(`${SCRIPT_URL}?id=${queryId}`)
    .then(res => res.json())
    .then(data => {
        resultArea.style.display = 'block';
        const now = new Date();
        const timeString = now.toLocaleTimeString('zh-TW', { hour12: false });

        if (data.found) {
            resultArea.innerHTML = `
                <h3 style="margin-bottom: 20px; color: var(--primary-dark);">查詢結果</h3>
                <div class="result-card">
                    <div class="status-badge ${data.status === '偵查中' ? 'status-active' : 'status-waiting'}">
                        <i class="fa-solid fa-gavel"></i> ${data.status}
                    </div>
                    <p><strong>案件編號：</strong> ${data.id}</p>
                    <p><strong>原告/被告：</strong> ${data.plaintiff} v.s. ${data.defendant}</p>
                    <p><strong>當前進度：</strong> ${data.description.substring(0, 50)}...</p>
                    <p style="margin-top: 15px; color: var(--text-muted); font-size: 0.9rem;">
                        <i class="fa-solid fa-info-circle"></i> 最後更新時間：<span>${timeString}</span>
                    </p>
                </div>
            `;
        } else {
            resultArea.innerHTML = `
                <div class="result-card" style="border-color: var(--secondary-color);">
                    <p style="color: var(--secondary-color); font-weight: 600;">❌ 查無此案號：${queryId}</p>
                    <p>請確認年度、字別與編號是否正確，或聯繫承辦股別。</p>
                </div>
            `;
        }
        resultArea.scrollIntoView({ behavior: 'smooth' });
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> 開始查詢';
    });
});