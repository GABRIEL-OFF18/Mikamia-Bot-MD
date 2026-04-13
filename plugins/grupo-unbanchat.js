let handler = async (m, { conn, usedPrefix, command, args }) => {
  let botname = global.botname || "NAGI-AI";

  // Verificar si el chat está registrado
  if (!(m.chat in global.db.data.chats)) {
    return conn.reply(m.chat, `⚽ *NAGI-AI*: Este chat ni siquiera está registrado... *qué flojera*.`, m);
  }

  let chat = global.db.data.chats[m.chat];

  if (command === 'bot') {
    if (args.length === 0) {
      const estado = chat.isBanned ? '✗ Desactivado' : '✓ Activado';
      const info = `
⚽ *NAGI-AI*:
> Ugh... tengo que explicarlo otra vez... qué fastidio.

Puedes activarme o dejarme dormir así:

✐ ${usedPrefix}bot on — *Me despiertas*
✐ ${usedPrefix}bot off — *Me dejas descansar*

✧ Estado actual » ${estado}
`;
      return conn.reply(m.chat, info.trim(), m);
    }

    let opcion = args[0].toLowerCase();

    if (opcion === 'off') {  
      if (chat.isBanned) {  
        return conn.reply(m.chat, `⚽ *NAGI-AI*: Ya estaba apagada... y yo feliz durmiendo.`, m);  
      }  
      chat.isBanned = true;  
      return conn.reply(m.chat, `⚽ *NAGI-AI*: *Listo...* me voy a dormir. No me despiertes por tonterías.`.trim(), m);  

    } else if (opcion === 'on') {  
      if (!chat.isBanned) {  
        return conn.reply(m.chat, `⚽ *NAGI-AI*: Ya estaba activo... ¿para qué me llamas?`, m);  
      }  
      chat.isBanned = false;  
      return conn.reply(m.chat, `⚽ *NAGI-AI*: *Ugh...* está bien, ya me levanté. ¿Contento?`.trim(), m);  
    } else {
      return conn.reply(m.chat, `⚽ *NAGI-AI*: No entiendo... Usa:\n${usedPrefix}bot on\n${usedPrefix}bot off`, m);
    }
  }
};

handler.help = ['bot'];
handler.tags = ['grupo'];
handler.command = ['bot'];
handler.admin = true;

export default handler;