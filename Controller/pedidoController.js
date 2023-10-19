require("rootpath")();
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var pedidoDb = require("../Model/pedido");

// --------------------------------------------------------
// --rutas de escucha (endpoint) dispoibles para PERSONAS--
// --------------------------------------------------------
app.get("/", BuscarTodos);
app.post("/", crear);
app.put("/:id", actualizar);
app.delete("/:id", borrar);
app.get("/:id", getById);

// --------------------------------------------------------
// ---------FUNCIONES UTILIZADAS EN ENDPOINTS -------------
// --------------------------------------------------------

//Listar todos los pedidos
function BuscarTodos(req, res) {
  pedidoDb.getAll(function (err, resultado) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(resultado);
    }
  });
}

// --------------------------------------------------------
// Crear pedido
function crear(req, res) {
  let pedido = req.body;
  pedidoDb.create(pedido, (err, resultado) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(resultado);
    }
  });
}

// --------------------------------------------------------
//Actualizar pedido
function actualizar(req, res) {
  let pedido = req.body;
  let id = req.params.id;
  pedidoDb.update(pedido, id, (err, resultado) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(resultado);
    }
  });
}

// --------------------------------------------------------
//Borrar pedido
function borrar(req, res) {
  let id_pedido_a_eliminar = req.params.id;
  pedidoDb.borrar(id_pedido_a_eliminar, (err, result_model) => {
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
  pedidoDb.getById(id, (err, result_model) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result_model);
    }
  });
}

module.exports = app;
