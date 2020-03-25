import React from "react";
import { usePaginateCollection } from "react-fireclient";

function View(props) {
  const options = {
    order: {
      by: "population",
    },
    limit: 3,
  };
  const [cities, loading, , prevHandler, nextHandler] = usePaginateCollection("/cities", options);
  return (
    <>
      <button onClick={prevHandler.fn} disabled={!prevHandler.enabled}>
        Prev
      </button>
      <button onClick={nextHandler.fn} disabled={!nextHandler.enabled}>
        Next
      </button>
      {loading ? (
        <div>Loading...</div>
      ) : (
        cities.map(city => (
          <div>
            name: {city.data.name}, country: {city.data.country}, population: {city.data.population}
          </div>
        ))
      )}
    </>
  );
}

export default View;
