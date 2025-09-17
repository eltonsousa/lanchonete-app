const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Lista de pedidos e usuários
let pedidos = [];
let usuarios = [];

// NOVO: Lista de cardápio na memória, baseada nos seus itens
let cardapio = [
  {
    id: 1,
    nome: "Hambúrguer Clássico",
    descricao: "Pão de brioche, 150g de carne...",
    preco: 29.9,
    imagem: "/assets/hamburguer.jpg",
  },
  {
    id: 2,
    nome: "Hot Dog Especial",
    descricao: "Salsicha artesanal, purê de batata...",
    preco: 19.5,
    imagem: "/assets/hotdog.webp",
  },
  {
    id: 3,
    nome: "Porção de Batata Frita",
    descricao: "Batatas crocantes com um toque de sal...",
    preco: 15.0,
    imagem: "/assets/batata-frita.webp",
  },
  {
    id: 4,
    nome: "Milk-shake de Chocolate",
    descricao: "Milk-shake cremoso com sorvete...",
    preco: 18.0,
    imagem: "/assets/milkshake.png",
  },
];

// NOVAS ROTAS PARA GERENCIAMENTO DO CARDÁPIO
app.get("/api/cardapio", (req, res) => {
  res.status(200).json(cardapio);
});

app.post("/api/cardapio", (req, res) => {
  const novoItem = req.body;
  if (!novoItem.nome || !novoItem.preco) {
    return res.status(400).send({ message: "Nome e preço são obrigatórios." });
  }
  novoItem.id = Date.now();
  cardapio.push(novoItem);
  res
    .status(201)
    .send({
      message: "Item adicionado ao cardápio com sucesso!",
      item: novoItem,
    });
});

app.put("/api/cardapio/:id", (req, res) => {
  const { id } = req.params;
  const { nome, preco, descricao, imagem } = req.body;
  const item = cardapio.find((i) => i.id === parseInt(id));

  if (item) {
    item.nome = nome || item.nome;
    item.preco = preco || item.preco;
    item.descricao = descricao || item.descricao;
    item.imagem = imagem || item.imagem;
    res
      .status(200)
      .send({ message: "Item do cardápio atualizado com sucesso!", item });
  } else {
    res.status(404).send({ message: "Item não encontrado." });
  }
});

app.delete("/api/cardapio/:id", (req, res) => {
  const { id } = req.params;
  const itemIndex = cardapio.findIndex((i) => i.id === parseInt(id));

  if (itemIndex !== -1) {
    cardapio.splice(itemIndex, 1);
    res.status(200).send({ message: "Item removido do cardápio com sucesso." });
  } else {
    res.status(404).send({ message: "Item não encontrado." });
  }
});

// ROTAS DE USUÁRIO E PEDIDO EXISTENTES
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
