import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'pene_duelos.json')

// Cargar datos guardados
let duelosData = {}

if (fs.existsSync(FILE)) {
  try {
    duelosData = JSON.parse(fs.readFileSync(FILE, 'utf8'))
  } catch (e) {}
}

const handler = async (msg, { conn, args, usedPrefix, command }) => {
  const chatId = msg.chat
  const sender = msg.sender || msg.participant || msg.key.participant

  if (!duelosData[chatId]) duelosData[chatId] = {}

  // Cargar o inicializar tamaño del usuario
  if (!duelosData[chatId][sender]) {
    duelosData[chatId][sender] = {
      size: Math.floor(Math.random() * 8) + 10, // 10 a 17 cm inicial
      wins: 0,
      losses: 0
    }
  }

  let user1 = sender
  let user2 = null

  // Si mencionas a alguien (@usuario)
  if (msg.mentionedJid && msg.mentionedJid.length > 0) {
    user2 = msg.mentionedJid[0]
  } 
  // Si escribes un número o texto (opcional)
  else if (args.length > 0) {
    // Por simplicidad, si no mencionas, el bot elige un oponente random del grupo (puede fallar si no hay participantes)
    return conn.sendMessage(msg.chat, {
      text: `❌ Usa el comando mencionando a alguien:\n\n*\( {usedPrefix} \){command} @usuario*`
    }, { quoted: msg })
  } else {
    return conn.sendMessage(msg.chat, {
      text: `🍆 *Duelo de Penes*\n\n` +
            `Uso: \( {usedPrefix} \){command} @usuario\n\n` +
            `¡Desafía a alguien a un duelo de penes!`
    }, { quoted: msg })
  }

  if (!duelosData[chatId][user2]) {
    duelosData[chatId][user2] = {
      size: Math.floor(Math.random() * 8) + 10,
      wins: 0,
      losses: 0
    }
  }

  const pene1 = duelosData[chatId][user1]
  const pene2 = duelosData[chatId][user2]

  // Simular el duelo
  const diff = pene1.size - pene2.size
  let resultText = ''
  let winner = null
  let loser = null

  if (Math.abs(diff) < 2) {
    resultText = `¡Empate épico! Ambos tienen casi el mismo tamaño 🍆`
  } else if (diff > 0) {
    // User1 gana
    winner = user1
    loser = user2
    pene1.wins++
    pene2.losses++
    resultText = `🏆 *¡${getMention(user1)} GANA el duelo!*`
  } else {
    // User2 gana
    winner = user2
    loser = user1
    pene2.wins++
    pene1.losses++
    resultText = `🏆 *¡${getMention(user2)} GANA el duelo!*`
  }

  // Guardar cambios
  fs.writeFileSync(FILE, JSON.stringify(duelosData, null, 2))

  // Mensaje final con ASCII
  const ascii1 = generatePeneASCII(pene1.size)
  const ascii2 = generatePeneASCII(pene2.size)

  const finalMessage = `🍆 *DUELLO DE PENES* 🍆\n\n` +
    `👤 ${getMention(user1)}: \( {pene1.size} cm\n \){ascii1}\n\n` +
    `VS\n\n` +
    `👤 ${getMention(user2)}: \( {pene2.size} cm\n \){ascii2}\n\n` +
    `${resultText}\n\n` +
    `📊 *Estadísticas:*\n` +
    `${getMention(user1)} → Victorias: ${pene1.wins} | Derrotas: ${pene1.losses}\n` +
    `${getMention(user2)} → Victorias: ${pene2.wins} | Derrotas: ${pene2.losses}`

  await conn.sendMessage(msg.chat, { text: finalMessage }, { quoted: msg })
}

// Función auxiliar para mostrar @usuario
function getMention(jid) {
  return `@${jid.split('@')[0]}`
}

// Generador de pene ASCII según tamaño
function generatePeneASCII(size) {
  const length = Math.min(Math.floor(size / 2.5), 22)
  let pene = '🍆\n'
  pene += '   8' + '='.repeat(length) + 'D\n'
  pene += '      ||'
  if (size >= 25) pene += ' 💦'
  if (size >= 40) pene += ' 🔥🔥'
  return pene
}

handler.help = ['duelopene @usuario', 'duelo @usuario']
handler.tags = ['fun']
handler.command = ['duelopene', 'duelo', 'peneduelo', 'duelopene']

export default handler