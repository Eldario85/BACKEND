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

var imagenesDb = {};

//crear imagenes
imagenesDb.create = function (imagenes, funCallback) {
  consulta =
    "INSERT INTO imagenes (nombre, descripcion, precio, stock_disponible, imagen, talla) VALUES (?,?,?,?,?,?);";
  params = [
    imagenes.nombre,
    imagenes.descripcion,
    imagenes.precio,
    imagenes.stock_disponible,
    imagenes.imagen,
    imagenes.talla,
  ];

  connection.query(consulta, params, (err, rows) => {
    if (err) {
      if (err.code == "ER_DUP_ENTRY") {
        funCallback({
          message: "El imagenes ya fue registrado anteriormente",
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
        message: `se creo el imagenes  ${imagenes.nombre}`,
        detail: rows,
      });
    }
  });
};

//R = READ
imagenesDb.getAll = function (funCallback) {
  var consulta = "SELECT * FROM imagenes";
  connection.query(consulta, function (err, rows) {
    if (err) {
      funCallback({
        message: "ha ocurrido un error inesperado al buscar el imagenes",
        detail: err,
      });
    } else {
      funCallback(undefined, rows);
    }
  });
};

// U = UPDATE
// personaController --> app.put('/', actualizar);
imagenesDb.update = function (imagenes, id, funCallback) {
  const consulta =
    "UPDATE imagenes SET nombre =?, descripcion= ?, precio =?, stock_disponible=?, imagen=?, talla=? WHERE id = ?";
  const params = [
    imagenes.nombre,
    imagenes.descripcion,
    imagenes.precio,
    imagenes.stock_disponible,
    imagenes.imagen,
    imagenes.talla,
    id,
  ];

  connection.query(consulta, params, (err, result) => {
    if (err) {
      if (err.code == "ER_DUP_ENTRY") {
        //dni duplicado
        funCallback({
          message: "Los datos a insertar generan un imagenes duplicado",
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
      //persona a actualizar no encontrada
      funCallback({
        message: "No existe imagenes que coincida con el criterio de busqueda",
        detail: result,
      });
    } else {
      funCallback(undefined, {
        message: `se modificó el imagenes  ${imagenes.nombre} ${imagenes.descripcion}`,
        detail: result,
      });
    }
  });
};

// D = DELETE
// personaController --> app.post('/', borrar);
imagenesDb.borrar = function (id, funCallback) {
  const consulta = "DELETE FROM imagenes WHERE id = ?";
  connection.query(consulta, id, (err, result) => {
    if (err) {
      funCallback({ menssage: err.code, detail: err });
    } else {
      if (result.affectedRows == 0) {
        funCallback(undefined, {
          message: "no se encontro imagenes con el id ingresado",
          detail: result,
        });
      } else {
        funCallback(undefined, {
          message: "imagenes eliminado",
          detail: result,
        });
      }
    }
  });
};

imagenesDb.getById = function (id, funCallback) {
  connection.query("SELECT * FROM imagenes WHERE id = ?", id, (err, result) => {
    if (err) {
      funCallback({
        menssage: "a ocurrido algun error inesperado al buscar el imagenes",
        detail: err,
      });
    } else if (result.length == 0) {
      //consulta no impacta en nada dentro de la BD
      funCallback(undefined, {
        menssage: `no se encontro un imagenes con el id: ${id}`,
        detail: result,
      });
    } else {
      funCallback(undefined, {
        menssage: `los datos del imagenes con el id ${id} son:`,
        detail: result[0],
      });
    }
  });
};

module.exports = imagenesDb;
