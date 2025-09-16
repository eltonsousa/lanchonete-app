import React, { useState } from "react";
import CardapioItem from "./CardapioItem";
import "./App.css";

// Importe as imagens aqui
import hamburguerImagem from "./assets/hamburguer.jpg";
import hotdogImagem from "./assets/hotdog.webp";
import batataImagem from "./assets/batata-frita.webp";
import milkshakeImagem from "./assets/milkshake.png";

function App() {
  const [carrinho, setCarrinho] = useState([]);
  const [mostraCheckout, setMostraCheckout] = useState(false);
  const [pedidoFinalizado, setPedidoFinalizado] = useState(false); // Novo estado
  const [ultimoPedido, setUltimoPedido] = useState(null); // Novo estado

  const lanches = [
    {
      id: 1,
      nome: "Hambúrguer Clássico",
      descricao: "Pão de brioche, 150g de carne...",
      preco: 29.9,
      imagem: hamburguerImagem,
    },
    {
      id: 2,
      nome: "Hot Dog Especial",
      descricao: "Salsicha artesanal, purê de batata...",
      preco: 19.5,
      imagem: hotdogImagem,
    },
    {
      id: 3,
      nome: "Porção de Batata Frita",
      descricao: "Batatas crocantes com um toque de sal...",
      preco: 15.0,
      imagem: batataImagem,
    },
    {
      id: 4,
      nome: "Milk-shake de Chocolate",
      descricao: "Milk-shake cremoso com sorvete...",
      preco: 18.0,
      imagem: milkshakeImagem,
    },
  ];

  const adicionarAoCarrinho = (item) => {
    const itemExistente = carrinho.find((c) => c.id === item.id);
    if (itemExistente) {
      setCarrinho(
        carrinho.map((c) =>
          c.id === item.id ? { ...c, quantidade: c.quantidade + 1 } : c
        )
      );
    } else {
      setCarrinho([...carrinho, { ...item, quantidade: 1 }]);
    }
  };

  const aumentarQuantidade = (itemId) => {
    setCarrinho(
      carrinho.map((item) =>
        item.id === itemId ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    );
  };

  const diminuirQuantidade = (itemId) => {
    setCarrinho(
      carrinho
        .map((item) =>
          item.id === itemId
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

  const removerDoCarrinho = (itemId) => {
    const novoCarrinho = carrinho.filter((item) => item.id !== itemId);
    setCarrinho(novoCarrinho);
  };

  const calcularTotal = () => {
    return carrinho
      .reduce((total, item) => total + item.preco * item.quantidade, 0)
      .toFixed(2);
  };

  const handleFinalizarPedido = () => {
    setMostraCheckout(true);
  };

  const handleCheckoutSubmit = async (event) => {
    event.preventDefault();

    // Capturando os dados do formulário
    const formData = new FormData(event.target);
    const cliente = {
      nome: formData.get("nome"),
      endereco: formData.get("endereco"),
      pagamento: formData.get("pagamento"),
    };

    const dadosDoPedido = {
      cliente, // Adicionando o objeto cliente
      itens: carrinho,
      total: calcularTotal(),
      // Você pode adicionar um timestamp para a hora do pedido
      data: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:3001/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosDoPedido),
      });

      if (response.ok) {
        alert("Pedido enviado com sucesso para a lanchonete!");
        setUltimoPedido({
          itens: carrinho,
          total: calcularTotal(),
        });
        setCarrinho([]);
        setMostraCheckout(false);
        setPedidoFinalizado(true);
      } else {
        alert("Erro ao enviar o pedido. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      alert("Erro ao se conectar com o servidor.");
    }
  };

  const handleNovoPedido = () => {
    setPedidoFinalizado(false); // Volta para a tela inicial
  };

  return (
    <div className="App">
      <header>
        <h1>Lanchonete do Zé</h1>
        <p>Sua fome acaba aqui. Conheça nossos clássicos!</p>
      </header>

      {/* Condição para mostrar o cardápio e o carrinho */}
      {!mostraCheckout && !pedidoFinalizado && (
        <>
          <main className="cardapio">
            {lanches.map((lanche) => (
              <CardapioItem
                key={lanche.id}
                item={lanche}
                onAdicionar={adicionarAoCarrinho}
              />
            ))}
          </main>

          {carrinho.length > 0 && (
            <aside className="carrinho-container">
              <h2>Seu Carrinho</h2>
              <div className="carrinho-itens">
                {carrinho.map((item) => (
                  <div key={item.id} className="carrinho-item">
                    <div className="item-info">
                      <p>{item.nome}</p>
                      <p>R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                    </div>
                    <div className="carrinho-botoes">
                      <div className="quantidade-botoes">
                        <button onClick={() => diminuirQuantidade(item.id)}>
                          -
                        </button>
                        <span>{item.quantidade}</span>
                        <button onClick={() => aumentarQuantidade(item.id)}>
                          +
                        </button>
                      </div>
                      <button
                        className="remover-item"
                        onClick={() => removerDoCarrinho(item.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="carrinho-total">
                <h3>Total: R$ {calcularTotal()}</h3>
                <button
                  className="finalizar-pedido"
                  onClick={handleFinalizarPedido}
                >
                  Finalizar Pedido
                </button>
              </div>
            </aside>
          )}
        </>
      )}

      {/* Formulário de Checkout */}
      {mostraCheckout && (
        <div className="checkout-container">
          <h2>Finalizar Pedido</h2>
          <form onSubmit={handleCheckoutSubmit}>
            <label>
              Nome:
              <input type="text" name="nome" required />
            </label>
            <label>
              Endereço de Entrega:
              <input type="text" name="endereco" required />
            </label>
            <label>
              Forma de Pagamento:
              <select name="pagamento" required>
                <option value="">Selecione...</option>
                <option value="pix">PIX</option>
                <option value="cartao">Cartão de Crédito/Débito</option>
                <option value="dinheiro">Dinheiro</option>
              </select>
            </label>
            <button type="submit" className="finalizar-pedido">
              Confirmar Pedido
            </button>
          </form>
        </div>
      )}

      {/* Tela de Confirmação */}
      {pedidoFinalizado && ultimoPedido && (
        <div className="confirmacao-container">
          <h2>Pedido Confirmado!</h2>
          <p>Obrigado por sua compra! Seu pedido será preparado em breve.</p>

          <div className="resumo-pedido">
            <h3>Resumo do Pedido:</h3>
            <ul>
              {ultimoPedido.itens.map((item) => (
                <li key={item.id}>
                  {item.nome} (x{item.quantidade}) - R${" "}
                  {(item.preco * item.quantidade).toFixed(2)}
                </li>
              ))}
            </ul>
            <div className="total-resumo">
              <strong>Total: R$ {ultimoPedido.total}</strong>
            </div>
          </div>

          <button onClick={handleNovoPedido} className="novo-pedido-btn">
            Fazer um novo pedido
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
