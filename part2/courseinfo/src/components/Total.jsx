import React from "react";

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);

  return <p>Total of {total} exercises</p>;
};

export default Total;
