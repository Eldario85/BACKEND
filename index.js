require("rootpath")();
const express = require("express");
const morgan = require("morgan");
const app = express();
var cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
morgan(":method :url :status :res[content-length] - :response-time ms");

const configuraciones = require("./config.json");

const controladorUsuario = require("./Controller/usuarioController");
const controladorPedido = require("./Controller/pedidoController");
const controladorCamisetas = require("./Controller/camisetasController");

const securityController = require("./Controller/securityController");
app.use("/security", securityController.app);

app.use("/usuario", controladorUsuario);
app.use("/pedido", controladorPedido);
app.use("/camisetas", controladorCamisetas);

app.listen(configuraciones.server.port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(
      "servidor escuchando en el puerto " + configuraciones.server.port
    );
  }
});
