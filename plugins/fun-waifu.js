import fetch from 'node-fetch' // Solo si lo necesitas para otras cosas, aquí no es obligatorio

// === AQUÍ PEGAS TUS ENLACES DIRECTOS DE IMÁGENES ===
const waifuImages = [
  "https://i.imgur.com/TU_ENLACE1.jpg",
  "https://i.imgur.com/TU_ENLACE2.png",
  "https://i.imgur.com/TU_ENLACE3.jpg",
  "https://example.com/tu-waifu4.jpg",
  // Agrega todos los enlaces que quieras (cuantos más, mejor la variedad)
  // Recomendado: usa enlaces directos que terminen en .jpg .png .webp
]

const handler = async (msg, { conn, usedPrefix, command }) => {
    if (waifuImages.length === 0) {
        return conn.sendMessage(msg.chat, {
            text: '❌ No hay imágenes de waifus configuradas aún.\nAgrega enlaces en el código.'
        }, { quoted: msg })
    }

    // Elige una imagen al azar
    const randomImage = waifuImages[Math.floor(Math.random() * waifuImages.length)]

    await conn.sendMessage(msg.chat, {
        image: { url: randomImage },
        caption: `💕 **Waifu aleatoria** ✨\n\n` +
                 `Escribe *\( {usedPrefix} \){command}* para obtener otra waifu\n` +
                 `Total de waifus: ${waifuImages.length}`
    }, { quoted: msg })
}

handler.help = ['waifu']
handler.tags = ['anime', 'fun']
handler.command = ['waifu', 'chica', 'waifurandom', 'randomwaifu']

export default handler