const Notification = ({ message, type }) => {
  const notiStyle = {
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  return message === null ? null : (
    <div style={{ ...notiStyle, color: type === "success" ? "green" : "red" }}>
      {message}
    </div>
  );
};

export default Notification;
