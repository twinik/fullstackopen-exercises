import { useState, useEffect } from "react";
import Filter from "./Components/Filter";
import PersonForm from "./Components/PersonForm";
import PersonsList from "./Components/PersonsList";
import Notification from "./Components/Notification";
import personsService from "./Services/persons";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);

  useEffect(() => {
    personsService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleAdd = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber };

    if (alreadyExists(newName)) {
      const person = persons.find((p) => p.name === newName);
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personsService
          .update(person.id, newPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) => (p.id !== person.id ? p : returnedPerson))
            );
            notification(`Updated ${returnedPerson.name}`, "success");
          })
          .catch(() => {
            notification(
              `Information of ${person.name} has already been removed from server`,
              "error"
            );
            setPersons(persons.filter((p) => p.id !== person.id));
          });
      }
    } else {
      personsService
        .create(newPerson)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          notification(`Added ${newPerson.name}`, "success");
        })
        .catch((error) => {
          notification(error.response.data.error, "error");
        });
    }
    setNewName("");
    setNewNumber("");
  };

  const handleDelete = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService.remove(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      });
    }
  };

  const alreadyExists = (name) => {
    return persons.some((person) => person.name === name);
  };

  const notification = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 3000);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    const filter = event.target.value;
    setFilter(filter);
    const filteredPersons = persons.filter((person) =>
      person.name.toLowerCase().includes(filter.toLowerCase())
    );
    setPersons(filteredPersons);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={notificationType} />
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
      <PersonsList persons={persons} handleDelete={handleDelete} />
    </div>
  );
}

export default App;
