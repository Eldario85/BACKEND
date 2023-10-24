require("rootpath")();
const express = require("express");
const app = express();
const usuarioDb = require("../Model/usuario");
const securityController = require("./securityController");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", getAll);
app.post("/", createUser);
app.put("/:id", updateUser);
app.delete("/:id", deleteUser);
app.get("/:id", getById);

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
  const usuario = req.body;
  const id = req.params.id;
  usuarioDb.update(usuario, id, (err, resultado) => {
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

function getById(req, res) {
  let id = req.params.id;
  usuarioDb.getById(id, (err, result_model) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result_model);
    }
  });
}

module.exports = app;
