let handler = async (m, { conn, text, isOwner, usedPrefix, command }) => {
    if (!isOwner) return conn.reply(m.chat, '❌ Solo el owner puede usar este comando.', m);

    if (!text) return conn.reply(m.chat, `⚠️ Uso:\n\n${usedPrefix + command} <nuevo nombre>\n\nEjemplo: ${usedPrefix + command} Mi Bot Personal`, m);

    const botId = conn.user.jid;

    if (!global.botName) global.botName = {};
    global.botName[botId] = text;

    await conn.reply(m.chat, `✅ *Nombre del bot actualizado correctamente*

🔖 Tipo: ${botId === global.conn.user.jid ? '🤖 **Bot Principal**' : '🔗 **Sub-Bot**'}
📛 Nuevo nombre: *${text}*`, m);
};

handler.help = ['setname'];
handler.tags = ['setbot'];
handler.command = ['setname', 'setbotname', 'setnombrebot'];

export default handler;