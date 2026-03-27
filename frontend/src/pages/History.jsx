// NEW FILE
import { useEffect, useState } from "react";

export default function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // NEW: protect route
    if (!token) {
      alert("Login required");
      return;
    }

    fetch("http://localhost:8000/history", {
      headers: {
        Authorization: `Bearer ${token}` // NEW
      }
    })
    .then(res => res.json())
    .then(setData);
  }, []);

  return (
    <div>
      <h2>Prediction History</h2>

      {data.map((item, i) => (
        <div key={i}>
          <p>Age: {item.age}</p>
          <p>Cholesterol: {item.chol}</p>
          <p>Result: {item.result}</p>
          <hr/>
        </div>
      ))}
    </div>
  );
}