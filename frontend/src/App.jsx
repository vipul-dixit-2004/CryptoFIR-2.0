import React, { useEffect, useState } from "react";
import FileFIR from "./components/FileFIR";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Auth from "./Routes/Auth";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import SearchFIR from "./components/SearchFIR";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/searchFIR" element={<SearchFIR />} />
        <Route
          path="/FileFIR"
          element={
            // <Auth>
            <FileFIR />
            // </Auth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
