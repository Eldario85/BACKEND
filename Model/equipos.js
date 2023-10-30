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

const equiposDb = {};

//crear equipos
equiposDb.create = function (equipo, funCallback) {
  consulta =
    "INSERT INTO equipos (nombre_del_equipo, pais, liga, año_de_fundacion) VALUES (?,?,?,?);";
  params = [
    equipo.nombre_del_equipo,
    equipo.pais,
    equipo.liga,
    equipo.año_fundacion,
  ];

  connection.query(consulta, params, (err, rows) => {
    if (err) {
      if (err.code == "ER_DUP_ENTRY") {
        funCallback({
          message: "El equipo ya fue registrado anteriormente",
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
        message: `se creo el equipo  ${equipo.nombre_del_equipo}`,
        detail: rows,
      });
    }
  });
};

//R = READ
equiposDb.getAll = function (funCallback) {
  const consulta = "select * from equipos ";
  connection.query(consulta, function (err, rows) {
    if (err) {
      funCallback({
        message: "ha ocurrido un error inesperado al buscar el equipo",
        detail: err,
      });
    } else {
      funCallback(undefined, rows);
    }
  });
};

// U = UPDATE
equiposDb.update = function (equipo, id, funCallback) {
  const consulta =
    "UPDATE equipos SET nombre_del_equipo =?, pais= ?, liga=?, año_de_fundacion =? WHERE equipo_id = ?";
  const params = [
    equipo.nombre_del_equipo,
    equipo.pais,
    equipo.liga,
    equipo.año_fundacion,
    id,
  ];

  connection.query(consulta, params, (err, result) => {
    if (err) {
      if (err.code == "ER_DUP_ENTRY") {
        funCallback({
          message: "Los datos a insertar generan un equipo duplicado",
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
        message: "No existe equipo que coincida con el criterio de busqueda",
        detail: result,
      });
    } else {
      funCallback(undefined, {
        message: `se modificó el equipo  ${equipo.nombre_del_equipo} `,
        detail: result,
      });
    }
  });
};

// D = DELETE
equiposDb.borrar = function (id, funCallback) {
  const consulta = "DELETE FROM equipos WHERE equipo_id = ?";
  connection.query(consulta, id, (err, result) => {
    if (err) {
      funCallback({ message: err.code, detail: err });
    } else {
      if (result.affectedRows == 0) {
        funCallback(undefined, {
          message: "no se encontro equipo con el id ingresado",
          detail: result,
        });
      } else {
        funCallback(undefined, {
          message: "equipo eliminado",
          detail: result,
        });
      }
    }
  });
};

equiposDb.getById = function (id, funCallback) {
  connection.query(
    "select * from equipos  WHERE equipo_id = ?",
    id,
    (err, result) => {
      if (err) {
        funCallback({
          message: "a ocurrido algun error inesperado al buscar el equipo",
          detail: err,
        });
      } else if (result.length == 0) {
        funCallback(undefined, {
          message: `no se encontro un equipo con el id: ${id}`,
          detail: result,
        });
      } else {
        funCallback(undefined, {
          message: `los datos del equipo con el id ${id} son:`,
          detail: result[0],
        });
      }
    }
  );
};

module.exports = equiposDb;
