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

const camisetasDb = {};

//crear camisetas
camisetasDb.create = function (camisetas, funCallback) {
  consulta =
    "INSERT INTO camisetas (nombre_del_producto, descripcion, imagen, precio, stock, equipo_id, talla_id) VALUES (?,?,?,?,?,?,?);";
  params = [
    camisetas.nombre_del_producto,
    camisetas.descripcion,
    camisetas.imagen,
    camisetas.precio,
    camisetas.stock,
    camisetas.equipo_id,
    camisetas.talla_id,
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
        message: `se creo la camiseta  ${camisetas.nombre_del_producto}`,
        detail: rows,
      });
    }
  });
};

//R = READ
camisetasDb.getAll = function (funCallback) {
  const consulta = "select * from camisetas ";
  connection.query(consulta, function (err, rows) {
    if (err) {
      funCallback({
        message: "ha ocurrido un error inesperado al buscar la camiseta",
        detail: err,
      });
    } else {
      funCallback(undefined, rows);
    }
  });
};

// U = UPDATE
camisetasDb.update = function (camisetas, id, funCallback) {
  const consulta =
    "UPDATE camisetas SET nombre_del_producto =?, descripcion= ?, imagen=?,precio =?, stock=?, equipo_id=?, talla_id=? WHERE camiseta_id = ?";
  const params = [
    camisetas.nombre_del_producto,
    camisetas.descripcion,
    camisetas.imagen,
    camisetas.precio,
    camisetas.stock,
    camisetas.equipo_id,
    camisetas.talla_id,
    id,
  ];

  connection.query(consulta, params, (err, result) => {
    if (err) {
      if (err.code == "ER_DUP_ENTRY") {
        funCallback({
          message: "Los datos a insertar generan una camiseta duplicada",
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
        message: "No existe camiseta que coincida con el criterio de busqueda",
        detail: result,
      });
    } else {
      funCallback(undefined, {
        message: `se modificó la camiseta  ${camisetas.nombre_del_producto} ${camisetas.descripcion}`,
        detail: result,
      });
    }
  });
};

// D = DELETE
camisetasDb.borrar = function (id, funCallback) {
  const consulta = "DELETE FROM camisetas WHERE camiseta_id = ?";
  connection.query(consulta, id, (err, result) => {
    if (err) {
      funCallback({ message: err.code, detail: err });
    } else {
      if (result.affectedRows == 0) {
        funCallback(undefined, {
          message: "no se encontro camiseta con el id ingresado",
          detail: result,
        });
      } else {
        funCallback(undefined, {
          message: "camiseta eliminada",
          detail: result,
        });
      }
    }
  });
};

camisetasDb.getById = function (id, funCallback) {
  connection.query(
    "select * from camisetas  WHERE camisetas.camiseta_id = ?",
    id,
    (err, result) => {
      if (err) {
        funCallback({
          message: "a ocurrido algun error inesperado al buscar la camiseta",
          detail: err,
        });
      } else if (result.length == 0) {
        funCallback(undefined, {
          message: `no se encontro una camiseta con el id: ${id}`,
          detail: result,
        });
      } else {
        funCallback(undefined, {
          message: `los datos del camisetas con el id ${id} son:`,
          detail: result[0],
        });
      }
    }
  );
};

module.exports = camisetasDb;
