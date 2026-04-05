const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const alumnoRoutes = require('./routes/alumnoRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const cajaRoutes = require('./routes/cajaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes'); 
const productoRoutes = require('./routes/productoRoutes');
const gradoMateriaRoutes = require('./routes/gradoMateriaRoutes');
const catalogosRoutes = require('./routes/catalogosRoutes');
const inscripcionRoutes = require('./routes/inscripcionRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');// <-- NUEVA

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/alumnos', alumnoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/caja', cajaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/grados-materias', gradoMateriaRoutes);
app.use('/api/catalogos', catalogosRoutes);
app.use('/api/inscripciones', inscripcionRoutes); 
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/proveedores', proveedorRoutes);// <-- NUEVA

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor backend en http://localhost:${PORT}`));