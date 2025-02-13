require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { initializeBot, getQrCode  } = require('./src/app');
const qr = require('qr-image'); // 🔹 Importar qr-image
const { getAllUsers } = require('./src/database/database'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(cors({ origin: '*' }));

app.get('/invitados', async (req, res) => {
    try {
        const invitados = await getAllUsers(); // Obtener la lista de invitados desde la base de datos

        res.json({
            success: true,
            invitados: invitados.map(inv => ({
                nombre: inv.name,
                correo: inv.email,
                experiencia: inv.experience,
                fortalezas: inv.strengths,
                rol_equipo: inv.team_role,
                herramientas_IA: inv.ai_tools,
                interes_IA: inv.ai_interest,
                resolucion_retos: inv.problem_solving,
                expectativas: inv.event_expectations,
                pregunta_IA: inv.ai_question,
                confirmado: inv.confirmed ? 'Sí' : 'No'
            }))
        });
    } catch (error) {
        console.error("❌ Error al obtener la lista de invitados:", error);
        res.status(500).json({ success: false, message: "Error en el servidor." });
    }
});

app.get('/qr', async (req, res) => {
    const qrCode = getQrCode(); // Obtenemos el último QR generado
    if (!qrCode) {
        return res.status(404).send("⚠️ QR no disponible. Intenta reiniciar el bot.");
    }

    const qrImage = qr.image(qrCode, { type: 'png' });
    res.type('png');
    qrImage.pipe(res);
})

// Init bot
initializeBot();

app.use(express.static('public'));


// Init server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});