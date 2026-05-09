/*
  Código Creado Por MediaHub Software
  Funcionalidad: Captura de pantalla de sitios web usando Imagy API
  Modo: Screenshot PNG | Resolución configurable
*/

import axios from 'axios';

const ssweb = async (url, { width = 1280, height = 720, full_page = false, device_scale = 1 } = {}) => {
  if (!url.startsWith('https://')) throw new Error('ʟᴀ ᴜʀʟ ᴅᴇʙᴇ ᴇᴍᴘᴇᴢᴀʀ ᴄᴏɴ https://');

  const { data } = await axios.post('https://gcp.imagy.app/screenshot/createscreenshot', {
    url,
    browserWidth: parseInt(width),
    browserHeight: parseInt(height),
    fullPage: full_page,
    deviceScaleFactor: parseInt(device_scale),
    format: 'png'
  }, {
    headers: {
      'content-type': 'application/json',
      referer: 'https://imagy.app/full-page-screenshot-taker/',
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
    }
  });

  return data.fileUrl;
};

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const url = args.join(' ').trim();

  if (!url) {
    return conn.reply(m.chat, `╭─❒「 *sᴄʀᴇᴇɴsʜᴏᴛ ᴡᴇʙ* 」
│
│ 📌 *ᴜsᴏ:* ${usedPrefix + command} <ᴜʀʟ>
│ 🔗 *ᴇᴊᴇᴍᴘʟᴏ:*
│  ${usedPrefix}ss https://google.com
│
│ 📐 *ʀᴇsᴏʟᴜᴄɪóɴ:* 1280x720
│ 🖼️ *ғᴏʀᴍᴀᴛᴏ:* PNG
│
╰─⬣`.trim(), m);
  }

  const fullUrl = url.startsWith('https://') ? url : `https://${url}`;

  try {
    await m.react('🔄');

    await conn.reply(m.chat, `╭─❒「 *sᴄʀᴇᴇɴsʜᴏᴛ ᴡᴇʙ* 」
│
│ ⏳ *ᴄᴀᴘᴛᴜʀᴀɴᴅᴏ ᴘᴀɴᴛᴀʟʟᴀ...*
│ ᴘᴏʀ ғᴀᴠᴏʀ ᴇsᴘᴇʀᴀ ᴜɴ ᴍᴏᴍᴇɴᴛᴏ
│
│ 🔗 ${fullUrl}
│
╰─⬣`.trim(), m);

    await m.react('📥');

    const imageUrl = await ssweb(fullUrl);
    if (!imageUrl) throw new Error('ɴᴏ sᴇ ᴏʙᴛᴜᴠᴏ ᴜʀʟ ᴅᴇ ɪᴍᴀɢᴇɴ');

    await m.react('📤');

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `╭─⬣「 *sᴄʀᴇᴇɴsʜᴏᴛ ᴡᴇʙ* 」⬣
│
│ ≡◦ 🌐 *ᴜʀʟ:* ${fullUrl}
│ ≡◦ 📐 *ʀᴇs:* 1280x720
│ ≡◦ 🖼️ *ғᴏʀᴍᴀᴛᴏ:* PNG
│
╰⬣
> © ᴄóᴅɪɢᴏ ᴏғɪᴄɪᴀʟ ᴅᴇ *ᴍᴇᴅɪᴀʜᴜʙ™*`.trim()
    }, { quoted: m });

    await m.react('🟢');
  } catch (e) {
    console.error(e);
    await m.react('🔴');
    conn.reply(m.chat, `❌ *ᴇʀʀᴏʀ:* ${e.message}`, m);
  }
};

handler.help = ['ss <url>'];
handler.tags = ['herramientas'];
handler.command = /^(ss|ssweb|screenshot)$/i;

export default handler;