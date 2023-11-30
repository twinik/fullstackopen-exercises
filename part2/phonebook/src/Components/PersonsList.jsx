function PersonsList({ persons, handleDelete }) {
  return (
    <>
      {persons.map((person) => (
        <div
          key={person.id}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <p style={{ marginRight: "10px" }}>
            {person.name} {person.number}
          </p>
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </div>
      ))}
    </>
  );
}

export default PersonsList;
