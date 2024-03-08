import { useState, useRef, useEffect } from "react";
import Loader from "./Loader";
import Error from "./Error";
import styles from "./Fact.module.css";

function Fact() {
  const [fact, setFact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputEl = useRef(null);
  const btnEl = useRef(null);

  inputEl.current = document.querySelector("#fact-input");

  //   function setFocus() {
  //     // const btn = btnEl.current;
  //     // function callback() {
  //       const firstWordIndex = inputEl.current.value.split(" ")[0].length;

  //       inputEl.current.focus();
  //       inputEl.current.setSelectionRange(firstWordIndex, firstWordIndex);
  //     }
  //     // btnEl.current.addEventListener("click", callback);
  //     // inputEl.current.addEventListener("focus", callback);

  //     // return () => btn.addEventListener("click", callback);
  //   }

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

        console.log(data.fact);

        // console.log(firstWordIndex);
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
    // const firstWordIndex = inputEl.current.value.split(" ")[0].length;

    // if (document.activeElement === inputEl.current) return;
    // inputEl.current.setSelectionRange(firstWordIndex, firstWordIndex + 10);
  }

  useEffect(
    function () {
      const firstWordIndex = fact.split(" ")[0].length;
      console.log(fact);
      // const firstWordIndex = fact.split(" ")[0].length;
      if (fact !== "") {
        inputEl.current.focus();
        inputEl.current.setSelectionRange(firstWordIndex, firstWordIndex);
      }
    },
    [fact]
  );

  //   function inputHandle(e) {
  //     setFact(e.target.value);
  //   }

  return (
    <div className={styles.factWrapper}>
      <label>
        <input
          id="fact-input"
          className={styles.factInput}
          type="text"
          value={fact}
          onChange={""}
          ref={inputEl}
        />
      </label>
      <button className={styles.factBtn} onClick={handleClick} ref={btnEl}>
        Get fact
      </button>
      {isLoading && <Loader />}
      {error && <Error error={error} />}
    </div>
  );
}

export default Fact;
