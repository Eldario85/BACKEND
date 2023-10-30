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

// Importar el módulo equipos del modelo
const equiposDb = require("../Model/equipos");

// Importar el módulo securityController
const securityController = require("./securityController");

// Definir las rutas de escucha (endpoint) disponibles para PERSONAS
app.get("/", securityController.verificarToken, buscarTodos);
app.post("/", crear);
app.put("/:id", securityController.verificarToken, actualizar);
app.delete("/:id", securityController.verificarToken, borrar);
app.get("/:id", securityController.verificarToken, getById);

// Definir las funciones utilizadas en los endpoints

// Listar todos los equiposs
function buscarTodos(req, res) {
  equiposDb.getAll(function (err, resultado) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(resultado);
    }
  });
}

// Crear equipos
function crear(req, res) {
  let equipo = req.body;
  equiposDb.create(equipo, (err, resultado) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(resultado);
    }
  });
}

// Actualizar equipos
function actualizar(req, res) {
  let equipo = req.body;
  let id = req.params.id;
  equiposDb.update(equipo, id, (err, resultado) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(resultado);
    }
  });
}

// Borrar equipos
function borrar(req, res) {
  let id_equipo_a_eliminar = req.params.id;
  equiposDb.borrar(id_equipo_a_eliminar, (err, result_model) => {
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

// Obtener equipos por id
function getById(req, res) {
  let id = req.params.id;
  equiposDb.getById(id, (err, result_model) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result_model);
    }
  });
}

// Exportar la instancia de express
module.exports = app;
