import React, { useEffect, useState } from "react";
import axios from "axios";
import Record from "./Record";
import Navbar from "./Navbar";
function Dashboard() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get("/api/records");
        // console.log(response.data.);
        setRecords(response.data.result);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchRecords();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-4 w-full min-h-screen  dark: bg-gray-900 dark: text-white">
        <h2 className="text-2xl mb-4">All Records</h2>
        <div className="flex flex-row gap-1 w-full flex-wrap">
          {records.map((record) => (
            <Record details={record} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
