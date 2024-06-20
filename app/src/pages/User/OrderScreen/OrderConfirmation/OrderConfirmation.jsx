import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../../HomeScreen/TopBar/TopBar.jsx";
import styles from "./OrderConfirmation.module.css";
import { useEffect, useState } from "react";
import axios from "../../../../axiosInstance.js";
import { axiosPrivate } from "../../../../hooks/useAxiosPrivate.jsx";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FlightIcon from "@mui/icons-material/Flight";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import { Card, message, Radio, Space } from "antd";

const OrderConfirmation = () => {
  const [tickets, setTickets] = useState([{}]);
  const [flightDetails, setFlightDetails] = useState();
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const appStyles = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  useEffect(() => {
    //console.log(localStorage.getItem("flightDetails"));
    setTickets(JSON.parse(localStorage.getItem("cart")));
    setFlightDetails(JSON.parse(localStorage.getItem("flightDetails")));
    //console.log(tickets);
  }, []);

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = parsedDate.getDate().toString().padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const handleConfirmation = async () => {
    try {
      const response = await axiosPrivate.post("/ticket_buy", {
        tickets: tickets.map((ticket) => ({ ticket_id: ticket.ticket_id })),
        paymentMethod: paymentMethod,
      });

      if (response.data) {
        const orderIdResponse = response.data.order_id;

        //console.log(response.data.order_id);
        // if(response.data.order_id==undefined){
        //   messageApi.open({
        //     type: 'error',
        //     content: "You don't have permission to make a purchase!",
        //   });
        // } else
        if (paymentMethod == "transfer") {
          //console.log("Transfer Payment");
          navigate(
            `/transferdetails?orderId=${response.data.order_id}&fullPrice=${response.data.full_price}`
          );
        } else if (paymentMethod == "online") {
          //console.log("Online Payment");
          const payment = await axiosPrivate.post("/create-payment", {
            tickets: tickets,
            order_id: response.data.order_id,
            full_price: response.data.full_price,
          });

          window.location.href = payment.data.approval_url;
          //console.log(payment.data);
        }
      }

      // localStorage.setItem("cart",null)
      // localStorage.setItem("flightDetails",null)
    } catch (error) {
      //console.error("Error buying tickets:", error);
      if (error.response && error.response.status == 403) {
        messageApi.open({
          type: "error",
          content: "You don't have permission to make a purchase!",
        });
      }
    }
  };

  const changePaymentMethod = (e) => {
    setPaymentMethod(e.target.value);
  }

  return (
    <>
      {contextHolder}
      <TopBar />
      <div style={appStyles}>
        <div className={styles.mainContainer}>
          <h2>Your Cart</h2>
          <div className={styles.yourOrder}>
            <div className={styles.flightBar}>
              <div className={styles.infoBar}>
                <b> {flightDetails && flightDetails.departureCity}</b>
              </div>
              <div className={styles.line} />
              <div>
                <FlightIcon
                  className={styles.flightIcon}
                />
              </div>
              <div className={styles.line} />
              <div className={styles.infoBar}>
                <b> {flightDetails && flightDetails.arrivalCity}</b>
              </div>
            </div>
            <div className={styles.flightData}>
              <div className={styles.infoBar}>
                <p>
                  <FlightTakeoffIcon
                    className={styles.icon}
                  />
                  Departure Airport:{" "}
                  {flightDetails && flightDetails.departureAirport}
                </p>
              </div>
              <div className={styles.infoBar}>
                <p>
                  <FlightLandIcon className={styles.icon} />
                  Arrival Airport:{" "}
                  {flightDetails && flightDetails.arrivalAirport}
                </p>
              </div>
              <div className={styles.infoBar}>
                <p>
                  <CalendarMonthIcon
                    className={styles.icon}
                  />
                  Flight Date:{" "}
                  {formatDate(flightDetails && flightDetails.flightDate)}
                </p>
              </div>
            </div>
            <div className={styles.ticketData}>
              <div className={styles.infoTickets}>
                Tickets you have chosen for this flight:
              </div>
              {tickets.length === 0 ? (
                <p>No tickets available</p>
              ) : (
                <ul className={styles.ticketList}>
                  {tickets.map((ticket, index) => (
                    <li key={index} className={styles.ticketC}>
                      <Card hoverable className={styles.ticket}>
                        <div className={styles.cardContent}>
                          <div className={styles.info}>
                            <div className={styles.infoBar}>
                              <AirplaneTicketIcon
                                className={styles.icon}
                              />
                              Ticket {index + 1}
                            </div>
                            <div className={styles.ticketInfo}>
                              <div>Class: {ticket.ticket_class}</div>
                              <div>Row: {ticket.row}</div>
                              <div>Seat: {ticket.column}</div>
                              <div>Price: {ticket.price} $</div>
                            </div>
                          </div>
                          <img
                            className={styles.img}
                            src={
                              ticket.ticket_class == "economy"
                                ? "https://www.travelguys.fr/wp-content/uploads/2023/06/IMG_7191-scaled.jpg"
                                : "https://upload.wikimedia.org/wikipedia/commons/7/72/Philippine_Airlines_business_class_A330-300.png"
                            }
                          />
                        </div>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={styles.payment}>
            <p className={styles.label}>Method of payment</p>
            <Radio.Group onChange={changePaymentMethod} value={paymentMethod}>
              <Space direction="vertical">
                  <Radio
                    name="paymentMethod"
                    value="transfer"
                    className={styles.radio}
                    //onChange={() => setPaymentMethod("transfer")}
                  >
                    Przelew
                  </Radio>
                  <Radio
                    name="paymentMethod"
                    value="online"
                    className={styles.radio}
                    //onChange={() => setPaymentMethod("online")}
                    >
                    PayPal
                  </Radio>
              </Space>
            </Radio.Group>
          </div>
          <input
            className={styles.button}
            type="button"
            value="Confirm reservation"
            onClick={handleConfirmation}
          />
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
