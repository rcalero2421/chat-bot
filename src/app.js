const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleUserResponse } = require('./controllers/formController');
const { scheduleReminder } = require('./utils/recordatorio');
const { getUserResponse, saveUserResponse } = require('./database/database');
// import moment from 'moment'; // Cambiar a ES6
const moment = require('moment');

let qrCodeData = null; 

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true // Para ejecutar sin interfaz gráfica
    }
});


const initializeBot = () => {
    client.on('qr', qr => {
        qrCodeData = qr; // Guarda el código QR
        console.log('Escanea este QR en WhatsApp Web:');
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('¡Bot de WhatsApp listo!');
        scheduleReminder(client); 
    });

    client.on('message', async msg => {
        console.log(`📩 Mensaje recibido de ${msg.from}: ${msg.body}`);
        
        const chatId = msg.from;
        const message = msg.body.toLowerCase();
        const fechaEvento = moment('2025-02-17');
        const fechaLimiteConfirmacion = moment('2025-02-16');
        const hoy = moment();

        // 🛑 Si estamos después del 16 de febrero, bloquear nuevos registros
        if (hoy.isAfter(fechaLimiteConfirmacion)) {
            return client.sendMessage(chatId, 
                "⚠️ *¡Estamos en los preparativos finales del KickOff 2025 de Unilever!* 🚀\n\n" +
                "Si necesitas más información, contacta a tu asesor o representante de la empresa.\n\n" +
                "📅 *Fecha del evento:* 17 de Febrero del 2025\n" +
                "📍 *Ubicación:* Club Terraza, Salón La Terraza\n" +
                "⏰ *Hora:* 8:00 AM"
            );
        }

        // 🟢 Verificar si el usuario ya está registrado
        const userData = await getUserResponse(chatId);
        if (userData && userData.completed) {
            return client.sendMessage(chatId, 
                `✅ *¡Ya completaste tu registro para el evento!* 🎉\n\n` +
                `📅 *Fecha:* *17 de Febrero del 2025*\n` +
                `📍 *Ubicación:* *Club Terraza, Salón La Terraza*\n` +
                `⏰ *Hora:* *8:00 AM - 10:00 AM (Hora Nicaragua)*\n\n` +
                `📌 *Agéndalo en tu calendario:* \n` +
                `[📅 *Agregar a Google Calendar*](https://www.google.com/calendar/render?action=TEMPLATE&text=KickOff+2025+Unilever&dates=20250217T140000Z/20250217T160000Z&details=Evento+de+lanzamiento+KickOff+2025&location=Club+Terraza,+Managua,+Nicaragua&sf=true&output=xml)\n\n` +
                `🔔 *¡Nos vemos pronto en el evento!* 🚀`
            );
            
        }

        // 🟢 Si el usuario inicia conversación con "Hola"
        if (message === 'hola') {
            await client.sendMessage(chatId, "¡Hola! Soy Lever Bot 🤖, el asistente virtual del KickOff 2025 de Unilever 🚀");
            await client.sendMessage(chatId,
                "Hoy voy a ayudarte a que confirmes tu asistencia a nuestro evento de manera segura. Te compartimos la información:\n\n" +
                "📅 *Fecha:* 17 de Febrero del 2025\n" +
                "📍 *Ubicación:* Club Terraza, Salón Azotea\n" +
                "⏰ *Hora:* 8:00 AM\n\n" +
                "📌 *Agéndalo en tu calendario:* (https://www.google.com/calendar/render?action=TEMPLATE&text=KickOff+2025+Unilever&dates=20250217T140000Z/20250217T160000Z&details=Evento+de+lanzamiento+KickOff+2025&location=Club+Terraza,+Managua,+Nicaragua&sf=true&output=xml)\n\n"
            );
            await client.sendMessage(chatId, "🔹 *¿Estás listo para continuar?*\nResponde: *Sí* o *No*");

            // Guardamos que el usuario está en el paso de confirmación de asistencia
            await saveUserResponse(chatId, { step: 'esperando_respuesta_asistencia' });

        } else if (userData && userData.step === 'esperando_respuesta_asistencia') {
            if (message === 'sí' || message === 'si') {
                await client.sendMessage(chatId, "¡Perfecto! 🎉 Vamos a confirmar tu asistencia.");

                // 🔥 **Corrección: Iniciar correctamente el formulario en la primera pregunta**
                await saveUserResponse(chatId, { step: 1 }); 
                await client.sendMessage(chatId, "✍️ *Formulario de Registro - Convención Smart Future 2025*\n1️⃣ ¿Cuál es tu *nombre completo*?");
            } else if (message === 'no') {
                if (userData.declined) {
                    await client.sendMessage(chatId, "Gracias por tu tiempo. Si cambias de opinión, puedes escribir *Hola* para registrarte. ¡Nos vemos! 👋");
                    await saveUserResponse(chatId, { step: null, declined: true });
                } else {
                    await client.sendMessage(chatId, "¿Deseas asistir al evento? 🎟️\n\nResponde *Sí* para registrarte o *No* si no asistirás.");
                    await saveUserResponse(chatId, { declined: true });
                }
            }
        } else if (message === 'formulario') {
            await handleUserResponse(chatId, message, client);
        } else {
            await handleUserResponse(chatId, message, client);
        }
    });

    client.initialize();
};


const getQrCode = () => qrCodeData;

module.exports = { initializeBot, getQrCode };
