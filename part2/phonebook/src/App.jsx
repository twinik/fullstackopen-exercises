import { useState } from "react";
import Filter from "./Components/Filter";
import PersonForm from "./Components/PersonForm";
import PersonsList from "./Components/Persons";

function App() {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  const handleAdd = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber };

    if (alreadyExists(newName, newNumber)) {
      alert("Person or number is already added to phonebook");
    } else {
      setPersons(persons.concat(newPerson));
    }
    setNewName("");
  };

  const alreadyExists = (name, number) => {
    return persons.some(
      (person) => person.name === name || person.number === number
    );
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    const filter = event.target.value;
    const filteredPersons = persons.filter((person) =>
      person.name.toLowerCase().includes(filter.toLowerCase())
    );
    setPersons(filteredPersons);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleAdd={handleAdd}
      />
      <h3>Numbers</h3>
      <PersonsList persons={persons} />
    </div>
  );
}

export default App;
