const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "Chupeteo6$",
  database: "likeme",
  port: 5432,
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor Like Me funcionando");
});

// Obtener todos los posts
app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los posts" });
  }
});

// Crear un nuevo post
app.post("/posts", async (req, res) => {
  try {
    const { titulo, img, descripcion, likes } = req.body;

    const result = await pool.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *",
      [titulo, img, descripcion, likes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el post" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});