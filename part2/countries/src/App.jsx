import { useState } from "react";
import axios from "axios";
import Searcher from "./components/Searcher";
import Content from "./components/Content";

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    axios
      .get(`https://restcountries.com/v3.1/name/${event.target.value}`)
      .then((response) => {
        setCountries(response.data);
      });
  };

  return (
    <>
      <Searcher value={filter} onChange={handleFilterChange} />
      <Content countries={countries} setCountries={setCountries} />
    </>
  );
}

export default App;
