import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Error from "../components/Error";
import styles from "./NameForm.module.css";
import { QueryCache, useQuery } from "react-query";
import axios from "axios";
import useDebounce from "../hooks/useDebounce.js";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

async function fetchAge(name) {
  // const getFromCache = function (key) {
  //   return queryClient.getQueryData([key]);
  // };

  // const queryCache = new QueryCache({
  //   onError: (e) => console.log(e),
  //   onSuccess: (data) => console.log(data),
  // });

  if (name) {
    // const cache = getFromCache(`age}`);

    const { data } = await axios.get(`https://api.agify.io/?name=${name}`);

    const age = data.age;

    return age;
  }
}

const schema = yup
  .object()
  .shape({
    name: yup.string().min(2).max(32).required(),
  })
  .strict();

function NameForm() {
  const [name, setName] = useState("");
  const debouncedName = useDebounce(name, 3000);
  const [formData, setFormData] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  // const [age, setAge] = useState(0);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");

  const { data, isLoading, isError } = useQuery(
    ["age", formData],
    () => fetchAge(formData),
    {
      // keepPreviousData: true,
      refetchOnWindowFocus: false,
      cacheTime: 10_000,
      // onError: (error) => console.error(error["response"].data),
    }
  );
  // useEffect(
  //   function () {
  //     // const controller = new AbortController();
  //     const id = setInterval(async function fetchAge() {
  //       try {
  //         setIsLoading(true);
  //         setError("");
  //         /*           , {
  //           signal: controller.signal,
  //         } */

  //         const res = await fetch(`https://api.agify.io/?name=${name}`);

  //         if (!res.ok) throw new Error("Что-то не так с загрузкой:(");

  //         const data = await res.json();

  //         setAge(data.age);
  //         console.log(data.age);

  //         // for (let i = 0, n = cache.length; i < n; i++) {
  //         //   if (cache[i].name === name) {
  //         //     setAge(cache[i].age);
  //         //   } else {

  //         //   }
  //         // }

  //         // setName("")
  //         console.log(cache);

  //         // console.log(pastNames);
  //         setError("");
  //         // setName("");
  //       } catch (e) {
  //         console.error(e.message);

  //         if (e.name !== "AbortError") setError(e.message);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }, 3000);

  //     setCache(() => [...cache, { name: name, age: data.age }]);

  //     return () => clearInterval(id);
  //   },
  //   [name]
  // );

  function inputHandle(e) {
    setName(e.target.value);
  }

  async function onSubmitHandle(data) {
    await schema.validate(data, { abortEarly: false });
    data = schema.cast(data);
    setFormData(data.name);
    // console.log(`это имя из формы ${name}`);
    setName("");
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandle)}>
        <h2>Check how old you are by name</h2>
        <div className={styles.wrapper}>
          <div className={styles.inputWrapper}>
            <input
              {...register("name")}
              type="text"
              value={name}
              onChange={inputHandle}
              className={styles.nameInput}
              required
            />
            {data && (
              <label className={styles.result}>
                you&apos;re {data} years old
              </label>
            )}
          </div>
          <button type="submit" className={styles.submitBtn}>
            Get age
          </button>
        </div>
      </form>
      {isLoading && <Loader />}
      {isError && <Error error={errors.name?.message} />}
    </>
  );
}

export default NameForm;
