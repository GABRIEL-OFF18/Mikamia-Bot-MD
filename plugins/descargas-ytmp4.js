/**
 * 📂 COMANDO: Uchiha Video Downloader
 * 📝 DESCRIPCIÓN: Extractor de video MP4 de alta velocidad.
 * 👤 CREADOR: Barboza Developer
 * ⚡ CANAL: Barboza Developer x Zona Developers
 * Usen los código porfa para traer más 
 * 🔗 API: https://api.evogb.org
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const sigma = "𐏓 Dev-Fedex ⚡"
    const red = "𐋉 BLUE BLOCK"
    
    if (!text) return conn.reply(m.chat, `🌀 *SISTEMA DE INVOCACIÓN*\n\n> ⛩️ *Escribe el enlace de video*\n> 📍 *Ej:* ${usedPrefix + command} https://youtu.be/...`, m)

    await m.react('👁️') 

    try {
        const b = (s) => Buffer.from(s, 'base64').toString('utf-8')
        const base = b("aHR0cHM6Ly9hcGkuZXZvZ2Iub3Jn")
        const key = b("c2FzdWtl")

        let res = await fetch(`${base}/dl/ytmp4?url=${encodeURIComponent(text)}&key=${key}`)
        let json = await res.json()

        if (!json.status || !json.data || !json.data.dl) {
            await m.react('🚫')
            return m.reply('🌌 *EL PRIME ES INSUFICIENTE*\nIntenta con otro enlace.')
        }

        const vid = json.data

        let txt = `🏮 *NAGI VIDEO CINEMA* 🏮\n`
        txt += `─━━━━━━⊱ 🪐 ⊰━━━━━━─\n\n`
        txt += `🎬 *𝖭𝖮𝖬𝖡𝖱𝖤:* ${vid.title}\n`
        txt += `💎 *𝖱𝖤𝖲𝖮𝖫𝖴𝖢𝖨𝖮́𝖭:* ${vid.quality}\n`
        txt += `🧬 *𝖳𝖨𝖯𝖮:* ${vid.type}\n`
        txt += `📽️ *𝖥𝖮𝖱𝖬𝖠𝖳𝖮:* .${vid.format}\n\n`
        txt += `─━━━━━━⊱ 🪐 ⊰━━━━━━─\n`
        txt += `🛠️ ${sigma}\n`
        txt += `🛰️ ${red}`

        await conn.sendMessage(m.chat, { 
            video: { url: vid.dl }, 
            caption: txt,
            mimetype: 'video/mp4',
            fileName: `${vid.title}.mp4`
        }, { quoted: m })

        await m.react('🛸') 

    } catch (e) {
        await m.react('❗')
    }
}

handler.help = ['ytmp4', 'play2', 'ytv']
handler.tags = ['descargas']
handler.command = ['ytmp4', 'ytv', 'video']

export default handler