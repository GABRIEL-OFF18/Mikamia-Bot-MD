// === WAIFU COMMAND - Versión Anti-Rate Limit ===

const waifuImages = [
  "https://raw.githubusercontent.com/RamonFTGD/uploads/main/files/7d2ee2b63b3f5f2a5762abfa0.jpg",
  "https://raw.githubusercontent.com/RamonFTGD/uploads/main/files/b24f914635191c1447c4bc741.jpg",

"https://raw.githubusercontent.com/RamonFTGD/uploads/main/files/780ec5b8dee27029ebf9f4edb.jpg",

"https://raw.githubusercontent.com/RamonFTGD/uploads/main/files/eaf3b2090f593298990568bcf.jpg",

"https://raw.githubusercontent.com/RamonFTGD/uploads/main/files/c95916aff69f59668e7fec81b.jpg",

"https://raw.githubusercontent.com/RamonFTGD/uploads/main/files/2a232c777d8f61ac00b568180.jpg",

"https://raw.githubusercontent.com/RamonFTGD/uploads/main/files/91fbaa31356f3a999aa73a0cc.jpg",

"https://optishield.uk/tmp/848efc3e7c2ce3669e6625a0d.jpg",

"https://raw.githubusercontent.com/JTxs00/uploads/main/1777248869890.jpeg",

"https://raw.githubusercontent.com/JTxs00/uploads/main/1777248914817.jpeg",

"https://raw.githubusercontent.com/JTxs00/uploads/main/1777248919822.jpeg",

"https://raw.githubusercontent.com/JTxs00/uploads/main/1777248926664.jpeg",

"https://raw.githubusercontent.com/JTxs00/uploads/main/1777249028683.jpeg",

"https://raw.githubusercontent.com/JTxs00/uploads/main/1777249034020.jpeg",

"https://raw.githubusercontent.com/JTxs00/uploads/main/1777249045019.jpeg",
  // ... agrega aquí TODOS tus enlaces directos
  // Recomendación: usa al menos 15-20 imágenes diferentes
]

const handler = async (msg, { conn, usedPrefix, command }) => {
    if (waifuImages.length === 0) {
        return conn.sendMessage(msg.chat, { 
            text: '❌ No hay imágenes de waifus configuradas.' 
        }, { quoted: msg })
    }

    let intentos = 0
    const maxIntentos = 3

    while (intentos < maxIntentos) {
        try {
            const randomImage = waifuImages[Math.floor(Math.random() * waifuImages.length)]

            await conn.sendMessage(msg.chat, {
                image: { url: randomImage },
                caption: `💕 **Waifu aleatoria** ✨\n\n` +
                         `Total de waifus: ${waifuImages.length}\n` +
                         `Escribe *#chica* para otra Waifu
SIGUE el canal (https://whatsapp.com/channel/0029VbCJFHmFy72CvfvzSR0Q)`
            }, { quoted: msg })

            return // Si se envía correctamente, salimos

        } catch (error) {
            intentos++
            console.error(`Intento ${intentos} fallido:`, error.message || error)

            if (error?.response?.status === 429 && intentos < maxIntentos) {
                await conn.sendMessage(msg.chat, {
                    text: `⏳ Imgur está saturado (429). Esperando un momento... (\( {intentos}/ \){maxIntentos})`
                }, { quoted: msg })

                await new Promise(resolve => setTimeout(resolve, 4000)) // espera 4 segundos
            } else if (intentos >= maxIntentos) {
                await conn.sendMessage(msg.chat, {
                    text: `❌ No se pudo enviar la waifu después de varios intentos.\n` +
                          `Imgur está limitando las imágenes.\n\n` +
                          `Consejo: Sube tus waifus a **ImgBB**, **Postimages** o **Catbox.moe** (son más permisivos con bots).`
                }, { quoted: msg })
            }
        }
    }
}

handler.help = ['chica']
handler.tags = ['fun']
handler.command = [ 'chica']

export default handler