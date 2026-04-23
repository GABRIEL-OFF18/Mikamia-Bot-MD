import { promises as fs } from 'fs';

const charactersFilePath = './src/database/characters.json';
const claimMsgFile = './src/database/userClaimConfig.json';

const cooldowns = {};

async function loadCharacters() {
    const data = await fs.readFile(charactersFilePath, 'utf-8');
    return JSON.parse(data);
}

async function saveCharacters(characters) {
    await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8');
}

async function loadClaimMessages() {
    try {
        const data = await fs.readFile(claimMsgFile, 'utf-8');
        return JSON.parse(data);
    } catch {
        return {};
    }
}

async function getCustomClaimMessage(userId, username, characterName) {
    const messages = await loadClaimMessages();
    const template = messages[userId] || '✧ *$user* ha reclamado a *$character* ✦';

    return template
        .replace(/\$user/g, username)
        .replace(/\$character/g, characterName);
}

let handler = async (m, { conn }) => {
    const userId = m.sender;
    const now = Date.now();

    // --- LÓGICA DE COOLDOWN (Se salta si Admin Abuse está activo) ---
    if (!global.adminAbuse && cooldowns[userId] && now < cooldowns[userId]) {
        const remaining = cooldowns[userId] - now;
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return conn.reply(m.chat, `⏳ Debes esperar *${minutes}m ${seconds}s* antes de reclamar otra waifu.`, m);
    }

    if (!m.quoted || !m.quoted.text) {
        return conn.reply(m.chat, '《✧》Debes *citar un personaje válido* para reclamarlo.', m);
    }

    try {
        const characters = await loadCharacters();

        // Extraer ID del mensaje citado
        const match = m.quoted.text.match(/𝙄𝘿:\s*\*([^\*]+)\*/i);
        if (!match) return conn.reply(m.chat, '《✧》No se pudo detectar el ID del personaje.', m);

        const id = match[1].trim();
        const character = characters.find(c => c.id === id);

        if (!character) return conn.reply(m.chat, '《✧》Personaje no encontrado.', m);

        // --- VALIDACIÓN DE DUEÑO ---
        // Si el Admin Abuse está activo, permitimos que el personaje sea reclamado 
        // aunque diga que tiene dueño (para permitir "robos" en el evento)
        if (!global.adminAbuse && character.user && character.user !== userId) {
            return conn.reply(m.chat,
                `✧ El personaje *${character.name}* ya fue reclamado por @${character.user.split('@')[0]}.`,
                m,
                { mentions: [character.user] });
        }

        // Actualizar datos del personaje
        character.user = userId;
        character.status = 'Reclamado';
        await saveCharacters(characters);

        const username = await conn.getName(userId);
        const mensajeFinal = await getCustomClaimMessage(userId, username, character.name);

        await conn.reply(m.chat, mensajeFinal, m);

        // --- APLICAR COOLDOWN (Solo si NO hay evento) ---
        if (!global.adminAbuse) {
            cooldowns[userId] = now + 30 * 60 * 1000; // 30 minutos
        }

    } catch (e) {
        conn.reply(m.chat, `✘ Error al reclamar waifu:\n${e.message}`, m);
    }
};

handler.help = ['claim'];
handler.tags = ['waifus'];
handler.command = ['claim', 'reclamar', 'c'];
handler.group = true;

export default handler;