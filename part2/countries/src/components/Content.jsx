import Country from "./Country";

function Content({ countries, setCountries }) {
  return (
    <div>
      {countries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : countries.length > 1 ? (
        countries.map((country) => (
          <div key={country.name.common}>
            <p>{country.name.common}</p>
            <button onClick={() => setCountries([country])}>show</button>
          </div>
        ))
      ) : countries.length === 1 ? (
        <Country countrie={countries[0]} />
      ) : (
        <p>No matches, specify another filter</p>
      )}
    </div>
  );
}

export default Content;
