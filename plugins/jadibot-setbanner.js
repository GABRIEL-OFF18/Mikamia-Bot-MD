import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text, isOwner, usedPrefix, command }) => {
    if (!isOwner) return conn.reply(m.chat, '❌ Solo el owner puede usar este comando.', m);

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    let urlImage;

    if (/image/.test(mime)) {
        // Si responde a una imagen
        await conn.reply(m.chat, '⏳ Subiendo imagen...', m);
        
        let media = await q.download();
        urlImage = await uploadImage(media);
        
    } else if (text) {
        // Si pone una URL
        if (!text.startsWith('http')) {
            return conn.reply(m.chat, '❌ La URL debe comenzar con http o https.', m);
        }
        urlImage = text;
    } else {
        return conn.reply(m.chat, `⚠️ Uso:\n\n${usedPrefix + command} <url>\n\nO responde a una imagen con el comando.`, m);
    }

    // Guardar por bot (principal y sub-bots independientes)
    const botId = conn.user.jid;
    if (!global.menuImage) global.menuImage = {};
    global.menuImage[botId] = urlImage;

    await conn.reply(m.chat, `✅ *Imagen del menú actualizada correctamente para este bot*

🔖 Tipo: ${botId === global.conn.user.jid ? '🤖 **Bot Principal**' : '🔗 **Sub-Bot**'}
📸 URL: ${urlImage}`, m);
};

handler.help = ['setmenuimg'];
handler.tags = ['owner'];
handler.command = ['setmenuimg', 'setimgmenu', 'menuimg', 'setbanner'];

export default handler;