// Importar el módulo rootpath para poder utilizar rutas relativas
require("rootpath")();

// Importar el módulo express
const express = require("express");

// Crear una instancia de express
const app = express();

// Utilizar el middleware de express.json()
app.use(express.json());

// Utilizar el middleware de express.urlencoded() con la opción extended en true
app.use(express.urlencoded({ extended: true }));

// Importar el módulo camisetas del modelo
const imagenesDb = require("../Model/imagenes");

// Importar el módulo securityController
const securityController = require("./securityController");

// Definir las rutas de escucha (endpoint) disponibles para PERSONAS
app.get("/", buscarTodos);
app.post("/", crear);
app.put("/:id", securityController.verificarToken, actualizar);
app.delete("/:id", securityController.verificarToken, borrar);
app.get("/:id", getById);

// Definir las funciones utilizadas en los endpoints

// Listar todos los camisetass
function buscarTodos(req, res) {
  imagenesDb.getAll(function (err, resultado) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(resultado);
    }
  });
}

// Crear camisetas
function crear(req, res) {
  let imagen = req.body;
  imagenesDb.create(imagen, (err, resultado) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(resultado);
    }
  });
}

// Actualizar camisetas
function actualizar(req, res) {
  let imagen = req.body;
  let id = req.params.id;
  imagenesDb.update(imagen, id, (err, resultado) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(resultado);
    }
  });
}

// Borrar camisetas
function borrar(req, res) {
  let id_imagen_a_eliminar = req.params.id;
  imagenesDb.borrar(id_imagen_a_eliminar, (err, result_model) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (result_model.detail.affectedRows == 0) {
        res.status(404).send(result_model.message);
      } else {
        res.send(result_model.message);
      }
    }
  });
}

// Obtener camisetas por id
function getById(req, res) {
  let id = req.params.id;
  imagenesDb.getById(id, (err, result_model) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result_model);
    }
  });
}

// Exportar la instancia de express
module.exports = app;
