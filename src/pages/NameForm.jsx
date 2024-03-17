import { useState } from "react";
import Loader from "../components/Loader";
import styles from "./NameForm.module.css";
import { useQuery } from "react-query";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const cache = [];

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
  const [timeoutId, setTimeoutId] = useState(null);
  const {
    control,
    trigger,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { data, isLoading, isError, refetch } = useQuery(
    ["name", name],
    ({ signal }) => fetchAge(signal, name),
    {
      enabled: false,
    }
  );

  async function inputHandle(value) {
    const valid = await trigger("name");

    if (!valid) return;

    setName(value);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const id = setTimeout(() => {
      refetch();
    }, 3000);
    setTimeoutId(id);
  }

  function onSubmitHandle(data) {
    setName(data.name);

    refetch();
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
            {data && (
              <label className={styles.result}>
                You&apos;re {data} years old!
              </label>
            )}
          </div>
          <button type="submit" className={styles.submitBtn}>
            Get age
          </button>
        </div>
      </form>
      {isLoading && <Loader />}
      {isError && <p className={styles.errorMes}>Something went wrong!</p>}
      {errors && <p className={styles.errorMes}>{errors.name?.message}</p>}
    </>
  );
}

export default NameForm;
