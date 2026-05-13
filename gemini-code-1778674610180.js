const CLIENT_ID = '1503713998325944462';
const REDIRECT_URI = window.location.origin + '/admin.html';

function loginWithDiscord() {
    // 這次改用 response_type=code
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
    window.location.href = authUrl;
}

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        document.getElementById('login-section').innerHTML = '<p>正在進行司法身分核對...</p>';
        
        // 呼叫我們剛寫好的後端 API
        const tokenRes = await fetch(`/api/auth?code=${code}`);
        const tokenData = await tokenRes.json();

        if (tokenData.access_token) {
            // 拿到 Token 後再去跟 Discord 要使用者資料
            const userRes = await fetch('https://discord.com/api/users/@me', {
                headers: { authorization: `Bearer ${tokenData.access_token}` }
            });
            const user = await userRes.json();

            // 🔒 權限檢查（請放入你的 Discord ID）
            const ADMIN_IDS = ['你的Discord數字ID']; 
            if (ADMIN_IDS.includes(user.id)) {
                showAdminPanel(user);
            } else {
                alert('權限不足！本頁面僅限檢察機關內部人員存取。');
                window.location.href = 'index.html';
            }
        }
    }
};