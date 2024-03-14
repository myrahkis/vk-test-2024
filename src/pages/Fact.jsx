import { useState, useRef, useEffect } from "react";
import Loader from "../components/Loader";
import Error from "../components/Error";
import styles from "./Fact.module.css";
import axios from "axios";
import { useQuery } from "react-query";

async function fetchFact(signal) {
  const { data } = await axios.get(`https://catfact.ninja/fact`, { signal });
  return data.fact;
}

function Fact() {
  const [fact, setFact] = useState("");
  const inputEl = useRef(null);
  const { data, refetch, isLoading, isError } = useQuery(
    "fact",
    ({ signal }) => fetchFact(signal),
    {
      refetchOnWindowFocus: false,
    }
  );

  function handleClick() {
    setFact(data);
    refetch();
  }

  useEffect(
    function () {
      const firstWordIndex = fact.split(" ")[0].length;

      if (fact !== "") {
        inputEl.current.focus();
        inputEl.current.setSelectionRange(firstWordIndex, firstWordIndex);
      }
    },
    [fact]
  );

  function inputHandle(e) {
    setFact(e.target.value);
  }

  return (
    <>
      <h2>Get a cool cat fact</h2>
      <div className={styles.factWrapper}>
        <textarea
          className={styles.factInput}
          type="text"
          value={fact}
          onChange={inputHandle}
          ref={inputEl}
          rows="3"
          cols="60"
        />
        <button className={styles.factBtn} onClick={handleClick}>
          Get fact
        </button>
      </div>
      {isLoading && <Loader />}
      {isError && <p className={styles.errorMes}>Something went wrong!</p>}
    </>
  );
}

export default Fact;
