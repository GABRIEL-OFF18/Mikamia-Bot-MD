let handler = async (m, { conn }) => {
    try {
        const apiUrl = 'https://api.darkcore.xyz/random/neko';

        await conn.sendMessage(m.chat, { 
            image: { url: apiUrl }, 
            caption: `*Neko:* Kawaii\n*User:* ${m.pushName}` 
        }, { quoted: m });

    } catch (e) {
        console.error('Error con la API Neko:', e);
    }
};

handler.help = ['neko'];
handler.tags = ['fun'];
handler.command = ['neko'];

module.exports = handler;