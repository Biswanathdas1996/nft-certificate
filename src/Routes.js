import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import CreateNFT from "./pages/CreateNFT";
import Header from "./components/Header";

function Routing() {
  return (
    <>
      <Header />
      <Routes>
        <Route exact path="/:event/:date/:tokenId" element={<Home />} />
        <Route exact path="/mint" element={<CreateNFT />} />
      </Routes>
    </>
  );
}

export default Routing;
