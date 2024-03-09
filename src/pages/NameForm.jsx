import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Error from "../components/Error";

function NameForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchAge() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(`https://api.agify.io/?name=${name}`, {
            signal: controller.signal,
          });

          if (!res.ok) throw new Error("Что-то не так с загрузкой:(");

          const data = await res.json();

          console.log(data.age);

          setAge(data.age);
          setError("");
        } catch (e) {
          console.error(e.message);

          if (e.name !== "AbortError") setError(e.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (name) fetchAge();

      return () => controller.abort();
    },
    [name]
  );

  function inputHandle(e) {
    setName(e.target.value);
  }

  function submitHandle(e) {
    e.preventDefault();
  }

  return (
    <>
      <form onSubmit={submitHandle}>
        <div className="wrapper">
          <input type="text" value={name} onChange={inputHandle} />
          {age && <label>you&apos;re {age} years old</label>}
          <button type="submit">Get age</button>
        </div>
      </form>
      {isLoading && <Loader />}
      {error && <Error />}
    </>
  );
}

export default NameForm;
