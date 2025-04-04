import React from "react";

const CartContext = React.createContext();

const Cart = ({ children }) => {
  const [cart, setCart] = React.useState([]);
  const [pending, setPending] = React.useState(false);

  React.useEffect(() => {}, []);

  const handleChangeQuantity = async (quantity) => {
    try {
      setPending(true);
    } catch (error) {
      console.log("Errors occur while changing product's quantity");
    } finally {
      setPending(false);
    }
  };

  const handleApplyDiscount = async (discount) => {
    try {
      setPending(true);
    } catch (error) {
    } finally {
      setPending(false);
    }
  };

  const handleRemoveProductFromCart = async (productId) => {
    try {
      setPending(true);
    } catch (error) {
    } finally {
      setPending(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        pending,
        handleApplyDiscount,
        handleChangeQuantity,
        handleRemoveProductFromCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => React.useContext(CartContext);

export default Cart;
