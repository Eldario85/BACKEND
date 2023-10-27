require("rootpath")();

const mysql = require("mysql");
const configuracion = require("../config.json");

//inicializa la conexion entre el servidor y la base de datos
const connection = mysql.createConnection(configuracion.database);

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("base de datos conectada");
  }
});

const carritoDb = {};

//crear camisetas
carritoDb.create = function (carritoProductos, funCallback) {
  consulta =
    "INSERT INTO carrito (user_id, camiseta_id, cantidad) VALUES (?,?,?);";
  params = [
    carritoProductos.user_id,
    carritoProductos.camiseta_id,
    carritoProductos.cantidad,
  ];

  connection.query(consulta, params, (err, rows) => {
    if (err) {
      if (err.code == "ER_DUP_ENTRY") {
        funCallback({
          message: "La camiseta ya fue registrada anteriormente",
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
        message: `se agrego el producto`,
        detail: rows,
      });
    }
  });
};

//R = READ
carritoDb.getAll = function (funCallback) {
  const consulta = "select * from carrito ";
  connection.query(consulta, function (err, rows) {
    if (err) {
      funCallback({
        message: "ha ocurrido un error inesperado al buscar",
        detail: err,
      });
    } else {
      funCallback(undefined, rows);
    }
  });
};

// U = UPDATE
carritoDb.update = function (carritoProductos, id, funCallback) {
  const consulta =
    "UPDATE carrito SET camiseta_id =?, cantidad= ? WHERE carrito_item_id = ?";
  const params = [carritoProductos.camiseta_id, carritoProductos.cantidad, id];

  connection.query(consulta, params, (err, result) => {
    if (err) {
      if (err.code == "ER_DUP_ENTRY") {
        funCallback({
          message: "Los datos a insertar generan un carrito duplicado",
          detail: err,
        });
      } else {
        funCallback({
          message: "error diferente, analizar codigo error",
          detail: err,
        });
      }
    } else if (result.affectedRows == 0) {
      funCallback({
        message:
          "No existe productos del carrito que coincidan con el criterio de busqueda",
        detail: result,
      });
    } else {
      funCallback(undefined, {
        message: `se modificó el carrito`,
        detail: result,
      });
    }
  });
};

// D = DELETE
carritoDb.borrar = function (id, funCallback) {
  const consulta = "DELETE FROM carrito WHERE carrito_item_id = ?";
  connection.query(consulta, id, (err, result) => {
    if (err) {
      funCallback({ message: err.code, detail: err });
    } else {
      if (result.affectedRows == 0) {
        funCallback(undefined, {
          message: "no se encontro carrito con el id ingresado",
          detail: result,
        });
      } else {
        funCallback(undefined, {
          message: "carrito eliminado",
          detail: result,
        });
      }
    }
  });
};

carritoDb.getById = function (id, funCallback) {
  connection.query(
    "select * from carrito  WHERE carrito_item_id = ?",
    id,
    (err, result) => {
      if (err) {
        funCallback({
          message: "a ocurrido algun error inesperado",
          detail: err,
        });
      } else if (result.length == 0) {
        funCallback(undefined, {
          message: `no se encontro un carrito con el id: ${id}`,
          detail: result,
        });
      } else {
        funCallback(undefined, {
          message: `los datos del carrito con el id ${id} son:`,
          detail: result[0],
        });
      }
    }
  );
};

module.exports = carritoDb;
