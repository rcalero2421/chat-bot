require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { initializeBot, getQrCode, isBotLinked  } = require('./src/app');
const qr = require('qr-image'); // 🔹 Importar qr-image
const { getAllUsers } = require('./src/database/database'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(cors({ origin: '*' }));

app.get('/invitados', async (req, res) => {
    try {
        const allInvitados = await getAllUsers();

        if (!allInvitados || allInvitados.length === 0) {
            return res.json({ success: true, invitados: [], message: "No hay invitados registrados aún." });
        }

        const invitados = allInvitados
            .filter(inv => inv.completed === true) // Filtrar solo los completados
            .map(inv => ({
                nombre: inv.name || "No especificado",
                correo: inv.email || "No especificado",
                experiencia: inv.experience || "No especificado",
                fortalezas: inv.strengths || "No especificado",
                rol_equipo: inv.team_role || "No especificado",
                herramientas_IA: inv.ai_tools || "No especificado",
                interes_IA: inv.ai_interest || "No especificado",
                aprendizaje_IA: inv.ai_learning_interest || "No especificado", // Agregado
                resolucion_retos: inv.problem_solving || "No especificado",
                expectativas: inv.event_expectations || "No especificado",
                pregunta_IA: inv.ai_question || "No especificado",
                solucion_IA: inv.ai_solution || "No especificado", // Agregado
                confirmado: inv.confirmed ? "Sí" : "No"
            }));

        return res.json({
            success: true,
            invitados,
            message: invitados.length > 0 ? "Lista de invitados obtenida correctamente." : "No hay invitados confirmados aún."
        });

    } catch (error) {
        console.error("❌ Error al obtener la lista de invitados:", error);
        return res.status(500).json({ success: false, message: "Error en el servidor." });
    }
});


app.get('/qr', async (req, res) => {
    if (isBotLinked()) {
        return res.status(200).json({ message: "✅ Ya hay un dispositivo vinculado." });
    }

    const qrCode = getQrCode();
    if (!qrCode) {
        return res.status(404).send("⚠️ QR no disponible. Intenta reiniciar el bot.");
    }

    const qrImage = qr.image(qrCode, { type: 'png' });
    res.type('png');
    qrImage.pipe(res);
});

// Init bot
initializeBot();

app.use(express.static('public'));


// Init server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});