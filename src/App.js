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

  return (
    <div className="App">
      <header>
        <h1>Lanchonete do Zé</h1>
        <p>Sua fome acaba aqui. Conheça nossos clássicos!</p>
      </header>

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
            <button className="finalizar-pedido">Finalizar Pedido</button>
          </div>
        </aside>
      )}
    </div>
  );
}

export default App;
