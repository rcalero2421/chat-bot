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
            return client.sendMessage(chatId, "2️⃣ ¿Cuántos años de experiencia tienes trabajando en consumo masivo?\n🔹 1. Menos de 1 año\n🔹 2. 1-3 años\n🔹 3. 3-5 años\n🔹 4. Más de 5 años");
        
        case 2:
            if (!["1", "2", "3", "4"].includes(message)) {
                return sendInvalidMessage(chatId, "Selecciona una opción válida (1, 2, 3 o 4).");
            }
            await saveUserResponse(chatId, { experience: message, step: 3 });
            return client.sendMessage(chatId, "3️⃣ ¿En qué departamento laboras? \n🔹 1. Ventas\n🔹 2. Mercadeo\n🔹 3. Recursos Humanos\n🔹 4. Logística\n🔹 5. Atención al Cliente\n🔹 6. Finanzas");
        
        case 3:
            if (!["1", "2", "3", "4", "5", "6"].includes(message)) {
                return sendInvalidMessage(chatId, "Selecciona una opción válida (1-6).");
            }
            await saveUserResponse(chatId, { department: message, step: 4 });
            return client.sendMessage(chatId, "4️⃣ ¿Cómo se describiría en un equipo de trabajo?\n🔹 1. Líder\n🔹 2. Estratega\n🔹 3. Creativo\n🔹 4. Ejecutor\n🔹 5. Colaborador");
        
        case 4:
            if (!["1", "2", "3", "4", "5"].includes(message)) {
                return sendInvalidMessage(chatId, "Selecciona una opción válida (1-5).");
            }
            await saveUserResponse(chatId, { team_role: message, step: 5 });
            return client.sendMessage(chatId, "5️⃣ ¿Has usado alguna herramienta de Inteligencia Artificial?\n🔹 Si\n🔹 No");
        
        case 5:
            if (!["si", "no"].includes(message.toLowerCase())) {
                return sendInvalidMessage(chatId, "Selecciona una opción válida (Si | No).");
            }
            await saveUserResponse(chatId, { ai_tools: message, step: 6 });
            return client.sendMessage(chatId, "6️⃣ ¿Qué aspecto de la Inteligencia Artificial (IA) llama tu atención?\n🔹 1. Personalización\n🔹 2. Automatización\n🔹 3. Análisis de datos\n🔹 4. Creación de contenido");
        
        case 6:
            if (!["1", "2", "3", "4"].includes(message)) {
                return sendInvalidMessage(chatId, "Selecciona una opción válida (1-4).");
            }
            await saveUserResponse(chatId, { ai_interest: message, step: 7 });
            return client.sendMessage(chatId, "7️⃣ ¿Cómo prefieres afrontar un reto?\n🔹 1. Individual\n🔹 2. En equipo\n🔹 3. Creatividad\n🔹 4. Estrategia probada");
        
        case 7:
            if (!["1", "2", "3", "4"].includes(message)) {
                return sendInvalidMessage(chatId, "Selecciona una opción válida (1-4).");
            }
            await saveUserResponse(chatId, { problem_solving: message, step: 8 });
            return client.sendMessage(chatId, "8️⃣ ¿Qué IA te gustaría implementar en tu trabajo?\n🔹 1. Chatbot\n🔹 2. Ventas predictivas\n🔹 3. Automatización\n🔹 4. Generador de contenido");
        
        case 8:
            if (!["1", "2", "3", "4"].includes(message)) {
                return sendInvalidMessage(chatId, "Selecciona una opción válida (1-4).");
            }
            await saveUserResponse(chatId, { ai_solution: message, step: 9 });
            return client.sendMessage(chatId, "9️⃣ ¿Qué esperas obtener de la convención? (Máximo 2 opciones separadas por coma)\n🔹 1. Estrategias\n🔹 2. Networking\n🔹 3. Innovación\n🔹 4. Habilidades\n🔹 5. Dinámicas");
        
        case 9:
            const selectedExpectations = message.split(',').map(s => s.trim());
            if (selectedExpectations.length > 2 || !selectedExpectations.every(s => ["1", "2", "3", "4", "5"].includes(s))) {
                return sendInvalidMessage(chatId, "Selecciona hasta 2 opciones válidas (1-5).");
            }
            await saveUserResponse(chatId, { event_expectations: message, step: 10, completed: true });

            await client.sendMessage(chatId, 
                "✅ ¡Formulario completado! Gracias por confirmar tu asistencia.\n\n" +
                "‼ Es importante que te unas al grupo de WhatsApp de la convención porque ahí estaremos compartiendo todas las herramientas e información durante el evento.\n\n" +
                "👉 Únete aquí: [🔗 Grupo de WhatsApp](https://whatsapp.com/channel/0029Vb1TU376hENhwrNohC11)\n\n" + 
                "🔔 *¡Nos vemos el lunes!* 🚀"
            );
            break;

        default:
            return client.sendMessage(chatId, "Escribe *Formulario* para empezar.");
    }
};

module.exports = { handleUserResponse };
