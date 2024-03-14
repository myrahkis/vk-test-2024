import { useState } from "react";
import Loader from "../components/Loader";
import Error from "../components/Error";
import styles from "./NameForm.module.css";
import { useQuery } from "react-query";
import axios from "axios";
import useDebounce from "../hooks/useDebounce.js";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

let cache = [];

async function fetchAge(signal, name) {
  if (name) {
    for (let i = 0, n = cache.length; i < n; i++) {
      if (name === cache[i].name) {
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
    control,
    trigger,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { data, isLoading, isError } = useQuery(
    ["debouncedName", debouncedName],
    ({ signal }) => fetchAge(signal, debouncedName),
    {
      refetchOnWindowFocus: false,
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
      refetchOnWindowFocus: false,
    }
  );

  async function inputHandle(value) {
    const valid = await trigger("name");

    if (!valid) return;

    setName(value);
  }

  function onSubmitHandle(data) {
    setFormData(data.name);

    setName("");
    reset();
  }

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
                You&apos;re {data || dataForm} years old!
              </label>
            )}
          </div>
          <button type="submit" className={styles.submitBtn}>
            Get age
          </button>
        </div>
      </form>
      {(isLoading || isLoadingForm) && <Loader />}
      {(isError || isErrorForm) && (
        <p className={styles.errorMes}>Something went wrong!</p>
      )}
      {errors && <p className={styles.errorMes}>{errors.name?.message}</p>}
    </>
  );
}

export default NameForm;
