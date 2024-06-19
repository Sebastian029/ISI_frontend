import { useState, useEffect } from "react";
import TopBar from "../HomeScreen/TopBar/TopBar.jsx";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate.jsx";
import useAuth from "../../../hooks/useAuth.jsx";
import styles from "./ReservationsScreen.module.css";
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import { Card } from 'antd';
import Loading from '../../../comp/Loading.jsx';
import NoData from "../../../comp/NoData.jsx";


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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axiosPrivate.get("/orders/user/", {});

        console.log("Data posted successfully:", response.data);
        if (response.data) {
          setOrders(response.data);
          
        }
      } catch (error) {
        //console.error("Error posting data: elements not found");
        setOrders([]);
        setLoading(false);
      }
    };

    getOrders();
  }, [auth]);

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
          className={`${styles.button} ${
            i === currentPage ? styles.active : ""
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = parsedDate.getDate().toString().padStart(2, "0");
    return `${day}-${month}-${year}`;
  };


  return (
    <>
      <TopBar />
      <div className={styles.ordersList}>
        <h2>Your orders</h2>
        {currentOrders.length === 0 ? (
          !loading ? <NoData/> : <Loading/>
        ) : (
          <ul className={styles.mainList}>
            {currentOrders.map((order, index) => (
              <li className={styles.order} key={index}>
                <h2>Order {index + 1 + (currentPage - 1) * ordersPerPage}</h2>
                <ul className={styles.orderData}>
                  <li>Full price: {order.full_price}</li>
                  <li>
                    Payment status:{" "}
                    {order.is_payment_completed ? "completed" : "not regulated"}
                  </li>
                  <li>Payment Method: {order.paymentMethod}</li>
                  <li>Order date: {formatDate(order.orderDate)}</li>

                  {order.tickets.length === 0 ? (
                    <p>No tickets available</p>
                  ) : (
                    <ul className={styles.ticketList}>
                      {order.tickets.map((ticket, index) => (
                        <li key={index} className={styles.ticketC}>
                          <Card hoverable className={styles.ticket}>
                            <div className={styles.cardContent}>
                              <div className={styles.info}>
                                <div className={styles.infoBar}><AirplaneTicketIcon style={{fontSize:30, marginBottom:-7, marginRight: 4}}/>Ticket {index + 1}</div>
                                <div className={styles.ticketInfo}>
                                  <div>Class: {ticket.ticket_class}</div>
                                  <div>Row: {ticket.row}</div>
                                  <div>Seat: {ticket.column}</div>
                                  <div>Price: {ticket.price} $</div>
                                </div>
                              </div>
                              <img 
                                className={styles.img}
                                src={ticket.ticket_class == "economy"
                                  ? "https://www.travelguys.fr/wp-content/uploads/2023/06/IMG_7191-scaled.jpg"
                                  : "https://upload.wikimedia.org/wikipedia/commons/7/72/Philippine_Airlines_business_class_A330-300.png"} />
                            </div>
                          </Card>
                        </li>
                      ))}
                    </ul>
                  )}
                </ul>
              </li>
            ))}
          </ul>
        )}
        { loading ? <div className={styles.pagination}>
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
          </div> : ''
          }
      </div>
    </>
  );
}

export default ReservationsScreen;
