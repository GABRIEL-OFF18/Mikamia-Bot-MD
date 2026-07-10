import fs from 'fs';
import { prepareWAMessageMedia } from '@whiskeysockets/baileys';

let handler = async (m, { conn, usedPrefix }) => {
  try {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    let nombre = await conn.getName(m.sender);

    function getSaludo() {
      const hora = new Date().getHours();
      if (hora >= 5 && hora < 12) return 'Buen día';
      if (hora >= 12 && hora < 18) return 'Buenas tardes';
      return 'Buenas noches';
    }

    let saludo = getSaludo();

    let tags = {
      info: 'ᴍᴇɴᴜ ɪɴꜰᴏ',
      anime: 'ᴍᴇɴᴜ ᴀɴɪᴍᴇ',
      buscador: 'ᴍᴇɴᴜ ʙᴜꜱᴄᴀᴅᴏʀ',
      descargas: 'ᴍᴇɴᴜ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ',
      fun: 'ᴍᴇɴᴜ ꜰᴜɴ',
      grupo: 'ᴍᴇɴᴜ ɢʀᴜᴘᴏ',
      ai: 'ᴍᴇɴᴜ ᴀɪ',
      game: 'ᴍᴇɴᴜ ɢᴀᴍᴇ',
      serbot: 'ᴍᴇɴᴜ ᴊᴀᴅɪʙᴏᴛ',
      main: 'ᴍᴇɴᴜ ᴍᴀɪɴ',
      nable: 'ᴍᴇɴᴜ ᴏɴ / ᴏꜰꜰ',
      nsfw: 'ᴍᴇɴᴜ ɴꜱꜰᴡ',
      sticker: 'ᴍᴇɴᴜ ꜱᴛɪᴄᴋᴇʀ',
      tools: 'ᴍᴇɴᴜ ᴛᴏᴏʟꜱ',
    };

    let header = '□ *﹙ _`%category`_ ﹚*';
    let body = '> ㅤ۟▪︎ *_%cmd_*';
    let footer = '';
    let after = `\n© ᴍᴀᴅᴇ ʙʏ ᴅᴇᴠ-ꜰᴇᴅᴇxʏᴢ`;

    let user = global.db.data.users[m.sender];
    let premium = user.premium ? '✅ Sí' : '❌ No';
    let limite = user.limit || 0;
    let totalreg = Object.keys(global.db.data.users).length;
    let groupsCount = Object.values(conn.chats).filter(v => v.id.endsWith('@g.us')).length;
    let muptime = clockString(process.uptime());

    function clockString(seconds) {
      let h = Math.floor(seconds / 3600);
      let m = Math.floor(seconds % 3600 / 60);
      let s = Math.floor(seconds % 60);
      return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
    }

    let infoUser = `
🍃 *_Hola, ${nombre} ⏤͟͟͞͞𝐅𝐀𝐁𝐈𝐀𝐍-𝐁𝐎𝐓 𖤐._*

*_🌿 𝙄𝙉𝙁𝙊 𝙐𝙎𝙐𝘼𝙍𝙄𝙊_*
> *_Usuario:_* *${nombre}*
> *_Premium:_* *${premium}*
> *_Bot:_* ${(conn.user.jid == global.conn.user.jid ? 'ᴘʀɪɴᴄɪᴘᴀʟ' : 'ꜱᴜʙ-ʙᴏᴛ')}

*_🌿 𝘿𝘼𝙏𝙊𝙎 𝘿𝙀𝙇 𝘽𝙊𝙏_*
> *_Grupos:_* *${groupsCount}*
> *_Activo:_* *${muptime}*
> *_Usuarios:_* *${totalreg}*
> *_Plataforma:_* *Ubuntu*

*_🍃 𝐅 𝐀 𝐁 𝐈 𝐀 𝐍  -  𝐌 𝐄 𝐍 𝐔_*
`.trim();

    let commands = Object.values(global.plugins).filter(v => v.help && v.tags && v.command).map(v => ({
      help: Array.isArray(v.help) ? v.help : [v.help],
      tags: Array.isArray(v.tags) ? v.tags : [v.tags],
      command: Array.isArray(v.command) ? v.command : [v.command]
    }));

    let menu = [];
    for (let tag in tags) {
      let comandos = commands
        .filter(command => command.tags.includes(tag))
        .map(command => command.command.map(cmd => body.replace(/%cmd/g, usedPrefix + cmd)).join('\n'))
        .join('\n');
      if (comandos) {
        menu.push(header.replace(/%category/g, tags[tag]) + '\n' + comandos + '\n' + footer);
      }
    }

    let finalMenu = infoUser + '\n\n' + menu.join('\n\n') + after;
    
    let imagen = 'https://raw.githubusercontent.com/Frimemoloxz/DataBase/main/1783298003162.jpeg';

    await m.react('🍃');

    const media = await prepareWAMessageMedia(
      { image: { url: imagen } },
      { upload: conn.waUploadToServer }
    );

    const interactiveMessage = {
      "viewOnceMessage": {
        "message": {
          "interactiveMessage": {
            "header": {
              "title": "🚀 𝐅𝐀𝐁𝐈𝐀𝐍-𝐈𝐀",
              "subtitle": "Dev-Fedexyz",
              "imageMessage": media.imageMessage,
              "hasMediaAttachment": true
            },
            "body": {
              "text": finalMenu
            },
            "footer": {
              "text": "© ᴍᴀᴅᴇ ʙʏ ᴅᴇᴠ-ꜰᴇᴅᴇxʏᴢ"
            },
            "nativeFlowMessage": {
              "buttons": [
                {
                  "name": "quick_reply",
                  "buttonParamsJson": `{"display_text":"👑 Creador","id":"${usedPrefix}owner"}`
                },
                {
                  "name": "quick_reply",
                  "buttonParamsJson": `{"display_text":"💻 Ser Sub-Bot","id":"${usedPrefix}code"}`
                }
              ],
              "messageParamsJson": "" 
            },
            "contextInfo": {
              "stanzaId": "FAKE_META_ID_001",
              "participant": "0@s.whatsapp.net",
              "quotedMessage": {
                "contactMessage": {
                  "displayName": "Dev-Fedexyz",
                  "vcard": "BEGIN:VCARD\nVERSION:3.0\nN: Dev-Fedexyz;;;;\nFN: Dev-Fedexyz\nTEL;waid=13135550002:+1 313 555 0002\nEND:VCARD"
                }
              },
              "remoteJid": "status@broadcast",
              "mentionedJid": [
                m.sender 
              ],
              "forwardingScore": 1,
              "isForwarded": true,
              "forwardedNewsletterMessageInfo": {
                "newsletterJid": "120363405641626756@newsletter",
                "serverMessageId": 103,
                "newsletterName": "『 ☆ 𝐅𝐚𝐛𝐢𝐚𝐧𝑩𝒐𝒕-𝑰𝑨 |  𝑶𝒇𝒇𝒊𝒄𝒊𝒂𝒍 ❀ 』"
              }
            }
          }
        }
      }
    };

    const extraNodes = {
      "additionalNodes": [
        {
          "tag": "biz",
          "attrs": {},
          "content": [
            {
              "tag": "interactive",
              "attrs": {
                "type": "native_flow",
                "v": "1"
              },
              "content": [
                {
                  "tag": "native_flow",
                  "attrs": {
                    "v": "9",
                    "name": "mixed"
                  }
                }
              ]
            }
          ]
        }
      ]
    };

    await conn.relayMessage(m.chat, interactiveMessage, extraNodes);
    
  } catch (error) {
    console.error(error);
    await m.react('❌');
    conn.reply(m.chat, `✿ Ocurrió un error al cargar el menú:\n\n${error.message}`, m);
  }
};

handler.help = ['menucompleto'];
handler.tags = ['main'];
handler.command = ['menu'];

export default handler;