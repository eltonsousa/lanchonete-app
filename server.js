const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001; // Usaremos a porta 3001 para o back-end

app.use(cors()); // Permite que seu front-end acesse este servidor
app.use(express.json()); // Permite que o servidor entenda JSON

let pedidos = []; // Uma lista simples para armazenar os pedidos na memória

// Rota para receber um novo pedido da lanchonete
app.post("/api/pedidos", (req, res) => {
  const novoPedido = req.body;
  pedidos.push(novoPedido);
  console.log("Novo pedido recebido:", novoPedido);
  res
    .status(201)
    .send({ message: "Pedido recebido com sucesso!", pedido: novoPedido });
});

// Rota para o painel de administração ver todos os pedidos
app.get("/api/pedidos", (req, res) => {
  res.status(200).json(pedidos);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
