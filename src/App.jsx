import { useEffect, useState } from "react";
import "./App.css";
import Cart from "./components/Cart";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("ecotrend-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [category, setCategory] = useState("Todos");
  const [maxPrice, setMaxPrice] = useState(200);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  /* =========================
     CARREGAR PRODUTOS - FETCH GET
  ========================= */

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);

        const response = await fetch(
          `${import.meta.env.BASE_URL}products.json`
        );

        if (!response.ok) {
          throw new Error("Erro ao carregar produtos");
        }

        const data = await response.json();

        setProducts(data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os produtos.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  /* =========================
     LOCAL STORAGE
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "ecotrend-cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  /* =========================
     CARRINHO
  ========================= */

  function addToCart(product) {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    setCartOpen(true);
  }

  function removeFromCart(id) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  }

  function changeQuantity(id, quantity) {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  }

  /* =========================
     CHECKOUT COM PROMISE
  ========================= */

  function handleCheckout() {
    if (cart.length === 0) {
      setCheckoutMessage("Seu carrinho está vazio.");
      return;
    }

    setCheckoutMessage("Processando pedido...");

    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    })
      .then(() => {
        setCheckoutMessage(
          "Compra realizada com sucesso! 🌱"
        );

        setCart([]);

        setTimeout(() => {
          setCheckoutMessage("");
          setCartOpen(false);
        }, 2500);
      })
      .catch(() => {
        setCheckoutMessage(
          "Erro ao finalizar a compra."
        );
      });
  }

  /* =========================
     FILTROS
  ========================= */

  const categories = [
    "Todos",
    ...new Set(
      products.map((product) => product.category)
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      category === "Todos" ||
      product.category === category;

    const priceMatch =
      product.price <= maxPrice;

    return categoryMatch && priceMatch;
  });

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="app">

      {/* =========================
          HEADER
      ========================= */}

      <header className="header">
        <div className="header-container">

          <a
            href="#inicio"
            className="logo"
          >
            Eco<span>Trend</span>
          </a>

          <nav className="nav">
            <a href="#inicio">Início</a>
            <a href="#produtos">Produtos</a>
            <a href="#sobre">Sobre</a>
          </nav>

          <button
            className="cart-button"
            onClick={() => setCartOpen(true)}
          >
            <i className="fa-solid fa-cart-shopping"></i>

            <span>Carrinho</span>

            {totalItems > 0 && (
              <span className="cart-count">
                {totalItems}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* =========================
          HERO
      ========================= */}

      <section
        className="hero"
        id="inicio"
      >
        <div className="hero-container">

          <div className="hero-content">

            <span className="hero-label">
              CONSUMO CONSCIENTE
            </span>

            <h1>
              Escolhas melhores
              <br />
              para um{" "}
              <span>futuro melhor.</span>
            </h1>

            <p>
              Produtos sustentáveis para transformar
              pequenas escolhas em grandes mudanças.
            </p>

            <button
              className="hero-button"
              onClick={() => {
                document
                  .getElementById("produtos")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              Explorar produtos
            </button>

          </div>

          <div className="hero-visual">
            <div className="hero-circle">
              🌿
            </div>
          </div>

        </div>
      </section>

      {/* =========================
          PRODUTOS
      ========================= */}

      <main
        className="products-section"
        id="produtos"
      >
        <div className="container">

          <div className="section-header">

            <div>
              <span className="section-label">
                NOSSA SELEÇÃO
              </span>

              <h2>
                Produtos sustentáveis
              </h2>
            </div>

            <p>
              Pensados para você e para o planeta.
            </p>

          </div>

          {/* FILTROS */}

          <div className="filters">

            <div className="filter-group">
              <label htmlFor="category">
                Categoria
              </label>

              <select
                id="category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group price-filter">

              <label htmlFor="price">
                Preço máximo:{" "}
                <strong>
                  R$ {maxPrice.toFixed(2).replace(".", ",")}
                </strong>
              </label>

              <input
                id="price"
                type="range"
                min="20"
                max="200"
                step="5"
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(
                    Number(event.target.value)
                  )
                }
              />

            </div>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Carregando produtos...</p>
            </div>
          )}

          {/* ERRO */}

          {!loading && error && (
            <div className="error">
              {error}
            </div>
          )}

          {/* PRODUTOS */}

          {!loading &&
            !error &&
            filteredProducts.length > 0 && (
              <div className="products-grid">

                {filteredProducts.map((product) => (
                  <article
                    className="product-card"
                    key={product.id}
                  >

                    <div className="product-image">
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                    </div>

                    <div className="product-info">

                      <span className="product-category">
                        {product.category}
                      </span>

                      <h3>
                        {product.name}
                      </h3>

                      <p>
                        {product.description}
                      </p>

                      <div className="product-bottom">

                        <strong className="product-price">
                          R${" "}
                          {product.price
                            .toFixed(2)
                            .replace(".", ",")}
                        </strong>

                        <button
                          className="add-button"
                          onClick={() =>
                            addToCart(product)
                          }
                        >
                          Adicionar
                        </button>

                      </div>

                    </div>

                  </article>
                ))}

              </div>
            )}

          {/* SEM PRODUTOS */}

          {!loading &&
            !error &&
            filteredProducts.length === 0 && (
              <div className="no-products">
                Nenhum produto encontrado.
              </div>
            )}

        </div>
      </main>

      {/* =========================
          SOBRE
      ========================= */}

      <section
        className="about-section"
        id="sobre"
      >
        <div className="container about-content">

          <div className="about-text">

            <span className="section-label">
              SOBRE A ECOTREND
            </span>

            <h2>
              Consumo consciente
              <br />
              começa com pequenas escolhas.
            </h2>

            <p>
              A EcoTrend reúne produtos que ajudam
              você a adotar um estilo de vida mais
              sustentável sem abrir mão de qualidade
              e praticidade.
            </p>

          </div>

          <div className="about-card">
            <span>🌱</span>

            <h3>
              Mais sustentável.
            </h3>

            <p>
              Produtos escolhidos pensando no
              impacto positivo para o planeta.
            </p>
          </div>

        </div>
      </section>

      {/* =========================
          CHECKOUT
      ========================= */}

      {checkoutMessage && (
        <div className="checkout-message">
          {checkoutMessage}
        </div>
      )}

      {/* =========================
          CARRINHO
      ========================= */}

      {cartOpen && (
        <div className="cart-overlay">

          <Cart
            cart={cart}
            onRemove={removeFromCart}
            onQuantityChange={changeQuantity}
            onCheckout={handleCheckout}
            onClose={() => setCartOpen(false)}
          />

        </div>
      )}

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer">
        <div className="container footer-content">

          <div>
            <div className="logo">
              Eco<span>Trend</span>
            </div>

            <p>
              Escolhas melhores para um futuro melhor.
            </p>
          </div>

          <div className="footer-links">
            <a href="#inicio">Início</a>
            <a href="#produtos">Produtos</a>
            <a href="#sobre">Sobre</a>
          </div>

          <small>
            © 2026 EcoTrend. Projeto acadêmico.
          </small>

        </div>
      </footer>

    </div>
  );
}

export default App;