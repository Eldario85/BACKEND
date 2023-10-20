require("rootpath")();
const mysql = require("mysql");
const configuracion = require("config.json");
const bcrypt = require("bcrypt");

var connection = mysql.createConnection(configuracion.database);
connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("base de datos conectada");
  }
});

var usuarioDb = {};

/*
usuario_db : es un objeto que sera invocado desde los endpoint del controlador. Aquí en el MODEL, dicho objeto posee las funcionalidades que permiten la interaccion con la base de datos como getAll, update, etc. Entonces desde usuarioController puedo invocar a usuario_db.update(); o usuario_db.borrar();

funCallback: en una funcion que la enviamos desde el endpoint del controlador, es mediante esta funcion que le damos una respuesta desde el MODEL hacia el CONTROLLER, aquí lo que enviamos como error o detalles con mensajes, es lo que recibira usuarioController para seguir su proceso de respuesta hacia el forontend
*/

// -----------------------------------------------------------------------------

// C = CREATE
// usuarioController --> app.post('/', createUser);
usuarioDb.create = function (usuario, funcallback) {
  // Verifica que los campos requeridos no estén vacíos
  if (
    !usuario.email ||
    !usuario.nickname ||
    !usuario.password ||
    !usuario.email ||
    !usuario.nombre ||
    !usuario.apellido ||
    !usuario.direccion ||
    !usuario.telefono
  ) {
    return funcallback({
      message: "Todos los campos son obligatorios.",
    });
  }

  // Hashea la contraseña
  let claveCifrada = bcrypt.hashSync(usuario.password, 10);

  // Realiza la inserción en la base de datos
  consulta =
    "INSERT INTO usuarios (nickname, password, email, nombre, apellido, direccion, telefono) VALUES (?,?,?,?,?,?,?);";
  params = [
    usuario.nickname,
    claveCifrada,
    usuario.email,
    usuario.nombre,
    usuario.apellido,
    usuario.direccion,
    usuario.telefono,
  ];
  connection.query(consulta, params, (err, detail_bd) => {
    if (err) {
      if (err.code == "ER_DUP_ENTRY") {
        funcallback({
          message: "El usuario ya fue registrado",
          detalle: err,
        });
      } else {
        funcallback({
          message: "Error diferente",
          detalle: err,
        });
      }
    } else {
      funcallback(undefined, {
        message: "Se creó el usuario " + usuario.nickname,
        detalle: detail_bd,
      });
    }
  });
};

// -----------------------------------------------------------------------------

//R = READ
// usuarioController --> app.get('/', getAll);
usuarioDb.getAll = function (funCallback) {
  var consulta = "SELECT * FROM usuarios";
  connection.query(consulta, function (err, rows) {
    if (err) {
      funCallback(err);
      return;
    } else {
      funCallback(undefined, rows);
    }
  });
};

// -----------------------------------------------------------------------------

//U = UPDATE
// usuarioController --> app.put('/:id_usuario', updateUser);
usuarioDb.update = function (usuario, id_usaurio, funcallback) {
  let claveCifrada = bcrypt.hashSync(datos_usuario.clave, 10);

  const params = [
    usuario.nickname,
    claveCifrada,
    usuario.email,
    usuario.nombre,
    usuario.apellido,
    usuario.direccion,
    usuario.telefono,
    id_usaurio,
  ];
  const consulta =
    "UPDATE usuarios set nickname = ?, password = ?, email = ?, nombre=?, apellido=?,direccion=?,telefono=?, WHERE user_id = ?;";

  connection.query(consulta, params, (err, result) => {
    if (err) {
      if ((err.code = "ER_TRUNCATED_WRONG_VALUE")) {
        funcallback({
          message: `el id de usuario es incorrecto, se espera un numero entero`,
          detail: err,
        });
      } else {
        funcallback({
          message: `error desconocido`,
          detail: err,
        });
      }
    } else {
      if (result.affectedRows == 0) {
        funcallback({
          message:
            "No existe un usuario que coincida con el criterio de busqueda",
          detail: result,
        });
      } else {
        funcallback(undefined, {
          message: `se actualizaron los datos del usuario ${id_usaurio}`,
          detail: result,
        });
      }
    }
  });
};

// -----------------------------------------------------------------------------

// D = DELETE
// usuarioController --> app.delete('/:id_usuario', deleteUser);
usuarioDb.borrar = function (id, funCallback) {
  consulta = "DELETE FROM USUARIOs WHERE id = ?";
  connection.query(consulta, id, (err, result) => {
    if (err) {
      funCallback({ menssage: err.code, detail: err }, undefined);
    } else {
      if (result.affectedRows == 0) {
        funCallback(undefined, {
          message: "no se encontro el usaurio, ingrese otro id",
          detail: result,
        });
      } else {
        funCallback(undefined, {
          message: "usuario eliminado",
          detail: result,
        });
      }
    }
  });
};

// -----------------------------------------------------------------------------

//securityController --> app.post('/login', login);
usuarioDb.findByNickname = function (nickname, funCallback) {
  var consulta = "SELECT * FROM usuarios WHERE nickname = ?";
  connection.query(consulta, nickname, function (err, result) {
    if (err) {
      funCallback(err);
      return;
    } else {
      if (result.length > 0) {
        funCallback(undefined, {
          message: `Usuario encontrado`,
          detail: result[0],
        });
      } else {
        funCallback({
          message:
            "No existe un usuario que coincida con el criterio de busqueda",
          detail: result,
        });
      }
    }
  });
};

module.exports = usuarioDb;
