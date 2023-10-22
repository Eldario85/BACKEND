require("rootpath")();
const express = require("express");
const app = express();
const usuarioDb = require("../Model/usuario");
const securityController = require("./securityController");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", getAll);
app.post("/", createUser);
app.put("/:id_usuario", updateUser);
app.delete("/:id_usuario", deleteUser);

function getAll(req, res) {
  usuarioDb.getAll((err, resultado) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(resultado);
    }
  });
}

function createUser(req, res) {
  const usuario = req.body;
  usuarioDb.create(usuario, (err, resultado) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(resultado);
    }
  });
}

function updateUser(req, res) {
  const datos_usuario = req.body;
  const id_usuario = req.params.user_id;
  usuarioDb.update(datos_usuario, id_usuario, (err, resultado) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(resultado);
    }
  });
}

function deleteUser(req, res) {
  usuarioDb.borrar(req.params.user_id, (err, result_model) => {
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

module.exports = app;
