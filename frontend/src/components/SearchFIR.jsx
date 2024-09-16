// src/components/SearchFIR.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Record from "./Record";
import Navbar from "./Navbar";

function SearchFIR() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      if (query.length > 1) {
        try {
          const response = await axios.get("/api/searchFIR", {
            params: { q: query },
          });
          setResults(response.data);
        } catch (error) {
          console.error("Error fetching records:", error);
        }
      } else {
        setResults([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchRecords();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen min-w-full bg-gray-900 text-white">
        <div className="w-full flex flex-col justify-center items-center ">
          <div>
            <h2 className="text-2xl mb-4 text-center">Search FIR</h2>
          </div>
          <div>
            <input
              className=" p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Name or code or mobile number"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-row  m-4 gap-2 w-full h-full">
          {results.map((record) => (
            <Record details={record} />
          ))}
        </div>
      </div>
    </>
  );
}

export default SearchFIR;
