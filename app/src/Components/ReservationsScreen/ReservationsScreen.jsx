import { useState, useEffect } from "react";
import TopBar from "../HomeScreen/TopBar/TopBar";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.jsx";
import useAuth from "../../hooks/useAuth.jsx";
import styles from './ReservationsScreen.module.css'

function ReservationsScreen() {
  const appStyles = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  const axiosPrivate = useAxiosPrivate();
  const [orders, setOrders] = useState([]);
  const auth = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(()=>{
    const getOrders = async ()=>{
      try {

        const response = await axiosPrivate.get("/orders/user/", {
          
        });

        console.log("Data posted successfully:", response.data);
        if (response.data) {
          setOrders(response.data);
        }
      } catch (error) {
        console.error("Error posting data: elements not found");
        setOrders([]);
      }
    };

    getOrders();
      

  },[auth]);


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

  return (
    <>
      <TopBar />
      <div className={styles.ordersList}>
          <h2>Your orders</h2>
          {currentOrders.length === 0 ? (
            <p>No Orders to show</p>
          ) : (
            <ul className={styles.mainList}>
              {currentOrders.map((order, index) => (
                <li className={styles.order} key={index}>
                  <h2>Order {index + 1 + (currentPage - 1) * ordersPerPage}</h2>
                  <ul className={styles.orderData}>
                    <li>Order number: {order.order_id}</li>
                    <li>Full price: {order.full_price}</li>
                    <li>Payment status: {order.is_payment_completed ? "true" : "false"}</li>
                    <li>Payment Method: {order.paymentMethod}</li>
                    <li>Order date: {order.orderDate}</li>
                    
                    {order.tickets.length === 0 ? (
                      <p>No tickets available</p>
                    ) : (
                      <ul className={styles.ticketList}>
                        {order.tickets.map((ticket, index) => (
                          <li className={styles.ticket} key={index}>
                            <h3>Ticket {index + 1}</h3>
                            <ul className={styles.ticketData}>
                              <li>Class: {ticket.ticket_class}</li>
                              <li>Row: {ticket.row}</li>
                              <li>Seat: {ticket.column}</li>
                              <li>Price: {ticket.price}</li>
                            </ul>
                          </li>
                        ))}
                      </ul>
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.pagination}>
              <button className={styles.button} onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            {renderPageNumbers()}
            <button className={styles.button} onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </div>
    </>
  );
}

export default ReservationsScreen;
