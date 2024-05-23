import { useState, useEffect } from "react";
import TopBar from "../HomeScreen/TopBar/TopBar";
import Users from "../../comp/Users.jsx";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.jsx";

function ReservationsScreen() {
  const appStyles = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  const axiosPrivate = useAxiosPrivate();
  const [orders, setOrders] = useState([]);

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
      

  },[]);

  return (
    <>
      <TopBar />
      RESERVATIONS PAGE
      <Users />
      <div className="ordersList">
          <h2>Your orders</h2>
          {orders.length === 0 ? (
            <p>No Orders to show</p>
          ) : (
            <ul>
              {orders.map((order, index) => (
                <li key={index}>
                  <h3>Order {index + 1}</h3>
                  <ul>
                    <li>OrdertId: {order.order_id}</li>
                    <li>UserId: {order.user_id}</li>
                    <li>Full price: {order.full_price}</li>
                    <li>Payment status: {order.is_payment_completed ? "true" : "false"}</li>
                    <li>Payment Method: {order.paymentMethod}</li>
                    <li>Order date: {order.orderDate}</li>
                    {order.tickets.length === 0 ? (
                      <p>No tickets available</p>
                    ) : (
                      <ul>
                        {order.tickets.map((ticket, index) => (
                          <li key={index}>
                            <h3>Ticket {index + 1}</h3>
                            <ul>
                              <li>TicketId: {ticket.ticket_id}</li>
                              <li>flight_id: {ticket.flight_id}</li>
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
        </div>
    </>
  );
}

export default ReservationsScreen;
