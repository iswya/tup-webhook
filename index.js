const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

app.post('/relay', async (req, res) => {
    const { to, message, color, timestamp, userid } = req.body;
    if (!DISCORD_WEBHOOK) return res.status(500).json({error: 'Webhook not set.'});
    if (!to || !message) return res.status(400).json({error: 'Missing fields.'});
  
    const embed = {
        title: `Unsent Project Message to: ${to}`,
        description: message,
        color: color ? parseInt(color, 16) : 0x00FFFF,
        footer: { text: `UserID: ${userid} | Time: ${timestamp}` }
    };
    await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ embeds: [embed] })
    });
    res.json({ success: true });
});

app.get('/', (req, res) => res.send('Relay is live!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Listening on ' + PORT));
