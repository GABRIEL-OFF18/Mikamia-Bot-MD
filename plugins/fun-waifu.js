// === WAIFU COMMAND - Versión Anti-Rate Limit ===

const waifuImages = [
  "https://TU_ENLACE_DIRECTO_1.jpg",
  "https://TU_ENLACE_DIRECTO_2.png",
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
                         `Escribe *\( {usedPrefix} \){command}* para otra`
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

handler.help = ['waifu']
handler.tags = ['anime', 'fun']
handler.command = ['waifu', 'chica', 'waifurandom']

export default handler