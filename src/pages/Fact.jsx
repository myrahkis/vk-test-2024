import { useState, useRef, useEffect } from "react";
import Loader from "../components/Loader";
import Error from "../components/Error";
import styles from "./Fact.module.css";
import axios from "axios";
import { useQuery } from "react-query";

async function fetchFact() {
  const { data } = await axios.get(`https://catfact.ninja/fact`);
  return data.fact;
}

function Fact() {
  const [fact, setFact] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");
  const inputEl = useRef(null);
  const btnEl = useRef(null);
  const { data, refetch, isLoading, isError } = useQuery("fact", fetchFact, {
    refetchOnWindowFocus: false,
    // onError: (error) => console.error(error["response"].data),
    // enabled: fact === "" && false,
  });

  function handleClick() {
    setFact(data);
    refetch();
    // async function getFact() {
    //   try {
    //     setIsLoading(true);
    //     setError("");

    //     const res = await fetch("https://catfact.ninja/fact");

    //     if (!res.ok) {
    //       throw new Error("Что-то пошло не так с загрузкой факта:(");
    //     }

    //     const data = await res.json();

    //     // console.log(data.fact);

    //     setFact(() => data.fact);
    //     setError("");
    //   } catch (e) {
    //     console.error(e);

    //     setError(e.message);
    //   } finally {
    //     setIsLoading(false);
    //   }
    //   //   console.log(data.fact);
    // }
    // getFact();
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
      {isError && <Error error={"АА ОШИБКА"} />}
    </>
  );
}

export default Fact;
