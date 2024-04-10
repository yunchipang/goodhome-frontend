import React, { useState } from "react";
import "./QueryExecutor.css"; // Ensure this path matches the location of your CSS file

const QueryExecutor = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const executeQuery = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `query=${encodeURIComponent(query)}`,
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setError(`Failed to fetch: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default action to avoid adding a new line
      executeQuery();
    }
  };

  return (
    <div className="queryExecutorContainer">
      <h1>SQL Query Executor</h1>
      <textarea
        className="queryTextarea"
        value={query}
        onChange={handleQueryChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter your SQL query here"
        rows="4"
      ></textarea>
      <br />
      <button
        className="queryButton"
        onClick={executeQuery}
        disabled={isLoading}
      >
        {isLoading ? "Executing..." : "Execute Query"}
      </button>
      {error && <div className="queryError">{error}</div>}
      {response && (
        <div className="queryResponse">
          <h2>Response</h2>
          <table>
            <thead>
              <tr>
                {response.columns.map((column, index) => (
                  <th key={index}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {response.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {response.columns.map((column, columnIndex) => (
                    <td key={columnIndex}>{row[column]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QueryExecutor;
