import { useNavigate } from "react-router-dom";
import TopBar from "../HomeScreen/TopBar/TopBar";
import styles from "./Favourites.module.css";
import { axiosPrivate } from "../../../hooks/useAxiosPrivate.jsx";
import Pagination from "../../../comp/Pagination.jsx";
import Footer from "../HomeScreen/Footer/Footer.jsx";
import useAuth from "../../../hooks/useAuth.jsx";
import Loading from "../../../comp/Loading.jsx";
import { message } from "antd";

import { useEffect, useState } from "react";

function FavouritesScreen() {
  const navigate = useNavigate();

  const auth = useAuth();

  const [flights, setFlights] = useState([{}]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const handleFlightSelection = (flight) => {
    const {
      departure_airport,
      departure_city,
      arrival_airport,
      arrival_city,
      data_lotu,
    } = flight;
    navigate(
      `/flightReservation/${flight.flight_id}?departureAirport=${departure_airport}&departureCity=${departure_city}&arrivalAirport=${arrival_airport}&arrivalCity=${arrival_city}&flightDate=${data_lotu} `
    );
  };

  useEffect(() => {
    const getFlights = async () => {
      try {
        const response = await axiosPrivate.get("/follows", {});
        //console.log("Data fetched successfully:", response.data);
        if (response.data) {
          setFlights(response.data);
          if (response.data.length==0)
            messageApi.open({
              type:"error",
              content: "You haven't followed anything yet."
            })
        }
      } catch (error) {
        //console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    getFlights();
  }, [axiosPrivate]);

  return (
    <>
      {contextHolder}
      <div className={styles.mainBox}>
        <TopBar />

        <div className={styles.flightsContent}>
          {loading ? (
            <Loading />
          ) : (
            <Pagination
              key={JSON.stringify(flights)}
              flights={flights}
              itemsPerPage={2}
              handleFlightSelection={handleFlightSelection}
            />
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}

export default FavouritesScreen;
