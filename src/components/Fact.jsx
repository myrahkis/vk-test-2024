import { useState } from "react";

function Fact() {
  const [fact, setFact] = useState("");

  function handleClick() {
    async function getFact() {
      const res = await fetch("https://catfact.ninja/fact");
      const data = await res.json();

      setFact(data.fact);
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
    </div>
  );
}

export default Fact;
