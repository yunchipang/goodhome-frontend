import React, { useEffect, useState } from "react";

function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const apiUrl = "http://localhost:8000/";
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => setMessage(data))
      .catch((error) => {
        console.error("There was an error!", error);
        setMessage("Failed to load message");
      });
  }, []);

  return (
    <div>
      <p>{message}</p>
    </div>
  );
}

export default Home;
