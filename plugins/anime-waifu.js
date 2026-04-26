import fetch from 'node-fetch'

const handler = async (msg, { conn, usedPrefix, command }) => {
    await conn.sendMessage(msg.chat, { 
        text: '💕 *Buscando waifu...*' 
    }, { quoted: msg })

    try {
        const res = await fetch('https://api.waifu.im/random?selected_tags=waifu&is_nsfw=false')
        const data = await res.json()

        const imageUrl = data.images?.[0]?.url

        if (!imageUrl) throw new Error('No se encontró imagen')

        await conn.sendMessage(msg.chat, {
            image: { url: imageUrl },
            caption: `💕 **Waifu Random** ✨\n\n` +
                     `Comando: \( {usedPrefix} \){command}`
        }, { quoted: msg })

    } catch (e) {
        console.error(e)
        await conn.sendMessage(msg.chat, {
            text: '❌ Error al obtener la waifu. Prueba otra vez.'
        }, { quoted: msg })
    }
}

handler.help = ['waifu']
handler.tags = ['anime', 'fun']
handler.command = ['waifu', 'chica', 'waifurandom']

export default handler