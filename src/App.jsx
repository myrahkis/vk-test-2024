import { useState } from "react";
import styles from "./App.module.css";
import Fact from "./pages/Fact";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NameForm from "./pages/NameForm";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <BrowserRouter basename="/vk-test-2024">
        <NavBar />
        <Routes>
          <Route path="/vk-test-2024" element={<Home />} />
          <Route path="/cat-fact" element={<Fact />} />
          <Route path="/get-your-age" element={<NameForm />} />
          {/* <Route path='/*' element={<PageNotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
