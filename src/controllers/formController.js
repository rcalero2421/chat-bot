const { saveUserResponse, getUserResponse } = require('../database/database');

const handleUserResponse = async (chatId, message, client) => {
    let userData = await getUserResponse(chatId);

    // Si el usuario es nuevo, inicializar el formulario en `step: 1`
    if (!userData) {
        await saveUserResponse(chatId, { step: 1 });
        return client.sendMessage(chatId, "✍️ *Formulario de Registro - Convención Smart Future 2025*\n1️⃣ ¿Cuál es tu *nombre completo*?");
    }

    // Función para enviar mensaje de error
    const sendInvalidMessage = async (chatId, text) => {
        await client.sendMessage(chatId, `❌ Respuesta inválida. ${text}`);
    };

    // Manejo de respuestas basado en el `step`
    switch (userData.step) {
        case 1:
            if (!message.trim()) {
                return sendInvalidMessage(chatId, "Por favor, ingresa tu nombre.");
            }
            await saveUserResponse(chatId, { name: message, step: 2 });
            return client.sendMessage(chatId, "3️⃣ ¿Cuántos años de experiencia tienes en ventas o consumo masivo?\n🔹 1. Menos de 1 año\n🔹 2. 1-3 años\n🔹 3. 3-5 años\n🔹 4. Más de 5 años");
            // return client.sendMessage(chatId, "2️⃣ ¿Cuál es tu *correo electrónico*?");

        // case 2:
        //     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(message)) {
        //         return sendInvalidMessage(chatId, "Por favor, ingresa un correo electrónico válido.");
        //     }
        //     await saveUserResponse(chatId, { email: message, step: 3 });
        //     return client.sendMessage(chatId, "3️⃣ ¿Cuántos años de experiencia tienes en ventas o consumo masivo?\n🔹 1. Menos de 1 año\n🔹 2. 1-3 años\n🔹 3. 3-5 años\n🔹 4. Más de 5 años");

        case 2:
            if (!["1", "2", "3", "4"].includes(message)) {
                return sendInvalidMessage(chatId, "Selecciona una opción válida (1, 2, 3 o 4).");
            }
            await saveUserResponse(chatId, { experience: message, step: 3 });
            return client.sendMessage(chatId, "4️⃣ ¿En qué área se siente más fuerte? (Elija hasta 2 opciones separadas por coma)\n🔹 1. Negociación\n🔹 2. Marketing\n🔹 3. Clientes\n🔹 4. Análisis de datos\n🔹 5. Trade marketing\n🔹 6. Innovación");

        case 3:
            const selectedStrengths = message.split(',').map(s => s.trim());
            if (selectedStrengths.length > 2 || !selectedStrengths.every(s => ["1", "2", "3", "4", "5", "6"].includes(s))) {
                return sendInvalidMessage(chatId, "Selecciona hasta 2 opciones válidas (1-6).");
            }
            await saveUserResponse(chatId, { strengths: message, step: 4 });
            return client.sendMessage(chatId, "5️⃣ ¿Cómo se describiría en un equipo de trabajo?\n🔹 1. Líder\n🔹 2. Estratega\n🔹 3. Creativo\n🔹 4. Ejecutor\n🔹 5. Colaborador");

        case 4:
            if (!["1", "2", "3", "4", "5"].includes(message)) {
                return sendInvalidMessage(chatId, "Selecciona una opción válida (1-5).");
            }
            await saveUserResponse(chatId, { team_role: message, step: 5 });
            return client.sendMessage(chatId, "6️⃣ ¿Qué herramienta de IA utilizas más?\n🔹 1. ChatGPT\n🔹 2. Automatización\n🔹 3. Análisis de datos\n🔹 4. No uso IA");

        case 5:
            if (!["1", "2", "3", "4"].includes(message)) {
                return sendInvalidMessage(chatId, "Selecciona una opción válida (1-4).");
            }
            await saveUserResponse(chatId, { ai_tools: message, step: 6 });
            return client.sendMessage(chatId, "7️⃣ ¿Qué aspecto de la IA en ventas te emociona más?\n🔹 1. Personalización\n🔹 2. Automatización\n🔹 3. Predicción de tendencias\n🔹 4. Creación de contenido");

        case 6:
            if (!["1", "2", "3", "4"].includes(message)) {
                return sendInvalidMessage(chatId, "Selecciona una opción válida (1-4).");
            }
            await saveUserResponse(chatId, { ai_interest: message, step: 7 });
            return client.sendMessage(chatId, "8️⃣ ¿Cómo prefieres afrontar un reto?\n🔹 1. Individual\n🔹 2. En equipo\n🔹 3. Creatividad\n🔹 4. Estrategia probada");

        case 7:
            if (!["1", "2", "3", "4"].includes(message)) {
                return sendInvalidMessage(chatId, "Selecciona una opción válida (1-4).");
            }
            await saveUserResponse(chatId, { problem_solving: message, step: 8 });
            return client.sendMessage(chatId, "9️⃣ ¿Nivel de interés en IA para marketing?\n🔹 1. Muy alto\n🔹 2. Alto\n🔹 3. Medio\n🔹 4. Bajo");

        case 8:
            if (!["1", "2", "3", "4"].includes(message)) {
                return sendInvalidMessage(chatId, "Selecciona una opción válida (1-4).");
            }
            await saveUserResponse(chatId, { ai_learning_interest: message, step: 9 });
            return client.sendMessage(chatId, "🔟 ¿Qué IA te gustaría implementar en tu trabajo?\n🔹 1. Chatbot\n🔹 2. Ventas predictivas\n🔹 3. Automatización\n🔹 4. Generador de contenido");

        case 9:
            if (!["1", "2", "3", "4"].includes(message)) {
                return sendInvalidMessage(chatId, "Selecciona una opción válida (1-4).");
            }
            await saveUserResponse(chatId, { ai_solution: message, step: 10 });
            return client.sendMessage(chatId, "1️⃣1️⃣ ¿Qué esperas obtener de la convención? (Máximo 2 opciones separadas por coma)\n🔹 1. Estrategias\n🔹 2. Networking\n🔹 3. Innovación\n🔹 4. Habilidades\n🔹 5. Dinámicas");

        case 10:
            const selectedExpectations = message.split(',').map(s => s.trim());
            if (selectedExpectations.length > 2 || !selectedExpectations.every(s => ["1", "2", "3", "4", "5"].includes(s))) {
                return sendInvalidMessage(chatId, "Selecciona hasta 2 opciones válidas (1-5).");
            }
            await saveUserResponse(chatId, { event_expectations: message, step: 11 , completed: true });
            // return client.sendMessage(chatId, "1️⃣2️⃣ Si pudieras hacerle una pregunta a la IA sobre ventas, ¿cuál sería?");

        case 11:
            // if (!message.trim()) {
            //     return sendInvalidMessage(chatId, "Por favor, ingresa una pregunta válida.");
            // }
        
            // await saveUserResponse(chatId, { ai_question: message, step: 13 });
        
            await client.sendMessage(chatId, 
                "✅ ¡Formulario completado! Gracias por confirmar tu asistencia.\n\n" +
                "‼ Es importante que te unas al grupo de WhatsApp de la convención porque ahí estaremos compartiendo todas las herramientas e información durante el evento, ¡Nos vemos el lunes! 🚀\n\n" +
                "👉 Únete aquí: [🔗 Grupo de WhatsApp](https://chat.whatsapp.com/78890007)"
            );
            
            // case 13:
            //     if (message.toLowerCase() === 'sí' || message.toLowerCase() === 'si') {
            //         await saveUserResponse(chatId, { confirmed: true, step: 14 , completed: true});
            
            //         await client.sendMessage(chatId, 
            //             "🎉 *¡Perfecto!* Estás en nuestra lista de invitados especiales.\n\n" +
            //             "📢 Para estar al tanto de todo lo que sucederá en el evento, únete a nuestro grupo de WhatsApp: [🔗 Únete aquí](https://chat.whatsapp.com/78890007)"
            //         );
            
            //         await client.sendMessage(chatId, 
            //             "📌 *Ahora te compartimos los detalles del evento:*\n\n" +
            //             "📅 *Fecha:* 17 de Febrero del 2025\n" +
            //             "📍 *Ubicación:* Club Terraza, Salón La Terraza\n" +
            //             "⏰ *Hora:* 8:00 AM\n\n" +
            //             "📌 *Agéndalo en tu calendario:* [📅 Agregar al calendario](https://www.google.com/calendar/render?action=TEMPLATE&text=KickOff+2025+Unilever&dates=20250217T080000Z/20250217T100000Z&details=Evento+de+lanzamiento+KickOff+2025&location=Club+Terraza,+Salón+La+Terraza&sf=true&output=xml)\n\n" +
            //             "¡Nos vemos pronto! 🚀"
            //         );
            //     } else if (message.toLowerCase() === 'no') {
            //         await saveUserResponse(chatId, { confirmed: false, step: 12 });
            
            //         await client.sendMessage(chatId, 
            //             "⚠️ *Recuerda que completar el cuestionario es un requisito para asistir al evento.*\n\n" +
            //             "✍️ *Por favor, completa el formulario enviando 'Formulario'.*"
            //         );
            //     } else {
            //         return sendInvalidMessage(chatId, "Por favor, responde *Sí* o *No*.");
            //     }
            //     break;
            

        default:
            return client.sendMessage(chatId, "Escribe *Formulario* para empezar.");
    }
};

module.exports = { handleUserResponse };
