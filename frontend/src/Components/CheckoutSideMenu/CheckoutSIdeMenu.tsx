import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { ShoppingCartContext } from './../../Context';
// import { ProductsGet } from '../../types/Products';
import { OrderCard } from './../.';
import { totalPrice } from '../../utils';

export const CheckoutSideMenu = () => {
  const context = useContext(ShoppingCartContext);

  const {
    closeCheckoutSideMenu,
    isCheckoutSideMenuOpen,
    cartProduct,
    setCartProduct,
    order,
    setOrder,
  } = context;

  const handleDelete = (id: number) => {
    const filteredProducts = cartProduct.filter(
      (product: any) => product.id !== id,
    );
    setCartProduct(filteredProducts);
  };

  const handleCheckout = () => {
    const orderToAdd = {
      date: '14.05.24',
      products: cartProduct,
      totalProducts: cartProduct.length,
      totalPrice: totalPrice(cartProduct.map((product: any) => product.price)),
    };

    setOrder([...order, orderToAdd]);
    setCartProduct([]);
  };

  return (
    <aside
      className={`${isCheckoutSideMenuOpen ? 'flex' : 'hidden'} flex-col fixed right-0 border border-black bg-white rounded-lg h-[calc(100vh-80px)] w-[360px] top-[68px]`}
    >
      <div className="flex justify-between items-center p-6">
        <h2 className="font-medium text-xl">My Order</h2>
        <div onClick={closeCheckoutSideMenu}>
          <XMarkIcon
            className="h-7 w-7 text-black hover:text-red-600"
            onClick={closeCheckoutSideMenu}
          />
        </div>
      </div>
      <div className="px-6 overflow-y-scroll flex-1">
        {cartProduct.map((product: any) => (
          <OrderCard
            key={product.id}
            id={product.id}
            image={product.image}
            price={product.price}
            title={product.title}
            handleDelete={handleDelete}
          />
        ))}
      </div>
      <div className="px-6 mb-6">
        <p className="flex items-center justify-between mb-2">
          <span className="font-light">Total: </span>
          <span className="font-medium text-2xl">
            ${totalPrice(cartProduct.map((product: any) => product.price))}
          </span>
        </p>
        <Link to={'/my-orders'}>
          <button
            className="bg-black py-3 text-white w-full rounded-lg"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </Link>
      </div>
    </aside>
  );
};
