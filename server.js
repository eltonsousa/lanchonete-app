const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let pedidos = [];
let usuarios = [];

// ROTA PARA REGISTRAR UM NOVO USUÁRIO
app.post("/api/usuarios/registrar", async (req, res) => {
  const { nome, senha } = req.body;
  if (!nome || !senha) {
    return res.status(400).send({ message: "Nome e senha são obrigatórios." });
  }
  const usuarioExistente = usuarios.find((u) => u.nome === nome);
  if (usuarioExistente) {
    return res.status(409).send({ message: "Nome de usuário já existe." });
  }
  try {
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);
    const novoUsuario = { nome, senhaHash };
    usuarios.push(novoUsuario);
    console.log("Novo usuário registrado:", novoUsuario);
    res.status(201).send({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    res.status(500).send({ message: "Erro ao registrar usuário." });
  }
});

// NOVA ROTA: LOGIN DO USUÁRIO
app.post("/api/usuarios/login", async (req, res) => {
  const { nome, senha } = req.body;
  if (!nome || !senha) {
    return res.status(400).send({ message: "Nome e senha são obrigatórios." });
  }
  const usuario = usuarios.find((u) => u.nome === nome);
  if (!usuario) {
    return res.status(401).send({ message: "Credenciais inválidas." });
  }
  try {
    const match = await bcrypt.compare(senha, usuario.senhaHash);
    if (match) {
      console.log(`Usuário ${nome} logado com sucesso.`);
      return res.status(200).send({ message: "Login bem-sucedido!" });
    } else {
      return res.status(401).send({ message: "Credenciais inválidas." });
    }
  } catch (error) {
    res.status(500).send({ message: "Erro ao fazer login." });
  }
});

// ROTAS DE PEDIDO EXISTENTES (sem alterações)
app.post("/api/pedidos", (req, res) => {
  const novoPedido = req.body;
  novoPedido.status = "Em preparação";
  novoPedido.id = Date.now();
  pedidos.push(novoPedido);
  console.log("Novo pedido recebido:", novoPedido);
  res
    .status(201)
    .send({ message: "Pedido recebido com sucesso!", pedido: novoPedido });
});

app.get("/api/pedidos", (req, res) => {
  res.status(200).json(pedidos);
});

app.put("/api/pedidos/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const pedido = pedidos.find((p) => p.id === parseInt(id));

  if (pedido) {
    pedido.status = status;
    console.log(`Status do pedido ${id} atualizado para: ${status}`);
    res
      .status(200)
      .send({ message: "Status do pedido atualizado com sucesso!", pedido });
  } else {
    res.status(404).send({ message: "Pedido não encontrado." });
  }
});

app.delete("/api/pedidos/:id", (req, res) => {
  const { id } = req.params;
  const pedidoIndex = pedidos.findIndex((p) => p.id === parseInt(id));

  if (pedidoIndex !== -1) {
    pedidos.splice(pedidoIndex, 1);
    console.log(`Pedido ${id} removido.`);
    res.status(200).send({ message: "Pedido removido com sucesso." });
  } else {
    res.status(404).send({ message: "Pedido não encontrado." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
