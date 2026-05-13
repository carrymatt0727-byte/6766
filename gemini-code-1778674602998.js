export default async function handler(req, res) {
    const { code } = req.query;

    if (!code) return res.status(400).send('Missing code');

    // 向 Discord 請求真正的 Token
    const params = new URLSearchParams();
    params.append('client_id', process.env.DISCORD_CLIENT_ID);
    params.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', `${req.headers['x-forwarded-proto']}://${req.headers['host']}/admin.html`);

    const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const data = await response.json();
    res.status(200).json(data);
}