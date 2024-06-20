import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import FlightIcon from "@mui/icons-material/Flight";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import AirlineStopsIcon from "@mui/icons-material/AirlineStops";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { axiosPrivate } from "../hooks/useAxiosPrivate";

import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import PropTypes from "prop-types";
import NoData from "./NoData";

function Items({
  currentItems,
  handleFlightSelection,
  currentFlights,
  setCurrentFlights,
}) {
  const updateItemsFollow = (flight_id, new_follow_id) => {
    const updatedFlights = currentFlights.map((flight) =>
      flight.flight_id === flight_id
        ? { ...flight, is_follow: true, follow_id: new_follow_id }
        : flight
    );
    setCurrentFlights(updatedFlights);
  };

  const updateItemsUnfollow = (follow_id) => {
    const updatedFlights = currentFlights.map((flight) =>
      flight.follow_id === follow_id ? { ...flight, is_follow: false } : flight
    );
    setCurrentFlights(updatedFlights);
  };

  const followFlight = async (flightId) => {
    // console.log(flightId);

    try {
      const response = await axiosPrivate.post("/follow", {
        flight_id: flightId,
      });
      updateItemsFollow(flightId, response.data.follow_id);
      //  console.log("Data posted successfully:", response.data);
    } catch (error) {
      console.error("Error following flight:", error);
    }
  };

  const unfollowFlight = async (follow_id) => {
    try {
      await axiosPrivate.delete(`/unfollow/${follow_id}`);
      updateItemsUnfollow(follow_id);
      //    console.log("Unfollowed successfully:", response.data);
    } catch (error) {
      console.error("Error unfollowing flight:", error);
    }
  };

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = parsedDate.getDate().toString().padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  return (
    <div style={styles.globalFlightContainer}>
      {currentItems && currentItems.length > 0 ? (
        currentItems.map((item, index) => (
          <div key={index} style={styles.innerFlightContainer}>
            <div style={styles.topFlightBar}>
              {item.departure_city}
              <div style={styles.line}></div>
              <FlightIcon style={styles.airplaneIcon} />
              <div style={styles.line}></div>
              {item.arrival_city}
            </div>

            <div style={styles.infoBar}>
              <CalendarMonthIcon style={styles.flightIcon} />
              Flight Date:
            </div>
            <div style={styles.infoBar2}>{formatDate(item.data_lotu)}</div>

            <div style={styles.infoBar3}>
              {item.is_follow ? (
                <StarIcon
                  className="starIcon"
                  onClick={() => unfollowFlight(item.follow_id)}
                />
              ) : (
                <StarBorderIcon
                  className="starIcon"
                  onClick={() => followFlight(item.flight_id)}
                />
              )}
            </div>

            <div style={styles.infoBar}>
              <FlightTakeoffIcon style={styles.flightIcon} />
              Arrival Airport:
            </div>
            <div style={styles.infoBar2}>{item.arrival_airport}</div>

            <div style={styles.infoBar}>
              <FlightLandIcon style={styles.flightIcon} />
              Departure Airport:
            </div>
            <div style={styles.infoBar2}>{item.departure_airport}</div>

            <div style={styles.infoBar}>
              <AccessTimeIcon style={styles.flightIcon} />
              Travel Time:
            </div>
            <div style={styles.infoBar2}>{item.travel_time}</div>

            <div style={styles.infoBar}>
              <AirlineSeatReclineExtraIcon style={styles.flightIcon} />
              Available Seats:
            </div>
            <div style={styles.infoBar2}>{item.available_seats}</div>

            <div style={styles.infoBar}>
              <AirlineStopsIcon style={styles.flightIcon} />
              Distance:
            </div>
            <div style={styles.infoBar2}>{item.distance} km</div>
            <div style={styles.infoBar3}>
              <input
                type="button"
                value="Book this flight"
                onClick={() => handleFlightSelection(item)}
                style={styles.button}
                className="button"
              />
            </div>
          </div>
        ))
      ) : (
        <div style={styles.noFlightsMessage}>
          <NoData />
        </div>
      )}
    </div>
  );
}

Items.propTypes = {
  currentItems: PropTypes.array.isRequired,
  handleFlightSelection: PropTypes.func.isRequired,
  currentFlights: PropTypes.array.isRequired,
  setCurrentFlights: PropTypes.func.isRequired,
};

