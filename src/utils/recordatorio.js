const cron = require('node-cron');
const { Client } = require('whatsapp-web.js');
const { getAllUsers } = require('../database/database'); // Asegúrate de que esta función existe

const scheduleReminder = (client) => {
    cron.schedule('0 9 * * 6', async () => {  // Sábado a las 9:00 AM
        console.log("📢 Enviando recordatorio del evento...");

        const users = await getAllUsers();

        users.forEach(async (user) => {
            if (user.confirmed) {
                await client.sendMessage(user.chatId, 
                    "🔔 *Recordatorio: Smart Future 2025* 🚀\n\n" +
                    "¡Hola! No olvides que la convención Smart Future se acerca. Nos vemos el *lunes 17 de febrero a las 8:00 AM* en *Club Terraza, Salón La Terraza*.\n\n" +
                    "📌 *Agenda el evento en tu calendario si aún no lo has hecho:* [📅 Agregar al calendario](https://calendly.com/evento/unilever2025)\n\n" +
                    "¡Nos vemos pronto! 🎉"
                );
            }
        });

        console.log("✅ Recordatorios enviados.");
    }, {
        timezone: "America/Managua"
    });
};

module.exports = { scheduleReminder };
