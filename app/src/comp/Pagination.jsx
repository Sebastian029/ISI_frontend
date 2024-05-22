import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";

function Items({ currentItems }) {
  return (
    <div className="items">
      {currentItems &&
        currentItems.map((item, index) => (
          <div key={index}>
            <h3>Flight {index + 1}</h3>
            <ul>
              <li>Departure Airport: {item.departure_airport}</li>
              <li>Departure City: {item.departure_city}</li>
              <li>Arrival Airport: {item.arrival_airport}</li>
              <li>Arrival City: {item.arrival_city}</li>
              <li>Available Seats: {item.available_seats}</li>
              <li>Distance: {item.distance} km</li>
              <li>Flight_id: {item.flight_id}</li>
            </ul>
            <input type="button" value="Chose flight" />
          </div>
        ))}
    </div>
  );
}

export default function PaginatedItems({ flights, itemsPerPage }) {
  const [currentItems, setCurrentItems] = useState(flights);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    // Fetch items from another resource.
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(flights.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(flights.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  // Invoke when user clicks to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % flights.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return (
    <>
      <div style={styles.mainContainer}>
        <div style={styles.itemsContainer}>
          <Items currentItems={currentItems} />
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
      `}</style>
    </>
  );
}

const styles = {
  mainContainer: {
    display: "flex",
    flexDirection: "column",
  },
  itemsContainer: {
    display: "flex",
    justifyContent: "center",
    flex: 1,
  },
  paginationBar: {},
};
