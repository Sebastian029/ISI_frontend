import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import TopBar from "../TopBar/TopBar";
import styles from "./PaymentAdmin.module.css";

const PaymentAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosPrivate.get('/orders/transfer');
                setOrders(response.data);
            } catch (error) {
                if (error.response) {
                    setError(`Error: ${error.response.data.error}`);
                } else if (error.request) {
                    setError('Error: No response from server');
                } else {
                    setError(`Error: ${error.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [axiosPrivate]);

    if (loading) {
        return <div>Loading...</div>;
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
                            <div>is payment completed: {order.is_payment_completed}</div>
                            <div>order data: {order.orderDate}</div>
                            <div>order id: {order.order_id}</div>
                            <div>payment method: {order.paymentMethod}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PaymentAdmin;
