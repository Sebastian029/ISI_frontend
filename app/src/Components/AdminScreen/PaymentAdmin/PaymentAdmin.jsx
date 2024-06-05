import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import TopBar from "../TopBar/TopBar";
import styles from "./PaymentAdmin.module.css";

const PaymentAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    const appStyles = {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      };

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

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      };
    
      const handlePrevPage = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };
    
      const handlePageChange = (page) => {
        setCurrentPage(page);
      };
    
      const renderPageNumbers = () => {
        const pageNumbers = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);
    
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(
            <button
              key={i}
              className={`${styles.button} ${i === currentPage ? styles.active : ''}`}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        }
    
        return pageNumbers;
      };    

    const confirmPayment = async (order_id) => {
        try {
            const response = await axiosPrivate.get(`/order/confirm/${order_id}`);
            alert(response.data.message);
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.order_id === order_id ? { ...order, is_payment_completed: 1 } : order
                )
            );
        } catch (error) {
            if (error.response) {
                alert(`Error: ${error.response.data.error}`);
            } else if (error.request) {
                alert('Error: No response from server');
            } else {
                alert(`Error: ${error.message}`);
            }
        }
    };

    if (loading) {
       return <><TopBar /> <div className={styles.ordersList}>Loading...</div></>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
          <TopBar />
          <div className={styles.ordersList}>
            <h2>Orders Transfer</h2>
            {currentOrders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <ul className={styles.mainList}>
                {currentOrders.map((order, index) => (
                  <li className={styles.order} key={index}>
                    <h2>Order {index + 1 + (currentPage - 1) * ordersPerPage}</h2>
                    <ul className={styles.orderData}>
                      <li>Order number: {order.order_id}</li>
                      <li>Full price: {order.full_price}</li>
                      <li>Order date: {order.orderDate}</li>
                      <li>Payment Method: {order.paymentMethod}</li>
                      <button className={styles.button} onClick={() => confirmPayment(order.order_id)}>
                        Confirm Payment
                      </button>
                    </ul>
                  </li>
                ))}
              </ul>
            )}
            <div className={styles.pagination}>
              <button
                className={styles.button}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {renderPageNumbers()}
              <button
                className={styles.button}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      );
};

export default PaymentAdmin;
