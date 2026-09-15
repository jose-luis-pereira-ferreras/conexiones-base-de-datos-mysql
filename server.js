import express from "express";
import mysql from "mysql2";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "",

    database: "videoclub"

});

connection.connect((error) => {

    if (error) {

        console.error("Error al conectar con MySQL:", error.message);

        return;
    }

    console.log(
        "Conectado correctamente a MySQL y a la base de datos videoclub"
    );

});

// Ruta principal: devuelve el frontend
app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "index.html"));

});

// GET /peliculas: devuelve todas las películas
app.get("/peliculas", (req, res) => {

    const sql = "SELECT * FROM peliculas ORDER BY id";

    connection.query(sql, (error, resultados) => {

        if (error) {

            res.status(500).json({ error: error.message });

            return;
        }

        res.json(resultados);

    });

});

// POST /peliculas: crea una nueva película
app.post("/peliculas", (req, res) => {

    const { titulo, anio } = req.body;

    if (!titulo) {

        res.status(400).json({ error: "El campo 'titulo' es obligatorio" });

        return;
    }

    const sql = "INSERT INTO peliculas (titulo, anio) VALUES (?, ?)";

    connection.query(sql, [titulo, anio], (error, resultado) => {

        if (error) {

            res.status(500).json({ error: error.message });

            return;
        }

        res.status(201).json({ id: resultado.insertId, titulo, anio });

    });

});

// DELETE /peliculas/:id: elimina una película
app.delete("/peliculas/:id", (req, res) => {

    const sql = "DELETE FROM peliculas WHERE id = ?";

    connection.query(sql, [req.params.id], (error, resultado) => {

        if (error) {

            res.status(500).json({ error: error.message });

            return;
        }

        if (resultado.affectedRows === 0) {

            res.status(404).json({ error: "Película no encontrada" });

            return;
        }

        res.json({ mensaje: "Película eliminada", id: req.params.id });

    });

});

app.listen(PORT, () => {

    console.log(
        `Servidor funcionando en http://localhost:${PORT}`
    );

});