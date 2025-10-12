import { useEffect } from "react";
import axios from "axios";

function TestApi() {
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/profiles/")
      .then(res => {
        console.log("✅ Full Axios Response:", res);
        console.log("✅ Data:", res.data);
      })
      .catch(err => {
        console.error("❌ Axios Error:", err);
      });
  }, []);

  return <h2>Check Console for API response</h2>;
}

export default TestApi;
