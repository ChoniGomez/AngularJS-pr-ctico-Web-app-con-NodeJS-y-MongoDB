var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
var Tareas = mongoose.model('Tareas');


// GET - Listar tareas
router.get('/tareas', async function(req, res, next) {
  try {
    // Usar async/await para obtener las tareas
    const tareas = await Tareas.find();

    res.json(tareas);  // Devolver las tareas encontradas
  } catch (err) {
    next(err);  // Pasar el error al siguiente middleware
  }
});


// POST - Agregar tarea
router.post('/tarea', async function(req, res, next) {
  try {
    var tarea = new Tareas(req.body);

    // Usar async/await para guardar la tarea
    const nuevaTarea = await tarea.save();

    res.json(nuevaTarea);  // Devolver la tarea creada
  } catch (err) {
    next(err);  // Pasar el error al siguiente middleware
  }
});

// PUT - Actualizar tarea
router.put('/tarea/:id', async function(req, res, next) {
  try {
    // Buscar la tarea por su ID
    const tarea = await Tareas.findById(req.params.id);

    // Si no se encuentra la tarea, devolver error 404
    if (!tarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Actualizar los campos de la tarea
    tarea.nombre = req.body.nombre;
    tarea.prioridad = req.body.prioridad;

    // Guardar la tarea actualizada
    await tarea.save();

    // Devolver la tarea actualizada como respuesta
    res.json(tarea);
  } catch (err) {
    next(err);  // Pasar el error al siguiente middleware
  }
});

// DELETE - Eliminar tarea
router.delete('/tarea/:id', async function(req, res, next) {
  try {
    const tarea = await Tareas.findByIdAndDelete(req.params.id);

    // Verificar si la tarea existía antes de intentar eliminarla
    if (!tarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json({ message: 'La tarea se ha eliminado correctamente' });
  } catch (err) {
    next(err); // Pasar el error al middleware de manejo de errores
  }
});

module.exports = router;
