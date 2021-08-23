const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Server
const app = express();

// Conectar DB
connectDB();

const options = {
    origin: process.env.FRONT_URL
}
app.use(cors(options));

// bodyParser
app.use(express.json());

// Carpeta pública
app.use(express.static('uploads'));

// Cors
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/links', require('./routes/links'));
app.use('/api/files', require('./routes/files'));

// Puerto de la app para el deployment
const port = process.env.PORT || 4000;
app.listen(port, '0.0.0.0', () => {
    console.log("Server running");
})