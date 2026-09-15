# Videoclub - Catálogo de películas

API REST + frontend para gestionar un catálogo de películas usando **Node.js**, **Express** y **MySQL**.

## Características

- Listar películas desde la base de datos
- Añadir nuevas películas (título y año)
- Eliminar películas con confirmación previa
- Interfaz gráfica con estilos separados en ficheros externos (CSS) y lógica en `script.js`

## Estructura

```
peliculasAPIS/
├── public/
│   ├── index.html   # Estructura HTML
│   ├── style.css    # Estilos separados
│   └── script.js    # Lógica del frontend
├── server.js        # API REST (Express + MySQL)
├── package.json
└── .gitignore
```

## Requisitos previos

- Node.js (con npm)
- MySQL con una base de datos llamada `videoclub`

### Crear la base de datos

```sql
CREATE DATABASE videoclub;
USE videoclub;

CREATE TABLE peliculas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    anio INT
);
```

## Configuración

Indica los datos de conexión a MySQL en `server.js`:

```js
host: "localhost",
user: "root",
password: "",
database: "videoclub"
```

## Instalación y ejecución

```bash
npm install
npm start   # o: node server.js
```

El servidor arranca en http://localhost:3000

## Endpoints

| Método | Ruta             | Descripción               |
|--------|------------------|---------------------------|
| GET    | /peliculas       | Lista todas las películas |
| POST   | /peliculas       | Crea una nueva película   |
| DELETE | /peliculas/:id   | Elimina una película      |
