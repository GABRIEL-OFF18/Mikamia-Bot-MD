import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'pene_duelos.json')

// Cargar datos de penes (reutiliza el mismo archivo del duelo)
let duelosData = {}

if (fs.existsSync(FILE)) {
  try {
    duelosData = JSON.parse(fs.readFileSync(FILE, 'utf8'))
  } catch (e) {}
}

const handler = async (msg, { conn, usedPrefix, command }) => {
  const chatId = msg.chat

  if (!duelosData[chatId] || Object.keys(duelosData[chatId]).length === 0) {
    return conn.sendMessage(msg.chat, {
      text: `🍆 *Top de Penes*\n\n` +
            `Todavía no hay datos en este grupo.\n` +
            `¡Usa *.duelo @usuario* para empezar a medir penes!`
    }, { quoted: msg })
  }

  // Obtener todos los usuarios del grupo y sus tamaños
  const users = Object.entries(duelosData[chatId])
    .map(([jid, data]) => ({
      jid,
      size: data.size || 10,
      wins: data.wins || 0
    }))
    .sort((a, b) => b.size - a.size) // Ordenar de mayor a menor
    .slice(0, 10) // Top 10

  if (users.length === 0) {
    return conn.sendMessage(msg.chat, {
      text: `🍆 *Top de Penes más Grandes*\n\nNo hay datos suficientes aún.`
    }, { quoted: msg })
  }

  let text = `🏆 *TOP ${users.length} PENES MÁS GRANDES* 🍆\n\n`

  users.forEach((user, index) => {
    const position = index + 1
    const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `${position}.`
    
    text += `${medal} \( {getMention(user.jid)} — * \){user.size} cm*\n`
    
    // Añadir pene ASCII pequeño para los top 3
    if (position <= 3) {
      text += `${generateMiniPene(user.size)}\n`
    }
    text += `\n`
  })

  text += `──────────────────\n`
  text += `Usa *.duelo @usuario* para medir y competir 🍆`

  await conn.sendMessage(msg.chat, { text }, { quoted: msg })
}

// Función auxiliar para mencionar
function getMention(jid) {
  return `@${jid.split('@')[0]}`
}

// Generador de pene ASCII pequeño para el top
function generateMiniPene(size) {
  const length = Math.min(Math.floor(size / 4), 15)
  return '　　8' + '='.repeat(length) + 'D 🍆'
}

handler.help = ['toppene', 'toppenes', 'topdick']
handler.tags = ['fun']
handler.command = ['toppene', 'toppenes', 'topdick', 'rankingpene']

export default handler