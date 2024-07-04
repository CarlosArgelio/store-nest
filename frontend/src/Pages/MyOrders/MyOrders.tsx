import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Layout, OrdersCard } from '../../Components';
import { ShoppingCartContext } from '../../Context';

function MyOrders() {
  const context = useContext(ShoppingCartContext);

  const { order } = context;

  return (
    <Layout>
      <div className="flex items-center justify-center relative w-80">
        <h1>My Orders</h1>
      </div>
      {order.map((order, index) => {
        return (
          <Link key={index} to={`/my-orders/${index}`}>
            <OrdersCard
              totalPrice={order.totalPrice}
              totalProducts={order.totalProducts}
            />
          </Link>
        )
      })}
    </Layout>
  );
}
export { MyOrders };
