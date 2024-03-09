import { useState, useRef, useEffect } from "react";
import Loader from "../components/Loader";
import Error from "../components/Error";
import styles from "./Fact.module.css";

function Fact() {
  const [fact, setFact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputEl = useRef(null);
  const btnEl = useRef(null);

  function handleClick() {
    async function getFact() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch("https://catfact.ninja/fact");

        if (!res.ok) {
          throw new Error("Что-то пошло не так с загрузкой факта:(");
        }

        const data = await res.json();

        // console.log(data.fact);

        setFact(() => data.fact);
        setError("");
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
      //   console.log(data.fact);
    }
    getFact();
  }

  useEffect(
    function () {
      const firstWordIndex = fact.split(" ")[0].length;
      // console.log(fact);

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
        <button className={styles.factBtn} onClick={handleClick} ref={btnEl}>
          Get fact
        </button>
      </div>
      {isLoading && <Loader />}
      {error && <Error error={error} />}
    </>
  );
}

export default Fact;
