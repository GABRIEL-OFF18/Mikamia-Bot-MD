//nevi-dev
import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
import phoneNumber from 'awesome-phonenumber';

const newsletterJid = '120363424677971125@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ Kitsury\'s 𝐒ervice';
const packname = '˚Kitsury-waifu';
const redes = 'https://github.com/nevi-dev';

const CATEGORY_GROUPS = {
  '🦈 VICTORIA HOUSEKEEPING | OWNER': ['owner'],
  '🔌 CONEXIÓN DE RED | SERBOT': ['serbot'],
  '🔞 ZONA RESTRINGIDA | NSFW': ['nsfw', '+18'],
  '💖 INTERACCIÓN EMOX': ['emox'],
  '⚔️ INCURSIÓN EN CAVIDAD | RPG': ['rpg'],
  '📝 REGISTRO DE CIUDADANO': ['rg'],
  '🎲 SINTONIZACIÓN | GACHA': ['gacha', 'waifus'], 
  '🏙️ NEW ERIDU | PRINCIPAL': ['main'],
  '⚙️ PROTOCOLO DE ADMIN': ['admin', 'mods'],
  '🛠️ SOPORTE TÉCNICO | TOOLS': ['tools', 'herramientas', 'transformador', 'info', 'economy', 'economia', 'premium', 'bot'],
  '🧠 INTELIGENCIA ARTIFICIAL': ['ai', 'search'],
  '🕹️ ENTRETENIMIENTO | FUN': ['fun', 'game', 'games'], 
  '🖼️ CONTENIDO VISUAL | PIC': ['image', 'sticker'],
  '⬇️ DESCARGAS | DOWNLOADS': ['downloads', 'dl', 'buscador', 'internet'],
  '👥 GESTIÓN DE FACCIÓN | GRUPOS': ['group'],
  '✨ ARCHIVOS MULTIMEDIA': ['anime', 'audio'],
  '⚙️ CONFIGURACIÓN': ['nable'], 
};

const TAG_TO_GROUP = {};
for (const [groupName, tags] of Object.entries(CATEGORY_GROUPS)) {
  for (const tag of tags) {
    TAG_TO_GROUP[tag] = groupName;
  }
}

let handler = async (m, { conn, usedPrefix }) => {
  let enlacesMultimedia;
  try {
    const dbPath = path.join(process.cwd(), 'src', 'database', 'db.json');
    enlacesMultimedia = JSON.parse(fs.readFileSync(dbPath, 'utf-8')).links;
  } catch (e) {
    return conn.reply(m.chat, '❌ Error al leer la base de datos.', m);
  }

  let nombre = await conn.getName(m.sender);

  let userTime;
  try {
    const pn = new phoneNumber('+' + m.sender.split('@')[0]);
    const tzList = pn.getRegionCode() ? moment.tz.zonesForCountry(pn.getRegionCode()) : [];
    userTime = tzList.length > 0 ? moment().tz(tzList[0]).format('h:mm A') : moment().format('h:mm A');
  } catch {
    userTime = moment().format('h:mm A');
  }

  // Agrupar comandos
  let comandosPorGrupo = {};
  Object.values(global.plugins).forEach(plugin => {
    if (!plugin.help || !plugin.tags) return;
    const tags = Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags];
    const help = Array.isArray(plugin.help) ? plugin.help : [plugin.help];

    tags.forEach(tag => {
      const groupName = TAG_TO_GROUP[tag] || '❓ OTROS SECTORES';
      if (!comandosPorGrupo[groupName]) comandosPorGrupo[groupName] = new Set();
      help.forEach(h => {
        if (!/^\$|^=>|^>/.test(h)) comandosPorGrupo[groupName].add(h);
      });
    });
  });

  // Construir menú correctamente
  let menuTexto = '\n';
  Object.keys(comandosPorGrupo).sort().forEach(groupName => {
    const comandos = Array.from(comandosPorGrupo[groupName])
      .sort()
      .map(cmd => `• \( {usedPrefix} \){cmd}`)
      .join('\n');
    menuTexto += `🔷 *\( {groupName}*\n \){comandos}\n\n`;
  });

  let localVersion = '1.0.0';
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    localVersion = pkg.version;
  } catch (e) {}

  const sep = '——————————————————';

  const textoFinal = `
👅 **Kitsury-Waifu | 𝐒𝐄𝐑𝐕𝐈𝐂𝐄 𝐌𝐄𝐍𝐔**
${sep}
*— Bienvenid@ a New Eridu.*

👤 **Proxy:** ${nombre}
⌚ **Hora:** ${userTime}
${sep}
⚙️ **𝐒𝐘𝐒𝐓𝐄𝐌 𝐈𝐍𝐅𝐎**
| 🛠️ **Build:** v${localVersion}
| ⏳ **Uptime:** ${clockString(process.uptime() * 1000)}
| 📑 **Comandos totales:** ${Object.keys(global.plugins).length}
${sep}
*📋 Menú Completo*
\( {menuTexto} \){sep}
*— No me pidas nada más fuera de mi horario.*`.trim();

  const videoGifURL = enlacesMultimedia.video[Math.floor(Math.random() * enlacesMultimedia.video.length)];
  const miniaturaRandom = enlacesMultimedia.imagen[Math.floor(Math.random() * enlacesMultimedia.imagen.length)];

  const contextInfo = {
    mentionedJid: [m.sender],
    externalAdReply: {
      title: '𝐕𝐈𝐂𝐓𝐎𝐑𝐈𝐀 𝐇𝐎𝐔𝐒𝐄𝐊𝐄𝐄𝐏𝐈𝐍𝐆 𝐂𝐎.',
      body: 'Shark Service',
      thumbnailUrl: miniaturaRandom,
      sourceUrl: redes,
      mediaType: 1,
      renderLargerThumbnail: true
    }
  };

  await conn.sendMessage(m.chat, {
    video: { url: videoGifURL },
    caption: textoFinal,
    gifPlayback: true,
    contextInfo
  }, { quoted: m });
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'menú', 'help'];

export default handler;

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}