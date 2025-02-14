const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleUserResponse } = require('./controllers/formController');
const { scheduleReminder } = require('./utils/recordatorio');
const { getUserResponse, saveUserResponse, deleteUserResponse } = require('./database/database');
const moment = require('moment');

let qrCodeData = null;
let isDeviceLinked = false;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    }
});

const SESSION_TIMEOUT_MINUTES = 10; // 🔥 Tiempo de expiración en minutos

const initializeBot = () => {
    client.on('qr', qr => {
        if (!isDeviceLinked) {
            qrCodeData = qr;
            console.log('Escanea este QR en WhatsApp Web:');
            qrcode.generate(qr, { small: true });
        }
    });

    client.on('ready', () => {
        console.log('¡Bot de WhatsApp listo!');
        isDeviceLinked = true;
        scheduleReminder(client);
    });

    client.on('disconnected', () => {
        console.log('❌ Dispositivo desconectado. Generando nuevo QR...');
        isDeviceLinked = false;
    });

    client.on('message', async msg => {
        console.log(`📩 Mensaje recibido de ${msg.from}: ${msg.body}`);

        const chatId = msg.from;
        const message = msg.body.toLowerCase().trim();
        const now = moment();
        const userData = await getUserResponse(chatId);

        const greetingKeywords = ['hola', 'hola, quiero ir al kickoff de unilever'];

        // 🔥 Si el usuario ya completó el registro, evitar que vuelva a iniciar
        if (userData && userData.completed) {
            return client.sendMessage(chatId,
                `✅ *¡Ya completaste tu registro para el evento!* 🎉\n\n` +
                `📅 *Fecha:* 17 de Febrero del 2025\n` +
                `📍 *Ubicación:* Club Terraza, Salón La Terraza\n` +
                `⏰ *Hora:* 8:15 AM - 10:00 AM (Hora Nicaragua)*\n\n` +
                `📌 *Agéndalo en tu calendario:* \n` +
                `[📅 *Agregar a Google Calendar*](https://www.google.com/calendar/render?action=TEMPLATE&text=KickOff+2025+Unilever&dates=20250217T140000Z/20250217T160000Z&details=Evento+de+lanzamiento+KickOff+2025&location=Club+Terraza,+Managua,+Nicaragua&sf=true&output=xml)\n\n` +
                "‼ Es importante que te unas al grupo de WhatsApp de la convención porque ahí estaremos compartiendo todas las herramientas e información durante el evento.\n\n" +
                "👉 Únete aquí: [🔗 Grupo de WhatsApp](https://whatsapp.com/channel/0029Vb1TU376hENhwrNohC11)\n\n" +
                "🔔 *¡Nos vemos el lunes!* 🚀"
            );
        }

        // 🔥 Si el usuario inició pero no terminó el formulario y pasó el tiempo límite, eliminar el registro
        if (userData && userData.step && userData.timestamp) {
            const lastInteraction = moment(userData.timestamp);
            const minutesSinceLastInteraction = now.diff(lastInteraction, 'minutes');

            if (minutesSinceLastInteraction > SESSION_TIMEOUT_MINUTES) {
                console.log(`⏳ Eliminando sesión expirada para ${chatId}`);
                await deleteUserResponse(chatId);
                return client.sendMessage(chatId, "⏳ Tu sesión ha expirado debido a inactividad. Escribe *Hola* para comenzar de nuevo.");
            }
        }

        // ✅ Solo permitir acceso si la conversación empieza con los saludos definidos en `greetingKeywords`
        if (greetingKeywords.some(keyword => message.includes(keyword))) {
            await client.sendMessage(chatId, "¡Hola! Soy Lever Bot 🤖, el asistente virtual del KickOff 2025 de Unilever 🚀");
            await client.sendMessage(chatId,
                "Hoy voy a ayudarte a que confirmes tu asistencia a nuestro evento de manera segura. Te compartimos la información:\n\n" +
                "📅 *Fecha:* 17 de Febrero del 2025\n" +
                "📍 *Ubicación:* Club Terraza, Salón Azotea\n" +
                "⏰ *Hora:* 8:15 AM\n\n" +
                "📌 *Agéndalo en tu calendario:* (https://www.google.com/calendar/render?action=TEMPLATE&text=KickOff+2025+Unilever&dates=20250217T140000Z/20250217T160000Z&details=Evento+de+lanzamiento+KickOff+2025&location=Club+Terraza,+Managua,+Nicaragua&sf=true&output=xml)\n\n"
            );
            await client.sendMessage(chatId, "🔹 *¿Estás listo para continuar?*\nResponde: *Sí* o *No*");

            await saveUserResponse(chatId, { step: 'esperando_respuesta_asistencia', timestamp: now.toISOString() });

        } else if (userData.step === 'esperando_respuesta_asistencia') {
            if (message === 'sí' || message === 'si') {
                await client.sendMessage(chatId, "¡Perfecto! 🎉 Vamos a confirmar tu asistencia.");

                await saveUserResponse(chatId, { step: 1, timestamp: now.toISOString() });
                await client.sendMessage(chatId, "✍️ *Formulario de Registro - Convención Smart Future 2025*\n1️⃣ ¿Cuál es tu *nombre completo*?");
            } else if (message === 'no') {
                await client.sendMessage(chatId, "Gracias por tu tiempo. Si cambias de opinión, puedes escribir *Hola* para registrarte. ¡Nos vemos! 👋");
                await deleteUserResponse(chatId);
            }
        }
        else if (userData.step >= 1) {
            console.log(`⚡ Enviando mensaje a handleUserResponse para ${chatId}, en paso: ${userData.step}`);
            await handleUserResponse(chatId, message, client);
        }
    });

    client.initialize();
};

const getQrCode = () => qrCodeData;
const isBotLinked = () => isDeviceLinked;

module.exports = { initializeBot, getQrCode, isBotLinked };