export default function PaginatedItems({
  flights,
  itemsPerPage,
  handleFlightSelection,
}) {
  const [currentFlights, setCurrentFlights] = useState(flights);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(currentFlights.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(currentFlights.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, currentFlights]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % currentFlights.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <div style={styles.mainContainer}>
        <div style={styles.itemsContainer}>
          <Items
            currentItems={currentItems}
            handleFlightSelection={handleFlightSelection}
            currentFlights={currentFlights}
            setCurrentFlights={setCurrentFlights}
          />
        </div>
        <div style={styles.paginationBar}>
          <ReactPaginate
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            previousLabel="< previous"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
          />
        </div>
      </div>
      <style jsx>{`
        .pagination {
          display: flex;
          list-style: none;
          padding: 0;
          justify-content: center;
          margin: 20px 0;
          bottom: 0px;
          font-weight: bold;
          font-family: "Lato";
        }
        .page-item {
          margin: 0 5px;
        }
        .page-link {
          padding: 8px 16px;
          border: 1px solid var(--main-color-2);
          color: var(--main-color-2);
          cursor: pointer;
          text-decoration: none;
          bottom: 0px;
          border-radius: 20px;
        }
        .page-link:hover {
          background-color: var(--main-color);
          color: white;
        }
        .active .page-link {
          background-color: var(--main-color);
          color: white;
          border-color: var(--main-color-2);
        }
        .button {
          font-family: "Lato";
          background-color: var(--main-color);
          border-radius: 10px;
          border: 0px;
          padding: 15px 20px;
          font-size: 1.2em;
          transition: background-color 0.3s ease;
        }

        .button:hover {
          background-color: var(--main-color-2);
          cursor: pointer;
          color: white;
        }
        .starIcon {
          color: var(--main-color-2);
          font-size: 3em;
          cursor: pointer;
        }
        .starIcon:hover {
          color: var(--main-color);
        }
        @media screen and (max-width: 700px) {
          .button {
            font-size: 0.8em;
            padding: 5px 10px;
          }
          .starIcon {
            font-size: 2em;
          }
        }
      `}</style>
    </>
  );
}

PaginatedItems.propTypes = {
  flights: PropTypes.array.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  handleFlightSelection: PropTypes.func.isRequired,
};

const styles = {
  mainContainer: {
    paddingTop: 20,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    minWidth: "70%",
    fontFamily: "Lato",
  },
  itemsContainer: {
    display: "flex",
    justifyContent: "center",
    flex: 1,
  },
  paginationBar: {
    display: "flex",
    justifyContent: "center",
  },
  globalFlightContainer: {},
  innerFlightContainer: {
    display: "grid",
    gridTemplateColumns: "35% 35% 30%",
    gridGap: "10px",
    width: "100%",
    paddingBottom: 100,
    color: "var(--gray-text)",
  },
  airplaneIcon: {
    transform: "rotate(90deg)",
    fontSize: 30,
  },
  flightIcon: {
    fontSize: 30,
  },
  flightMainText: {},

  topFlightBar: {
    gridColumnStart: 1,
    gridColumnEnd: 4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "1.5em",
    fontWeight: "bold",
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "black",
    margin: 10,
  },
  infoBar: {
    gridColumnStart: 1,
    gridColumnEnd: 2,
    display: "flex",
    alignItems: "center",
    gap: 10,
    paddingTop: 15,
    fontSize: "1em",
    //border: "1px solid red",
    overflow: "hidden",
  },
  infoBar2: {
    gridColumnStart: 2,
    gridColumnEnd: 3,
    display: "flex",
    alignItems: "center",
    gap: 10,
    paddingTop: 15,
    fontSize: "1em",

    // border: "1px solid lime",
  },
  infoBar3: {
    gridColumnStart: 3,
    gridColumnEnd: 4,
    // border: "1px solid blue",
    marginLeft: "auto",
  },
  bottomContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  noFlightsMessage: {
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 30,
    padding: 10,
  },
};

PaginatedItems.propTypes = {
  flights: PropTypes.array.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  handleFlightSelection: PropTypes.func.isRequired,
};
Items.propTypes = {
  currentItems: PropTypes.array.isRequired,
  handleFlightSelection: PropTypes.func.isRequired,
};
