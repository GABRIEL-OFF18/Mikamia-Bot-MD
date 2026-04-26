import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'pene_size.json')

// Cargar tamaño guardado (persiste entre reinicios del bot)
let peneData = { size: 12, lastDate: null, record: 12 }

if (fs.existsSync(FILE)) {
  try {
    peneData = JSON.parse(fs.readFileSync(FILE, 'utf8'))
  } catch (e) {
    console.error('Error leyendo archivo de pene:', e)
  }
}

const handler = async (msg, { conn, usedPrefix, command }) => {
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  let message = ''

  if (peneData.lastDate !== today) {
    // Crece solo una vez por día
    const growth = Math.floor(Math.random() * 4) + 2   // crece entre 2 y 5 cm
    peneData.size += growth
    peneData.lastDate = today

    if (peneData.size > peneData.record) {
      peneData.record = peneData.size
    }

    // Guardar progreso
    fs.writeFileSync(FILE, JSON.stringify(peneData, null, 2))

    message = `🍆 *¡PAJA DEL DÍA COMPLETADA!*\n\n` +
              `Tu pene creció **+${growth} cm** hoy 🔥\n\n` +
              `*Tamaño actual:* **${peneData.size} cm**\n` +
              `*Récord histórico:* ${peneData.record} cm 🏆`
  } else {
    message = `🍆 Ya te pajaste hoy, campeón.\n\n` +
              `*Tamaño actual:* **${peneData.size} cm**\n` +
              `Vuelve mañana para que siga creciendo 😉`
  }

  // ASCII Art que crece según el tamaño
  const asciiPene = generatePeneASCII(peneData.size)

  await conn.sendMessage(msg.chat, {
    text: message + '\n\n' + asciiPene
  }, { quoted: msg })
}

// Función que genera un pene ASCII más grande según el tamaño
function generatePeneASCII(size) {
  const length = Math.min(Math.floor(size / 3), 25) // máximo \~25 caracteres de largo

  let pene = '🍆\n'
  pene += '  '.repeat(3) + '8' + '='.repeat(length) + 'D\n'
  pene += '     '.repeat(2) + '||\n'
  pene += '    '.repeat(2) + '(   )'

  if (size > 30) pene += ' 💦'
  if (size > 50) pene += ' 🔥'

  return pene
}

handler.help = ['paja', 'pene', 'crecerpene']
handler.tags = ['fun']
handler.command = ['paja', 'pene', 'dick', 'crecerpene']

export default handler