import { useEffect, useState } from "react";
import axios from "axios";

export default function APITest() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/accounts/test/`)
      .then((res) => setMessage(res.data))
      .catch((err) => console.error("Error connecting:", err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Backend Connection Test</h1>
      <p>{message ? message : "Testing connection..."}</p>
    </div>
  );
}
