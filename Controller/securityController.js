require("rootpath")();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usuarioDb = require("../Model/usuario");

app.post("/login", login);

function login(req, res) {
  const { nickname, password } = req.body;

  usuarioDb.findByNickname(nickname, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const iguales = bcrypt.compareSync(password, result.detail.password);
      if (iguales) {
        const user = {
          nickname: result.detail.nickname,
          email: result.detail.email,
          rol_id: result.detail.rol_id,
        };
        jwt.sign(
          user,
          "siliconSectret",
          { expiresIn: "600s" },
          (err, token) => {
            if (err) {
              res.status(500).send({ message: err });
            } else {
              res.json({ datos: user, token: token });
            }
          }
        );
      } else {
        res.status(403).send({ message: "Contraseña Incorrecta" });
      }
    }
  });
}

function verificarToken(req, res, next) {
  if (req.headers["authorization"]) {
    try {
      const token = req.headers["authorization"];
      const verified = jwt.verify(token, "siliconSectret");
      if (verified) {
        next();
      } else {
        res.status(403).send({ message: "Token invalido, permiso denegado" });
      }
    } catch (error) {
      res.status(403).send({ message: "Acceso Denegado" });
    }
  } else {
    res.status(403).send({ message: "No posee token de autorizacion" });
  }
}

module.exports = { app, verificarToken };
