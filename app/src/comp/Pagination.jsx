import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import FlightIcon from "@mui/icons-material/Flight";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import AirlineStopsIcon from "@mui/icons-material/AirlineStops";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PropTypes from "prop-types";

function Items({ currentItems, handleFlightSelection }) {
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
              Flight Date: {item.data_lotu}
            </div>
            <div style={styles.infoBar}>
              <FlightTakeoffIcon style={styles.flightIcon} />
              Arrival Airport: {item.arrival_airport}
            </div>
            <div style={styles.infoBar}>
              <FlightLandIcon style={styles.flightIcon} />
              Departure Airport: {item.departure_airport}
            </div>
            {/*
            <div style={styles.infoBar}>
              <DepartureBoardIcon style={styles.flightIcon} />
              Departure Time:
            </div>
            */}
            <div style={styles.infoBar}>
              <AccessTimeIcon style={styles.flightIcon} />
              Travel Time: {item.travel_time}
            </div>
            <div style={styles.bottomContainer}>
              <div>
                <div style={styles.infoBar}>
                  <AirlineSeatReclineExtraIcon style={styles.flightIcon} />
                  Available Seats: {item.available_seats}
                </div>
                <div style={styles.infoBar}>
                  <AirlineStopsIcon style={styles.flightIcon} />
                  Distance: {item.distance} km
                </div>
              </div>
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
          No flights available
          <SentimentVeryDissatisfiedIcon
            style={{ fontSize: 50, paddingLeft: 10 }}
          />
        </div>
      )}
    </div>
  );
}

export default function PaginatedItems({
  flights,
  itemsPerPage,
  handleFlightSelection,
}) {
  const [currentItems, setCurrentItems] = useState(flights);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    //console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(flights.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(flights.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % flights.length;
    // console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
  };

  return (
    <>
      <div style={styles.mainContainer}>
        <div style={styles.itemsContainer}>
          <Items
            currentItems={currentItems}
            handleFlightSelection={handleFlightSelection}
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
          border: 1px solid orange;
          color: orange;
          cursor: pointer;
          text-decoration: none;
          bottom: 0px;
          border-radius: 20px;
        }
        .page-link:hover {
          background-color: orange;
          color: white;
        }
        .active .page-link {
          background-color: orange;
          color: white;
          border-color: orange);
        }
        .button{
          height: 50%;
          font-size: 20px;
          font-family: "Lato";
          background-color: var(--main-color);
          border-radius: 10px;
          border:0px;
          padding: 15px 20px;
        }
        .button:hover {
          background-color: var(--main-color-2);
          cursor:pointer;
        }
      `}</style>
    </>
  );
}

const styles = {
  mainContainer: {
    paddingTop: 20,
    display: "flex",
    flexDirection: "column",
    minWidth: "100%",
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
  globalFlightContainer: {
    width: "80%",
    overflowY: "auto",
    maxHeight: "80vh",
  },
  innerFlightContainer: {
    display: "flex",
    flexDirection: "column",
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 22,
    fontWeight: "bold",
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "black",
    margin: 10,
  },
  infoBar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    paddingTop: 15,
    fontSize: 18,
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
