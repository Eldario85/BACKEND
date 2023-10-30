require("rootpath")();

const mysql = require("mysql");
const configuracion = require("../config.json");

//inicializa la conexion entre el servidor y la base de datos
var connection = mysql.createConnection(configuracion.database);
connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("base de datos conectada");
  }
});

var pedidoDb = {};

//crear pedido
pedidoDb.create = function (pedido, funCallback) {
  consulta =
    "INSERT INTO pedidos (cantidad, talla, precio_unitario, fecha_del_pedido) VALUES (?,?,?,CURRENT_TIMESTAMP);";
  params = [
    pedido.cantidad,
    pedido.talla,
    pedido.precio_unitario,
    pedido.fecha_del_pedido,
  ];

  connection.query(consulta, params, (err, rows) => {
    if (err) {
      if (err.code == "ER_DUP_ENTRY") {
        funCallback({
          message: "El pedido ya fue registrado anteriormente",
          detail: err,
        });
      } else {
        funCallback({
          message: "error diferente",
          detail: err,
        });
      }
    } else {
      funCallback(undefined, {
        message: `se creo el pedido  ${pedido.id}`,
        detail: rows,
      });
    }
  });
};

//R = READ
pedidoDb.getAll = function (funCallback) {
  var consulta = "SELECT * FROM pedidos";
  connection.query(consulta, function (err, rows) {
    if (err) {
      funCallback({
        message: "ha ocurrido un error inesperado al buscar el pedido",
        detail: err,
      });
    } else {
      funCallback(undefined, rows);
    }
  });
};

// U = UPDATE
// personaController --> app.put('/', actualizar);
pedidoDb.update = function (pedido, id, funCallback) {
  const consulta =
    "UPDATE pedidos SET cantidad =?, talla= ?, fecha_del_pedido =? WHERE id = ?";
  const params = [pedido.cantidad, pedido.talla, pedido.fecha_del_pedido, id];

  connection.query(consulta, params, (err, result) => {
    if (err) {
      if (err.code == "ER_DUP_ENTRY") {
        funCallback({
          message: "Los datos a insertar generan un pedido duplicado",
          detail: err,
        });
      } else {
        //algun otro codigo de error
        funCallback({
          message: "error diferente, analizar codigo error",
          detail: err,
        });
      }
    } else if (result.affectedRows == 0) {
      funCallback({
        message: "No existe pedido que coincida con el criterio de busqueda",
        detail: result,
      });
    } else {
      funCallback(undefined, {
        message: `se modificó el pedido  ${pedido.id}`,
        detail: result,
      });
    }
  });
};

// D = DELETE

pedidoDb.borrar = function (id, funCallback) {
  const consulta = "DELETE FROM pedidos WHERE id = ?";
  connection.query(consulta, id, (err, result) => {
    if (err) {
      funCallback({ menssage: err.code, detail: err });
    } else {
      if (result.affectedRows == 0) {
        funCallback(undefined, {
          message: "no se encontro pedido con el id ingresado",
          detail: result,
        });
      } else {
        funCallback(undefined, {
          message: "pedido eliminado",
          detail: result,
        });
      }
    }
  });
};

pedidoDb.getById = function (id, funCallback) {
  connection.query("SELECT * FROM pedidos WHERE id = ?", id, (err, result) => {
    if (err) {
      funCallback({
        menssage: "a ocurrido algun error inesperado al buscar el pedido",
        detail: err,
      });
    } else if (result.length == 0) {
      //consulta no impacta en nada dentro de la BD
      funCallback(undefined, {
        menssage: `no se encontro un pedido con el id: ${id}`,
        detail: result,
      });
    } else {
      funCallback(undefined, {
        menssage: `los datos del pedido con el id ${id} son:`,
        detail: result,
      });
    }
  });
};

module.exports = pedidoDb;
