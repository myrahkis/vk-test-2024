import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Error from "../components/Error";
import styles from "./NameForm.module.css";

function NameForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pastNames, setPastNames] = useState([]);

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

//   function test() {
//     console.log(pastNames.indexOf(val));
//     if (pastNames.indexOf(val) === -1) {
//       setName(val);
//       setPastNames([...pastNames, val]);
//     } else {
//       throw new Error("Вы уже вводили это имя!");
//     }
//     console.log(pastNames);
//   }

  function inputHandle(e) {
    setName(e.target.value);
    setAge(0);
  }

  function submitHandle(e) {
    e.preventDefault();
  }

  return (
    <>
      <form onSubmit={submitHandle}>
        <h2>Check how old you are by name</h2>
        <div className={styles.wrapper}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={name}
              onChange={inputHandle}
              className={styles.nameInput}
            />
            {age !== 0 && (
              <label className={styles.result}>
                you&apos;re {age} years old
              </label>
            )}
          </div>
          <button type="submit" className={styles.submitBtn}>
            Get age
          </button>
        </div>
      </form>
      {isLoading && <Loader />}
      {error && <Error />}
    </>
  );
}

export default NameForm;
