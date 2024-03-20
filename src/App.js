import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Update the URL to match your Spring Boot app's URL if it's not running on localhost:8080
    fetch("http://localhost:8080/")
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => console.error("There was an error!", error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{message ? message : "Loading..."}</p>
      </header>
    </div>
  );
}

export default App;
