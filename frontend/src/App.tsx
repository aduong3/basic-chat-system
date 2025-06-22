import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "../pages/WelcomePage";
import Chatroom from "../pages/Chatroom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/chat/:room" element={<Chatroom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
