let handler = async (m, { conn, text, isOwner }) => {
    if (!isOwner) return conn.reply(m.chat, '❌ Solo el owner puede usar este comando.', m);

    if (!text) return conn.reply(m.chat, `⚠️ Uso correcto:\n${usedPrefix}setmenuimg <url>\n\nResponde a una imagen para subirla automáticamente.`, m);

    if (!text.startsWith('http')) return conn.reply(m.chat, '❌ La URL debe comenzar con http o https.', m);

    const botId = conn.user.jid;

    if (!global.menuImage) global.menuImage = {};
    global.menuImage[botId] = text;

    await conn.reply(m.chat, `✅ *Imagen del menú actualizada para este bot*\n\n🔖 Bot: ${botId === global.conn.user.jid ? 'Principal' : 'Sub-Bot'}\n📸 URL: ${text}`, m);
};

handler.help = ['setmenuimg'];
handler.tags = ['owner'];
handler.command = ['setmenuimg', 'setimgmenu', 'menuimg'];

export default handler;