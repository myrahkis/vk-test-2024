import { useState } from "react";
import styles from "./App.module.css";
import Fact from "./components/Fact";

function App() {
  return (
    <>
      <div className={styles.main}>
        <Fact />
      </div>
    </>
  );
}

export default App;
