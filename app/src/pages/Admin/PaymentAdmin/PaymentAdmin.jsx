import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import TopBar from "../TopBar/TopBar";
import styles from "./PaymentAdmin.module.css";
import Loading from "../../../comp/Loading";

const PaymentAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosPrivate.get("/orders/transfer");
        setOrders(response.data);
      } catch (error) {
        if (error.response) {
          setError(`Error: ${error.response.data.error}`);
        } else if (error.request) {
          setError("Error: No response from server");
        } else {
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [axiosPrivate]);

  const confirmPayment = async (order_id) => {
    try {
      const response = await axiosPrivate.get(`/order/confirm/${order_id}`);
      alert(response.data.message);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === order_id
            ? { ...order, is_payment_completed: 1 }
            : order
        )
      );
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.error}`);
      } else if (error.request) {
        alert("Error: No response from server");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <TopBar />
      <h1>Orders Transfer</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className={styles.orderList}>
          {orders.map((order, index) => (
            <li key={index} className={styles.orderItem}>
              <div>full price: {order.full_price}</div>
              <div>order data: {order.orderDate}</div>
              <div>order id: {order.order_id}</div>
              <div>payment method: {order.paymentMethod}</div>
              <button onClick={() => confirmPayment(order.order_id)}>
                Confirm Payment
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaymentAdmin;
