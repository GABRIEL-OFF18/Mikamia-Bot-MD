let handler = async (m, { conn, text, isOwner, usedPrefix }) => {
    if (!isOwner) return conn.reply(m.chat, '❌ Solo el owner puede usar este comando.', m);

    if (!text) return conn.reply(m.chat, `⚠️ Uso:\n\( {usedPrefix}setmenuimg <url>\n\nEjemplo:\n \){usedPrefix}setmenuimg https://tu-imagen.jpg`, m);

    if (!text.startsWith('http')) return conn.reply(m.chat, '❌ La URL debe comenzar con http o https.', m);

    const botId = conn.user.jid;

    if (!global.menuImage) global.menuImage = {};
    global.menuImage[botId] = text;

    await conn.reply(m.chat, `✅ *Imagen del menú actualizada para este bot*\n\n🔖 Tipo: ${botId === global.conn.user.jid ? '🤖 Bot Principal' : '🔗 Sub-Bot'}\n📸 URL: ${text}`, m);
};

handler.help = ['setmenuimg'];
handler.tags = ['owner'];
handler.command = ['setmenuimg', 'setimgmenu', 'menuimg'];

export default handler;