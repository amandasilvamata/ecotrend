function Cart({
  cart,
  onRemove,
  onQuantityChange,
  onCheckout,
  onClose,
}) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <aside className="cart">

      <div className="cart-header">

        <div>
          <h2>Seu carrinho</h2>

          <span>
            {totalItems}{" "}
            {totalItems === 1 ? "item" : "itens"}
          </span>
        </div>

        <button
          type="button"
          className="close-cart"
          onClick={onClose}
          aria-label="Fechar carrinho"
        >
          ×
        </button>

      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h3>Seu carrinho está vazio</h3>

          <p>
            Adicione produtos sustentáveis para
            começar sua compra.
          </p>

        </div>
      ) : (
        <>

          <div className="cart-items">

            {cart.map((item) => (
              <div
                className="cart-item"
                key={item.id}
              >

                <img
                  src={`${import.meta.env.BASE_URL}${item.image.replace(/^\//, "")}`}
                  alt={item.name}
                />

                <div className="cart-item-info">

                  <h3>{item.name}</h3>

                  <span className="cart-category">
                    {item.category}
                  </span>

                  <strong>
                    R${" "}
                    {(item.price * item.quantity)
                      .toFixed(2)
                      .replace(".", ",")}
                  </strong>

                  <div className="quantity">

                    <button
                      type="button"
                      onClick={() =>
                        onQuantityChange(
                          item.id,
                          item.quantity - 1
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        onQuantityChange(
                          item.id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>

                    <button
                      type="button"
                      className="remove"
                      onClick={() =>
                        onRemove(item.id)
                      }
                    >
                      Remover
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>

          <div className="cart-footer">

            <div className="cart-total">

              <span>Total</span>

              <strong>
                R${" "}
                {total
                  .toFixed(2)
                  .replace(".", ",")}
              </strong>

            </div>

            <button
              type="button"
              className="checkout-button"
              onClick={onCheckout}
            >
              Finalizar compra
            </button>

            <p className="secure-message">
              🔒 Compra segura e consciente
            </p>

          </div>

        </>
      )}

    </aside>
  );
}

export default Cart;