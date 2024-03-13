import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Error from "../components/Error";
import styles from "./NameForm.module.css";
import { QueryCache, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import useDebounce from "../hooks/useDebounce.js";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

/* @todo: осталось прерывание устаревших запросов */
let cache = [];

async function fetchAge(signal, name) {
  if (name) {
    for (let i = 0, n = cache.length; i < n; i++) {
      if (name === cache[i].name) {
        // console.log(true);
        return cache[i].age;
      }
    }

    const { data } = await axios.get(`https://api.agify.io/?name=${name}`, {
      signal,
    });

    const age = data.age;

    const newObj = {
      name: name,
      age: age,
    };

    cache.push(newObj);

    // console.log(cache);
    return age;
  }
}

const schema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[aA-zZ]+$/, "The name must consist of letters only")
    .min(2)
    .max(32)
    .required(),
});

function NameForm() {
  const [name, setName] = useState("");
  const debouncedName = useDebounce(name, 3000);
  const [formData, setFormData] = useState("");
  const {
    // register,
    control,
    trigger,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  // const [age, setAge] = useState(0);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");

  const { data, isLoading, isError } = useQuery(
    ["debouncedName", debouncedName],
    ({ signal }) => fetchAge(signal, debouncedName),
    {
      // keepPreviousData: true,
      refetchOnWindowFocus: false,
      // cacheTime: 10_000,
      // onError: (error) => console.error(error["response"].data),
    }
  );
  const {
    data: dataForm,
    isLoading: isLoadingForm,
    isError: isErrorForm,
  } = useQuery(
    ["formData", formData],
    ({ signal }) => fetchAge(signal, formData),
    {
      // keepPreviousData: true,
      refetchOnWindowFocus: false,
      // cacheTime: 10_000,
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

  async function inputHandle(value) {
    const valid = await trigger("name");
    // console.log("valid", valid, "value", value);

    if (!valid) return;

    setName(value);
  }

  function onSubmitHandle(data) {
    setFormData(data.name);
    // console.log(`это имя из формы ${name}`);
    setName("");
    reset();
  }

  // console.log(formData);
  // console.log(debouncedName);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandle)}>
        <h2>Check how old you are by name</h2>
        <div className={styles.wrapper}>
          <div className={styles.inputWrapper}>
            <Controller
              name="name"
              defaultValue=""
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <input
                  {...field}
                  // {...register("name")}
                  // type="text"
                  value={value}
                  onChange={({ target: { value } }) => {
                    onChange(value);
                    inputHandle(value);
                  }}
                  className={styles.nameInput}
                  required
                />
              )}
            />
            {(data || dataForm) && (
              <label className={styles.result}>
                you&apos;re {data || dataForm} years old
              </label>
            )}
          </div>
          <button type="submit" className={styles.submitBtn}>
            Get age
          </button>
        </div>
      </form>
      {(isLoading || isLoadingForm) && <Loader />}
      {(isError || isErrorForm || errors.name) && (
        <Error error={errors.name?.message} />
      )}
    </>
  );
}

export default NameForm;
