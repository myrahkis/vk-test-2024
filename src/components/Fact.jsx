import { useState } from "react";
import Loader from "./Loader";
import Error from "./Error";

function Fact() {
  const [fact, setFact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

        setFact(data.fact);
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

  function inputHandle(e) {
    setFact(e.target.value);
  }

  return (
    <div className="fact-wrapper">
      <label>
        <input type="text" value={fact} onChange={inputHandle} />
      </label>
      <button className="fact-btn" onClick={handleClick}>
        Get fact
      </button>
      {isLoading && <Loader />}
      {error && <Error error={error} />}
    </div>
  );
}

export default Fact;
